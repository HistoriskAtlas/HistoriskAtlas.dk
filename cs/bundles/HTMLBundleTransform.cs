using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Optimization;

namespace HistoriskAtlas5.Frontend
{
    public class HTMLBundleTransform : IBundleTransform
    {
        public void Process(BundleContext context, BundleResponse response)
        {
            var strBundleResponse = new StringBuilder();

            foreach (BundleFile file in response.Files)
            {
                string content = File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + file.VirtualFile.VirtualPath);

                //strBundleResponse.Append(content);
                //continue;

                // Replace line comments
                content = Regex.Replace(content, @"// (.*?)\r?\n", "", RegexOptions.Singleline);

                // Replace spaces between quotes
                content = Regex.Replace(content, @"\s+", " ");

                // Replace line breaks
                content = Regex.Replace(content, @"\s*\n\s*", "\n");

                // Replace spaces between brackets
                content = Regex.Replace(content, @"\s*\>\s*\<\s*", "><");

                // Replace comments
                content = Regex.Replace(content, @"<!--(?!\[)(.*?)-->", "");

                // single-line doctype must be preserved 
                var firstEndBracketPosition = content.IndexOf(">", StringComparison.Ordinal);
                if (firstEndBracketPosition >= 0)
                {
                    content = content.Remove(firstEndBracketPosition, 1);
                    content = content.Insert(firstEndBracketPosition, ">");
                }

                strBundleResponse.Append(content.Trim());
            }

            response.Files = new BundleFile[] { };
            response.Content = strBundleResponse.ToString();
            response.ContentType = "text/html";
        }
    }
}