using Domain.Entities.CandDocs;
using Infrastructure.Context;
using Infrastructure.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;

namespace Application.Features.ImportErrors.Commands
{
    public class FixImportErrorCommandHandler
        : IRequestHandler<FixImportErrorCommand, bool>
    {
        private readonly FsContext _context;
        private readonly ILogger<FixImportErrorCommandHandler> _logger;

        public FixImportErrorCommandHandler(FsContext context, ILogger<FixImportErrorCommandHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> Handle(FixImportErrorCommand request, CancellationToken cancellationToken)
        {
            using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var document = await _context.CandidateDocuments
                    .Include(d => d.ImportErrors)
                    .FirstOrDefaultAsync(d => d.Id == request.DocumentId, cancellationToken);

                if (document == null)
                    throw new BusinessException("Candidate document not found");


                // ======================================================
                //  VALIDATION DU CONTEXTE (PARENT vs REQUEST)
                // ======================================================

                if (request.Session != request.ExpectedSession)
                {
                    throw new BusinessException(
                        "Session mismatch. You are not allowed to change the session."
                    );
                }

                if (request.ExamCode != request.ExpectedExamCode)
                {
                    throw new BusinessException(
                        "Exam code mismatch. You are not allowed to change the exam code."
                    );
                }

                if (request.CentreCode != request.ExpectedCentreCode)
                {
                    if (!request.ForceCentreCorrection)
                    {
                        throw new BusinessException(
                            "Centre mismatch. Enable centre correction to proceed."
                        );
                    }
                }

                // CIN LENGTH
                if (string.IsNullOrWhiteSpace(request.CandidateNumber) ||
                    request.CandidateNumber.Length != 9)
                    throw new BusinessException("Candidate number must be exactly 9 characters.");

                // CIN → CENTRE
                var centreFromCin = request.CandidateNumber.Substring(0, 5);
                if (centreFromCin != request.CentreCode)
                    throw new BusinessException("CIN does not match centre code.");

                // CIN → 6th DIGIT
                char expectedDigit;
                if (request.ExamCode.StartsWith("5"))
                    expectedDigit = '5';
                else if (request.ExamCode.StartsWith("7"))
                    expectedDigit = '7';
                else
                    throw new BusinessException("Unsupported exam code.");

                if (request.CandidateNumber[5] != expectedDigit)
                    throw new BusinessException(
                        $"Invalid CIN. 6th digit must be '{expectedDigit}'.");

                // NAME NORMALIZATION
                var normalizedName = request.CandidateName?
                    .Trim()
                    .ToUpperInvariant();

                if (string.IsNullOrWhiteSpace(normalizedName))
                    throw new BusinessException("Candidate name is required.");

                // ======================================================
                //  ⬆⬆⬆ FIN DES VALIDATIONS ⬆⬆⬆
                // ======================================================

                // 1️⃣ Mise à jour des données corrigées
                document.Session = request.Session;
                document.ExamCode = request.ExamCode;
                document.CentreCode = request.CentreCode;
                document.CandidateNumber = request.CandidateNumber;
                document.CandidateName = normalizedName;
                document.IsValid = true;


                // 2️⃣ Suppression des erreurs
                if (document.ImportErrors?.Any() == true)
                {
                    //foreach (var err in document.ImportErrors)
                    //{
                    //    err.IsResolved = true;
                    //    err.ResolvedOn = DateTime.UtcNow;
                    //}
                    _context.ImportErrors.RemoveRange(document.ImportErrors);
                }

                // 3️⃣ Déplacement du fichier PDF
                MovePdfFromErrorToSuccess(document, request.CentreCode);

                // Optional but GOLD for audit
                //document.CorrectionMode = request.ForceCentreCorrection
                //    ? "MANUAL_CENTRE_OVERRIDE"
                //    : "STANDARD_FIX";

                //document.CorrectedOn = DateTime.UtcNow;
                //document.CorrectedBy = _currentUserService.UserId;

                await _context.SaveChangesAsync(cancellationToken);
                await tx.CommitAsync(cancellationToken);

                return true;
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync(cancellationToken);
                _logger.LogError(ex, "Failed to fix import error for document {Id}", request.DocumentId);
                throw;
            }
        }

        private void MovePdfFromErrorToSuccess(
    CandidateDocument document,
    string targetCentreCode
)
        {
            if (string.IsNullOrWhiteSpace(document.FilePath))
                return;

            var currentPath = document.FilePath;

            if (!File.Exists(currentPath))
                return;

            var directory = Path.GetDirectoryName(currentPath)!;
            var fileName = Path.GetFileName(currentPath);

            // directory = ...\Storage\2025\7101\22240\errors
            var parentDir = Directory.GetParent(directory); // centreCode
            if (parentDir == null)
                throw new InvalidOperationException("Invalid error directory structure.");

            var examCentreDir = parentDir.FullName; // ...\Storage\2025\7101\22240
            var examDir = parentDir.Parent?.FullName; // ...\Storage\2025\7101
            if (examDir == null)
                throw new InvalidOperationException("Invalid exam directory structure.");

            var successDir = Path.Combine(
                examDir,
                targetCentreCode,
                "success"
            );

            Directory.CreateDirectory(successDir);

            var successPath = Path.Combine(successDir, fileName);

            File.Move(currentPath, successPath, overwrite: true);

            document.FilePath = successPath;
        }


        /*private void MovePdfFromErrorToSuccess(CandidateDocument document)
        {
            if (string.IsNullOrWhiteSpace(document.FilePath))
                return;

            var currentPath = document.FilePath;

            if (!System.IO.File.Exists(currentPath))
                return;

            var successPath = currentPath.Replace(
                Path.DirectorySeparatorChar + "errors" + Path.DirectorySeparatorChar,
                Path.DirectorySeparatorChar + "success" + Path.DirectorySeparatorChar
            );

            var successDir = Path.GetDirectoryName(successPath);
            if (!Directory.Exists(successDir))
                Directory.CreateDirectory(successDir);

            System.IO.File.Move(currentPath, successPath, overwrite: true);

            document.FilePath = successPath;
        }*/

        /*private void MovePdfFromErrorToSuccess(CandidateDocument document, string targetCentreCode)
        {
            if (string.IsNullOrWhiteSpace(document.FilePath))
                return;

            var currentPath = document.FilePath;

            if (!File.Exists(currentPath))
                return;

            var parts = currentPath.Split(Path.DirectorySeparatorChar);

            var errorsIndex = Array.FindIndex(parts,
                p => p.Equals("errors", StringComparison.OrdinalIgnoreCase));

            if (errorsIndex < 3)
                throw new InvalidOperationException(
                    $"Invalid error file path structure: {currentPath}");

            var session = parts[errorsIndex - 3];
            var examCode = parts[errorsIndex - 2];
            var fileName = parts[^1];

            // root path BEFORE "Storage"
            var rootPath = Path.Combine(parts.Take(errorsIndex - 3).ToArray());

            var successPath = Path.Combine(
                rootPath,
                "",
                session,
                examCode,
                targetCentreCode,
                "success",
                fileName
            );

            var successDir = Path.GetDirectoryName(successPath)!;
            Directory.CreateDirectory(successDir);

            File.Move(currentPath, successPath, overwrite: true);

            document.FilePath = successPath;
        }*/


    }
}
