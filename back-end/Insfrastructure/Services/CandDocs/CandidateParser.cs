using Domain.DTO.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.Models.CandDocs;
using Infrastructure.Utils;
using System.Text.RegularExpressions;

namespace Infrastructure.Services.CandDocs
{
    public class CandidateParser : ICandidateParser
    {
        // ================= CLEAN OCR =================
        private string CleanOcrText(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text ?? "";

            string cleaned = TextUtils.RemoveAccents(text);

            cleaned = Regex.Replace(cleaned, @"[^\x20-\x7E\r\n\tÀ-ÿ]", " ");

            cleaned = cleaned.Replace("|", " ")
                             .Replace("¦", " ")
                             .Replace("—", " ")
                             .Replace("~", " ")
                             .Replace("=", " ")
                             .Replace(";", ":");

            cleaned = Regex.Replace(cleaned, @"(?m)^\s*[\d\s\|\-]{1,}\s+(?=[A-Za-zÀ-ÿ])", "");

            cleaned = Regex.Replace(cleaned, @"\t+", " ");
            cleaned = Regex.Replace(cleaned, @"[ ]{2,}", " ");

            cleaned = Regex.Replace(cleaned, @"C[\.\s]*I[\.\s]*N", "CIN", RegexOptions.IgnoreCase);
            cleaned = cleaned.Replace("C.LLN", "CIN")
                             .Replace("C.LN", "CIN")
                             .Replace("C.1.N", "CIN")
                             .Replace("C.L.N", "CIN")
                             .Replace("C.ILN", "CIN");

            cleaned = Regex.Replace(
                cleaned,
                @"Examination\s*Cent(er|re)\s*[:\-]?",
                "EXAMINATION_CENTRE:",
                RegexOptions.IgnoreCase
            );

            cleaned = cleaned.Replace("Bxamination Centre", "EXAMINATION_CENTRE")
                             .Replace("Exatnitiation Centre", "EXAMINATION_CENTRE")
                             .Replace("Examination Contre.", "EXAMINATION_CENTRE:")
                             .Replace("Examination Centre.", "EXAMINATION_CENTRE:");

            return cleaned.Trim();
        }

        // ================= HELPERS =================
        private string ToUpperClean(string s)
        {
            if (string.IsNullOrWhiteSpace(s)) return "";
            s = s.ToUpperInvariant();
            return Regex.Replace(s, @"\s{2,}", " ").Trim();
        }

        // ================= CIN + NAME (STRICT) =================
        private (string cin, string name) ExtractCinAndNameStrict(string[] lines)
        {
            foreach (var line in lines)
            {
                if (!Regex.IsMatch(line, @"\bCIN\b", RegexOptions.IgnoreCase))
                    continue;

                // ignore Payment / Receipt
                if (Regex.IsMatch(line, @"PAYMENT|RECEIPT", RegexOptions.IgnoreCase))
                    continue;

                var m = Regex.Match(line, @"\b(\d{8,10})\b");
                if (!m.Success)
                    continue;

                var cin = m.Groups[1].Value;

                var namePart = line[(m.Index + m.Length)..].Trim();
                namePart = Regex.Replace(namePart, @"^[^A-Z]+", "");
                namePart = Regex.Replace(namePart, @"[^\p{L}\s\-']", "");
                namePart = Regex.Replace(namePart, @"\s{2,}", " ").Trim();

                if (Regex.IsMatch(namePart, @"GENERAL|CERTIFICATE|BOARD|TIMETABLE", RegexOptions.IgnoreCase))
                    return ("", "");

                return (cin, ToUpperClean(namePart));
            }

            return ("", "");
        }

        // ================= CENTRE (SAFE) =================
        private string ExtractCentreNumberSafe(string[] lines)
        {
            const int MAX_LOOKAHEAD = 10;

            for (int i = 0; i < lines.Length; i++)
            {
                //if (!Regex.IsMatch(
                //        lines[i],
                //        @"EXAMINATION\s*CENT(RE|ER)|CENTRE\s+D[' ]?EXAMEN",
                //        RegexOptions.IgnoreCase))
                //    continue;
                if (!lines[i].ToUpperInvariant().Contains("EXAMINATION") || !lines[i].ToUpperInvariant().Contains("CENT"))
                {
                    continue;
                }


                // 1️⃣ même ligne
                var sameLine = Regex.Match(lines[i], @"\b(\d{5})\b");
                if (sameLine.Success && !IsYear(sameLine.Value))
                    return sameLine.Value;

                // 2️⃣ lignes suivantes
                int inspected = 0;
                for (int j = i + 1; j < lines.Length && inspected < MAX_LOOKAHEAD; j++)
                {
                    inspected++;
                    var l = lines[j].Trim();
                    if (string.IsNullOrWhiteSpace(l)) continue;

                    var m = Regex.Match(l, @"\b(\d{5})\b");
                    if (m.Success && !IsYear(m.Value))
                        return m.Value;
                }

                break;
            }

            return "";
        }

        private bool IsYear(string value)
        {
            if (!int.TryParse(value, out var y)) return false;
            return y >= 1990 && y <= DateTime.Now.Year + 1;
        }



        // ================= SESSION =================
        private int? ExtractSessionYear(string text)
        {
            var m = Regex.Match(text, @"\b(June|Juin)\s+(\d{4})\b", RegexOptions.IgnoreCase);
            if (m.Success && int.TryParse(m.Groups[2].Value, out var y))
                return y;

            m = Regex.Match(text, @"\b(20\d{2})\b");
            if (m.Success && int.TryParse(m.Groups[1].Value, out y))
                return y;

            return null;
        }

