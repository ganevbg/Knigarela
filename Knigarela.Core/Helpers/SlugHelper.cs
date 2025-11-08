using System.Text;
using System.Text.RegularExpressions;

namespace Knigarela.Core.Helpers;

public static class SlugHelper
{
    private static readonly Dictionary<char, string> BulgarianMap = new()
    {
        ['а'] = "a",
        ['б'] = "b",
        ['в'] = "v",
        ['г'] = "g",
        ['д'] = "d",
        ['е'] = "e",
        ['ж'] = "zh",
        ['з'] = "z",
        ['и'] = "i",
        ['й'] = "y",
        ['к'] = "k",
        ['л'] = "l",
        ['м'] = "m",
        ['н'] = "n",
        ['о'] = "o",
        ['п'] = "p",
        ['р'] = "r",
        ['с'] = "s",
        ['т'] = "t",
        ['у'] = "u",
        ['ф'] = "f",
        ['х'] = "h",
        ['ц'] = "ts",
        ['ч'] = "ch",
        ['ш'] = "sh",
        ['щ'] = "sht",
        ['ъ'] = "a",
        ['ь'] = "y",
        ['ю'] = "yu",
        ['я'] = "ya"
    };

    public static string GenerateSlug(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Guid.NewGuid().ToString("N");

        title = title.ToLowerInvariant();

        // Транслитерация
        var sb = new StringBuilder();
        foreach (var ch in title)
        {
            if (BulgarianMap.TryGetValue(ch, out var latin))
                sb.Append(latin);
            else
                sb.Append(ch);
        }

        var transliterated = sb.ToString();

        // Премахваме всичко, което не е буква, цифра, интервал или тире
        transliterated = Regex.Replace(transliterated, @"[^a-z0-9\s-]", "");

        // Замяна на интервали с тирета
        transliterated = Regex.Replace(transliterated, @"\s+", "-");

        // Премахваме двойни тирета и водещи/крайни тирета
        transliterated = Regex.Replace(transliterated, "-{2,}", "-").Trim('-');

        return transliterated;
    }
}
