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
            if (string.IsNullOrWhiteSpace(text))
                return text ?? string.Empty;

            // =================================================
            // 1️⃣ Nettoyage de base
            // =================================================

            string cleaned = TextUtils.RemoveAccents(text);

            // Supprimer caractères OCR non imprimables
            cleaned = Regex.Replace(
                cleaned,
                @"[^\x20-\x7E\r\n\tÀ-ÿ]",
                " "
            );

            // =================================================
            // 2️⃣ Remplacement des symboles parasites
            // =================================================

            cleaned = cleaned
                .Replace("|", " ")
                .Replace("¦", " ")
                .Replace("—", " ")
                .Replace("~", " ")
                .Replace("=", " ")
                .Replace(";", ":");

            // =================================================
            // 3️⃣ Suppression des préfixes numériques isolés
            // (cas OCR fréquent au début de ligne)
            // =================================================

            cleaned = Regex.Replace(
                cleaned,
                @"(?m)^\s*[\d\s\|\-]{1,}\s+(?=[A-Za-zÀ-ÿ])",
                ""
            );

            // =================================================
            // 4️⃣ Normalisation des espaces
            // =================================================

            cleaned = Regex.Replace(cleaned, @"\t+", " ");
            cleaned = Regex.Replace(cleaned, @" {2,}", " ");

            // =================================================
            // 5️⃣ Normalisation CIN (large mais SAFE)
            // =================================================

            cleaned = Regex.Replace(
                cleaned,
                @"\bC[\.\s\|\-]*[I1L][\.\s\|\-]*N\b",
                "CIN",
                RegexOptions.IgnoreCase
            );

            cleaned = cleaned
                .Replace("C.LLN", "CIN")
                .Replace("C.LN", "CIN")
                .Replace("C.1.N", "CIN")
                .Replace("C.L.N", "CIN")
                .Replace("C.ILN", "CIN");

            // =================================================
            // 6️⃣ Normalisation EXAMINATION_CENTRE
            // =================================================

            cleaned = Regex.Replace(
                cleaned,
                @"Examination\s*Cent(er|re)\s*[:\-]?",
                "EXAMINATION_CENTRE:",
                RegexOptions.IgnoreCase
            );

            cleaned = cleaned
                .Replace("Bxamination Centre", "EXAMINATION_CENTRE")
                .Replace("Exatnitiation Centre", "EXAMINATION_CENTRE")
                .Replace("Examination Contre.", "EXAMINATION_CENTRE:")
                .Replace("Examination Centre.", "EXAMINATION_CENTRE:");

            return cleaned.Trim();
        }

        /*private string CleanOcrText(string text)
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
        }*/

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

        // =====================================================
        // 🔹 MÉTHODE PRINCIPALE
        // =====================================================
        public CandidateAutoFillDto ParseAutoFill(string ocrText)
        {
            var result = new CandidateAutoFillDto();

            if (string.IsNullOrWhiteSpace(ocrText))
            {
                result.IsConfidenceLow = true;
                return result;
            }

            var text = NormalizeOcrText(ocrText);

            // =========================
            // 1️⃣ Candidate Number
            // =========================
            var candidateNumber = ExtractCandidateNumber(text);

            // =========================
            // 2️⃣ Candidate Name
            // =========================
            var candidateName = ExtractCandidateName(text);

            // =========================
            // 3️⃣ Centre Code (règle métier)
            // =========================
            string? centreCode = null;
            if (!string.IsNullOrEmpty(candidateNumber) && candidateNumber.Length >= 5)
                centreCode = candidateNumber.Substring(0, 5);

            // =========================
            // 4️⃣ Résultat final
            // =========================
            result.CandidateNumber = candidateNumber;
            result.CandidateName = candidateName;
            result.CentreCode = centreCode;

            result.IsConfidenceLow =
                string.IsNullOrEmpty(candidateNumber) ||
                string.IsNullOrEmpty(candidateName) ||
                string.IsNullOrEmpty(centreCode);

            return result;
        }

        // =====================================================
        // 🔹 EXTRACTION DU CANDIDATE NUMBER
        // =====================================================
        private static string? ExtractCandidateNumber(string text)
        {
            // 1️⃣ Priorité : CIN / CAN and Name (>= 9 chiffres)
            var cinMatch = Regex.Match(
                text,
                @"CIN\s*and\s*Name\s*[:\-]?\s*(\d{9,10})",
                RegexOptions.IgnoreCase
            );

            if (cinMatch.Success)
                return cinMatch.Groups[1].Value.Substring(0, 9);

            // 2️⃣ Fallback : Receipt No
            var receiptMatch = Regex.Match(
                text,
                @"Receipt\s*No\.?\s*[:\-]?\s*(\d{9,10})",
                RegexOptions.IgnoreCase
            );

            if (!receiptMatch.Success)
            {
                // OCR bruité : 1126952590L100274
                receiptMatch = Regex.Match(
                    text,
                    @"\b(\d{9,10})[A-Z]\d+",
                    RegexOptions.IgnoreCase
                );
            }

            if (receiptMatch.Success)
                return receiptMatch.Groups[1].Value.Substring(0, 9);

            // 3️⃣ Fallback paiement : "CIN 222277002"
            var directCin = Regex.Match(
                text,
                @"\bCIN\s+(\d{9})\b",
                RegexOptions.IgnoreCase
            );

            if (directCin.Success)
                return directCin.Groups[1].Value;

            return null;
        }

        // =====================================================
        // 🔹 EXTRACTION DU NOM DU CANDIDAT
        // =====================================================
        private static string? ExtractCandidateName(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return null;

            // =====================================================
            // 1️⃣ Trouver l’ancre CIN ou NAME (CIN prioritaire)
            // =====================================================

            int anchorIndex = FindCinOrNameAnchorIndex(text);
            if (anchorIndex < 0)
                return null;

            // =====================================================
            // 2️⃣ Texte après l’ancre
            // =====================================================

            var afterAnchor = text.Substring(anchorIndex + 3); // saute "CIN"

            // On travaille sur une version normalisée pour l’analyse
            var working = afterAnchor.ToUpperInvariant();

            // =====================================================
            // 3️⃣ Nettoyage léger (NE PAS sur-nettoyer)
            // =====================================================

            working = Regex.Replace(working, @"[^A-Z\s]", " ");
            working = Regex.Replace(working, @"\s{2,}", " ").Trim();

            if (string.IsNullOrWhiteSpace(working))
                return null;

            // =====================================================
            // 4️⃣ Découper en mots
            // =====================================================

            var words = working.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // =====================================================
            // 5️⃣ Fenêtre glissante pour trouver un vrai nom
            // =====================================================

            for (int i = 0; i < words.Length; i++)
            {
                for (int size = 2; size <= 5 && i + size <= words.Length; size++)
                {
                    var candidate = string.Join(" ", words.Skip(i).Take(size));

                    // ❌ rejeter mots métier / institutionnels
                    if (IsForbiddenNameSegment(candidate))
                        continue;

                    // ❌ rejeter segments triviaux
                    if (IsTrivialName(candidate))
                        continue;

                    // ❌ rejeter si pas un nom humain plausible
                    if (!LooksLikeHumanName(candidate))
                        continue;

                    return candidate;
                }
            }

            return null;
        }

        private static bool IsTrivialName(string name)
        {
            return Regex.IsMatch(
                name,
                @"^(AND|NAME|AND\s+NAME)$",
                RegexOptions.IgnoreCase
            );
        }

        private static bool LooksLikeHumanName(string text)
        {
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // 2 à 5 mots
            if (words.Length < 2 || words.Length > 5)
                return false;

            // chaque mot doit être alphabétique et raisonnable
            return words.All(w => w.Length >= 2 && w.All(char.IsLetter));
        }


        private static int FindCinOrNameAnchorIndex(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return -1;

            // 🔹 1. CIN prioritaire (tolérant OCR)
            var normalized = NormalizeForAnchor(text);
            var cinIndex = normalized.IndexOf("CIN");
            if (cinIndex >= 0)
                return cinIndex;

            // 🔹 2. NAME en fallback (label isolé uniquement)
            var nameMatch = Regex.Match(
                text,
                @"\b(AND\s+NAME|NAME)\b\s*[:\-]?",
                RegexOptions.IgnoreCase
            );

            if (nameMatch.Success)
                return nameMatch.Index;

            return -1;
        }

        private static string NormalizeForAnchor(string input)
        {
            return input
                .ToUpperInvariant()
                .Replace(".", "")
                .Replace("|", "")
                .Replace(":", "")
                .Replace("-", "")
                .Replace(" ", "");
        }

        private static bool IsForbiddenNameSegment(string text)
        {
            return Regex.IsMatch(
                text,
                @"\b(CIN|NAME|AND|DATE|SEX|FEMALE|MALE|BIRTH|PLACE|SCHOOL|HIGH|BILINGUAL|COLLEGE|LYCEE|GOVERNMENT|CENTRE|SESSION|SUBJECT|SPECIALTY|EXAMINATION|RECEIPT|TIMETABLE|PAYMENT)\b",
                RegexOptions.IgnoreCase
            );
        }






        private static string NormalizeOcrText(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            var text = input.ToUpperInvariant();

            // ================================
            // 🔥 NORMALISATION DES VARIANTES DE "CIN"
            // ================================

            // C.I.N / C I N / C-1-N / C.1.N / C|I|N
            text = Regex.Replace(text, @"\bC[\.\s\-\|]*[I1L][\.\s\-\|]*N\b", "CIN");

            // CLN / CLLN / CIIN / CILN / C.ILN / C.LLN
            text = Regex.Replace(text, @"\bC[L|I|1]{1,2}N\b", "CIN");

            // CAN and Name / C A N and Name
            text = Regex.Replace(text, @"\bC\s*A\s*N\s+AND\s+NAME\b", "CIN AND NAME");

            // ================================
            // 🔧 NORMALISATION GÉNÉRALE
            // ================================

            text = text.Replace("|", " ");
            text = text.Replace(":", " : ");
            text = Regex.Replace(text, @"\s{2,}", " ");
            text = text.Replace("\r", " ").Replace("\n", " ");

            return text.Trim();
        }



    }
}
