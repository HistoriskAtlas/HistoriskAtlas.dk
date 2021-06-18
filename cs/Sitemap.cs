using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Routing;
using System.Xml;

namespace HistoriskAtlas5.Frontend
{
    public class Sitemap : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new SitemapHandler();
        }
    }
    public class SitemapHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/xml; charset=UTF-8";

            string ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            XmlDocument doc = new XmlDocument();
            doc.AppendChild(doc.CreateXmlDeclaration("1.0", "UTF-8", null));
            XmlNode urlset = doc.CreateElement("urlset", ns);
            doc.AppendChild(urlset);

            //HAGeos geos = (new Service<HAGeos>()).Get("geo.json?v=1&count=*&schema={geo:[id,title]}&online=true"); //TODO: Exclude geos that is not published to ha.dk?
            List<HAGeo> geos = (new Service<List<HAGeo>>()).GetHAAPI("geos", "sitemap", "online=true");
            foreach (HAGeo geo in geos)
            {
                XmlNode url = doc.CreateElement("url", ns);
                urlset.AppendChild(url);

                XmlNode loc = doc.CreateElement("loc", ns);
                loc.InnerText = geo.absUrlPath;
                url.AppendChild(loc);
            }

            using (TextWriter sw = new StreamWriter(context.Response.OutputStream, Encoding.UTF8))
                doc.Save(sw);
        }

        public bool IsReusable { get { return false; } }
    }
}