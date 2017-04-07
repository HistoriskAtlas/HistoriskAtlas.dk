using System;
using System.IO;
using System.Web;
using System.Web.Routing;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;

namespace HistoriskAtlas5.Frontend
{
    public class GeoPDFProxy : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new GeoPDFProxyHandler(context.RouteData);
        }
    }
    public class GeoPDFProxyHandler : PDFProxyHandler
    {
        public static string schema = "{geo:[id,title,intro,lat,lng,{contents:[{texts:[headline,text1]}]},{geo_images:[{image:[id,text]}]}]}";

        public GeoPDFProxyHandler(RouteData routeData) : base(routeData)
        {
        }

        public override void ProcessRequest(HttpContext context)
        {
            this.context = context;
            HAGeos geos = (new Service<HAGeos>()).Get("geo.json?v=1&count=1&schema=" + schema+ "&online=true&geoid=" + routeData.Values["geoid"] );
            if (geos.data.Length == 0)
                return;
            HAGeo geo = geos.data[0];

            StartRequest();

            writeParagraph(geo.title, 20, 1, 20);
            writeGeoWithoutTitle(geo);

            EndRequest();
        }
    }
}