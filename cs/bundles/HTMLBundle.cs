using System.Web.Optimization;

namespace HistoriskAtlas5.Frontend
{    public class HTMLBundle : Bundle
    {
        public HTMLBundle(string virtualPath) : base(virtualPath, new[] { new HTMLBundleTransform() })
        {
        }
    }
}