        // ================= MAIN PARSE =================
        public CandidateInfo Parse(string ocrText)
        {
            var info = new CandidateInfo
            {
                RawOcrText = ocrText ?? ""
            };

            if (string.IsNullOrWhiteSpace(ocrText))
                return info;

            var cleaned = CleanOcrText(ocrText);

            var lines = cleaned
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(l => l.Trim())
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .ToArray();

            // CIN + NAME
            var (cin, name) = ExtractCinAndNameStrict(lines);
            info.CandidateNumber = cin;
            info.CandidateName = name;

            // CENTRE
            info.CentreNumber = ExtractCentreNumberSafe(lines);

            // SESSION
            info.SessionYear = ExtractSessionYear(cleaned);

            return info;
        }

        public CandidateAutoFillDto ParseAutoFill(string ocrText)
        {
            var result = new CandidateAutoFillDto();

            if (string.IsNullOrWhiteSpace(ocrText))
            {
                result.IsConfidenceLow = true;
                return result;
            }

            var text = NormalizeOcrText(ocrText);

            string? candidateNumber = null;
            string? candidateName = null;
            string? centreCode = null;

            // ==================================================
            // 1️⃣ Candidate Number
            // ==================================================

            // 1a) CIN après "CIN and Name" (>=9)
            var cinAfterNameMatch = Regex.Match(
                text,
                @"CIN\s*(?:and|und|&)?\s*Name\s*[:\-]?\s*(\d+)",
                RegexOptions.IgnoreCase
            );

            if (cinAfterNameMatch.Success &&
                cinAfterNameMatch.Groups[1].Value.Length >= 9)
            {
                candidateNumber = cinAfterNameMatch.Groups[1].Value.Substring(0, 9);
            }

            // 1b) Fallback Receipt
            if (string.IsNullOrEmpty(candidateNumber))
            {
                var receiptMatch = Regex.Match(
                    text,
                    @"Receipt\s*No\.?\s*[:\-]?\s*(\d{9,10})",
                    RegexOptions.IgnoreCase
                );

                if (!receiptMatch.Success)
                {
                    receiptMatch = Regex.Match(
                        text,
                        @"\b(\d{9,10})[A-Z]{2}\d+",
                        RegexOptions.IgnoreCase
                    );
                }

                if (receiptMatch.Success)
                    candidateNumber = receiptMatch.Groups[1].Value.Substring(0, 9);
            }

            // 1c) Fallback paiement : "CIN 222277002"
            if (string.IsNullOrEmpty(candidateNumber))
            {
                var cinDirectMatch = Regex.Match(
                    text,
                    @"\bCIN\s+(\d{9})\b",
                    RegexOptions.IgnoreCase
                );

                if (cinDirectMatch.Success)
                    candidateNumber = cinDirectMatch.Groups[1].Value;
            }

            // ==================================================
            // 2️⃣ Candidate Name
            // ==================================================

            // 2a) Après "CIN and Name"
            var nameAfterCinMatch = Regex.Match(
                text,
                @"CIN\s*(?:and|und|&)?\s*Name\s*(?:me|:)?\s*\d*\s*([A-Z]{4,}(?:\s+[A-Z]{2,})*)",
                RegexOptions.IgnoreCase
            );

            if (nameAfterCinMatch.Success)
                candidateName = nameAfterCinMatch.Groups[1].Value.Trim();

            // 2b) Fallback paiement : "Candidate KENGNE JUNIOR"
            if (string.IsNullOrEmpty(candidateName))
            {
                var candidateLineMatch = Regex.Match(
                    text,
                    @"Candidate\s+([A-Z]{2,}(?:\s+[A-Z]{2,})*)",
                    RegexOptions.IgnoreCase
                );

                if (candidateLineMatch.Success)
                    candidateName = candidateLineMatch.Groups[1].Value.Trim();
            }

            // ==================================================
            // 3️⃣ Centre Code
            // ==================================================

            // 3a) Règle métier principale : depuis CIN
            if (!string.IsNullOrEmpty(candidateNumber) &&
                candidateNumber.Length >= 5)
            {
                centreCode = candidateNumber.Substring(0, 5);
            }

            // 3b) Fallback paiement : "CentreNo. | 22227"
            if (string.IsNullOrEmpty(centreCode))
            {
                var centreDirectMatch = Regex.Match(
                    text,
                    @"Centre\s*No\.?\s*\|?\s*(\d{4,6})",
                    RegexOptions.IgnoreCase
                );

                if (centreDirectMatch.Success)
                    centreCode = centreDirectMatch.Groups[1].Value;
            }

            // ==================================================
            // 4️⃣ Résultat final
            // ==================================================

            result.CandidateNumber = candidateNumber;
            result.CandidateName = candidateName;
            result.CentreCode = centreCode;

            result.IsConfidenceLow =
                string.IsNullOrEmpty(candidateNumber) ||
                string.IsNullOrEmpty(candidateName) ||
                string.IsNullOrEmpty(centreCode);

            return result;
        }




        // 🔒 Privée : utilisée uniquement par le parser
        private static string NormalizeOcrText(string input)
        {
            return input
                .Replace("|", " ")
                .Replace("_", " ")
                .Replace("\r", " ")
                .Replace("\n", " ")
                .Replace("  ", " ")
                .Trim();
        }

        private static string SplitOcrName(string input)
        {
            // ESSENIESSENIADEL → ESSENI ESSENI ADEL (approximatif)
            return Regex.Replace(input, @"([A-Z]{4,})([A-Z]{4,})", "$1 $2");
        }
    }
}
