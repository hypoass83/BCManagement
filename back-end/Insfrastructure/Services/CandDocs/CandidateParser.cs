using Domain.Entities.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.Models.CandDocs;
using Infrastructure.Utils;
using iText.IO.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;


namespace Insfrastructure.Services.CandDocs
{
    public class CandidateParser : ICandidateParser
    {
        // Clean OCR text (remove leading noise digits, normalize spaces, unify labels)
        private string CleanOcrText(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text ?? "";

            string cleaned = TextUtils.RemoveAccents(text);

            // Remove non-printable characters
            cleaned = Regex.Replace(cleaned, @"[^\x20-\x7E\r\n\tÀ-ÿ]", " ");

            // Remove common noise including pipes and strange symbols
            cleaned = cleaned.Replace("|", " ");   // << ADD THIS LINE
            cleaned = cleaned.Replace("¦", " ");   // extra variant sometimes seen
            cleaned = cleaned.Replace("—", " ");   // long dash noise
            cleaned = cleaned.Replace("~", " ");   // short dash noise
            cleaned = cleaned.Replace("=", " ");   // equal noise
            cleaned = cleaned.Replace(";", ":");

            // Remove leading noise digits on lines (e.g., "1 3 5 7 GENERAL..." -> "GENERAL")
            cleaned = Regex.Replace(cleaned, @"(?m)^\s*[\d\s\|\-]{1,}\s+(?=[A-Za-zÀ-ÿ])", "");

            // Normalize multiple spaces and tabs
            cleaned = Regex.Replace(cleaned, @"\t+", " ");
            cleaned = Regex.Replace(cleaned, @"[ ]{2,}", " ");

            // Normalize common OCR mistakes around "CIN" and colon
            cleaned = Regex.Replace(cleaned, @"C[\.\s]*I[\.\s]*N", "CIN", RegexOptions.IgnoreCase);
            cleaned = cleaned.Replace("C I N", "CIN");
            cleaned = cleaned.Replace("C.LLN", "CIN");
            cleaned = cleaned.Replace("C.LN", "CIN");
            cleaned = cleaned.Replace("C.1.N", "CIN");

            // unify "Examination Centre" variants
            cleaned = Regex.Replace(cleaned, @"Examination\s*Cent(er|re)\s*[:\-]?", "EXAMINATION_CENTRE:", RegexOptions.IgnoreCase);
            cleaned = cleaned.Replace("Bxamination Centre", "EXAMINATION_CENTRE");
            cleaned = cleaned.Replace("Exatnitiation Centre", "EXAMINATION_CENTRE");
            cleaned = cleaned.Replace("Examination Contre.", "EXAMINATION_CENTRE:");
            // unify "Session" or "June" patterns later
            return cleaned.Trim();
        }
        
        // Extract any 6-12 digit number (CIN)
        private string ExtractAnyCIN(string text)
        {
            var m = Regex.Match(text ?? "", @"\b\d{6,12}\b");
            return m.Success ? m.Value : "";
        }

