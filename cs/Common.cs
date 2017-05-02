using System;
using System.Text.RegularExpressions;

namespace HistoriskAtlas5.Frontend
{
    public class Common
    {
        public static string RichToHtml(string rich) {
            rich = Regex.Replace(rich, @"\n", "<br/>", RegexOptions.IgnoreCase);
            rich = Regex.Replace(rich, @"'''(.*?)'''", "<i>$1</i>", RegexOptions.IgnoreCase);
            rich = Regex.Replace(rich, @"''(.*?)''", "<b>$1</b>", RegexOptions.IgnoreCase);
            rich = Regex.Replace(rich, @"\\[(https?:\\/\\/.*?) (.*?)\\]", "<a href='$1'>$2</a>", RegexOptions.IgnoreCase);
            rich = Regex.Replace(rich, @"  ", " &nbsp;", RegexOptions.IgnoreCase);
            return rich;
        }
    }
}