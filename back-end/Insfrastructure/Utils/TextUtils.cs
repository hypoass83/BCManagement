using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Utils
{
    public static class TextUtils
    {
        public static string RemoveAccents(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // 1. Normalize the string (FormD splits letters from accents)
            var normalized = input.Normalize(NormalizationForm.FormD);

            // 2. Build a new string without non-spacing marks
            var sb = new StringBuilder();

            foreach (var c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);

                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            // 3. Normalize back to FormC
            return sb.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