        // Try find a line containing CIN and Name
        private (string cin, string name) ExtractCinAndNameFromLine(string line)
        {
            if (string.IsNullOrWhiteSpace(line)) return ("", "");

            // Search for number in line
            var numMatch = Regex.Match(line, @"\b\d{6,12}\b");
            if (!numMatch.Success)
                return ("", "");

            string cin = numMatch.Value;

            // name is the remaining text after number
            int idx = line.IndexOf(cin) + cin.Length;
            if (idx < line.Length)
            {
                var maybeName = line.Substring(idx).Trim();
                maybeName = Regex.Replace(maybeName, @"[^\p{L}\s\-']", ""); // keep letters, spaces, hyphen, apostrophe
                maybeName = Regex.Replace(maybeName, @"\s{2,}", " ").Trim();
                return (cin, ToTitleCaseUpper(maybeName));
            }

            return (cin, "");
        }
        // Helper to convert to upper-case with accents preserved
        private string ToTitleCaseUpper(string s)
        {
            if (string.IsNullOrWhiteSpace(s)) return "";
            s = s.ToUpperInvariant();
            s = Regex.Replace(s, @"\s{2,}", " ").Trim();
            return s;
        }
        // Extract Examination Centre number
        private string ExtractCentreNumber(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";

            // look for "EXAMINATION_CENTRE:" normalized label
            var m = Regex.Match(text, @"EXAMINATION_CENTRE[:\s]*([A-Za-z0-9\-]{3,})", RegexOptions.IgnoreCase);
            if (m.Success) return m.Groups[1].Value.Trim();

            // fallback: any 4-6 digit sequence near "Centre"
            m = Regex.Match(text, @"Centre[:\s]*([0-9]{3,6})", RegexOptions.IgnoreCase);
            if (m.Success) return m.Groups[1].Value.Trim();

            // fallback: first 3-6 digits in the document (could be exam center)
            m = Regex.Match(text, @"\b([0-9]{3,6})\b");
            return m.Success ? m.Groups[1].Value : "";
        }
        // Extract session year from strings like "June 2025" or "Session: June 2025"
        private int? ExtractSessionYear(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return null;
            // Find "June <year>" or "<month> <year>"
            var m = Regex.Match(text, @"\b(June|Juin|June,?)\s+(\d{4})\b", RegexOptions.IgnoreCase);
            if (m.Success && int.TryParse(m.Groups[2].Value, out var y)) return y;

            // fallback: any 4-digit year near "Session" or "Exam"
            m = Regex.Match(text, @"\b(?:Session|Exam|Examination).{0,30}(\d{4})\b", RegexOptions.IgnoreCase);
            if (m.Success && int.TryParse(m.Groups[1].Value, out y)) return y;

            // fallback: any year anywhere
            m = Regex.Match(text, @"\b(20\d{2})\b");
            if (m.Success && int.TryParse(m.Groups[1].Value, out y)) return y;

            return null;
        }
        public CandidateInfo Parse(string ocrText)
        {
            var info = new CandidateInfo();
            info.RawOcrText = ocrText ?? "";

            if (string.IsNullOrWhiteSpace(ocrText))
                return info;

            var cleaned = CleanOcrText(ocrText);

            // Try direct line match: "CIN ... name"
            var lines = cleaned.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                               .Select(l => l.Trim())
                               .Where(l => !string.IsNullOrWhiteSpace(l))
                               .ToArray();

            // Search lines that contain "CIN" (preferred)
            var cinLine = lines.FirstOrDefault(l => l.IndexOf("CIN", StringComparison.OrdinalIgnoreCase) >= 0);
            if (cinLine != null)
            {
                var (cin, name) = ExtractCinAndNameFromLine(cinLine);
                if (!string.IsNullOrEmpty(cin))
                {
                    info.CandidateNumber = cin;
                    info.CandidateName = name;
                }
            }

            // Fallback: find any line with a long uppercase sequence that looks like a name
            if (string.IsNullOrEmpty(info.CandidateName))
            {
                var nameLine = lines.FirstOrDefault(l => Regex.IsMatch(l, @"^[A-ZÀ-Ÿ\-' ]{6,}$"));
                if (!string.IsNullOrEmpty(nameLine))
                {
                    // if there's also a number in same line, parse
                    var (cin, name) = ExtractCinAndNameFromLine(nameLine);
                    if (!string.IsNullOrEmpty(cin))
                    {
                        info.CandidateNumber = info.CandidateNumber ?? cin;
                        info.CandidateName = info.CandidateName ?? name;
                    }
                    else
                    {
                        // treat entire line as name
                        info.CandidateName = ToTitleCaseUpper(nameLine);
                    }
                }
            }

            // If CIN is still empty, try any digit sequence
            if (string.IsNullOrEmpty(info.CandidateNumber))
            {
                var any = ExtractAnyCIN(cleaned);
                if (!string.IsNullOrEmpty(any))
                    info.CandidateNumber = any;
            }

            // Centre number extraction
            var centre = ExtractCentreNumber(cleaned);
            if (!string.IsNullOrEmpty(centre))
                info.CentreNumber = centre;

            // Session year extraction
            info.SessionYear = ExtractSessionYear(cleaned);

            // Final normalization of candidate name
            if (!string.IsNullOrWhiteSpace(info.CandidateName))
                info.CandidateName = Regex.Replace(info.CandidateName, @"\s{2,}", " ").Trim();

            return info;
        }
    }
}
