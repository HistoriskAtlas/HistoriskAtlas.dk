using System;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Routing;
using System.Xml;

namespace HistoriskAtlas5.Frontend
{
    public class RobotsTxt : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new RobotsTxtHandler();
        }
    }
    public class RobotsTxtHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Sitemap: " + context.Request.Url.GetLeftPart(UriPartial.Authority) + "/sitemap.xml");

        }

        public bool IsReusable { get { return false; } }
    }
}