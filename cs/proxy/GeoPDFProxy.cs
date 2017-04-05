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
    public class GeoPDFProxyHandler : IHttpHandler
    {
        private RouteData routeData;
        private Document doc;
        private PdfWriter writer;

        public GeoPDFProxyHandler(RouteData routeData) {
            this.routeData = routeData;
        }

        public void ProcessRequest(HttpContext context)
        {
            HAGeos geos = (new Service<HAGeos>()).Get("geo.json?v=1&count=1&schema={geo:[id,title,intro,lat,lng,{contents:[{texts:[headline,text1]}]},{geo_images:[{image:[id,text]}]}]}&online=true&geoid=" + routeData.Values["geoid"] );
            if (geos.data.Length == 0)
                return;

            HAGeo geo = geos.data[0];

            //geo.title


            context.Response.ContentType = "application/PDF";
            //context.Response.AddHeader("Access-Control-Allow-Origin", "*");

            doc = new Document();
            MemoryStream ms = new MemoryStream();
            writer = PdfWriter.GetInstance(doc, ms);

            doc.Open();

            doc.Add(new Paragraph(geo.title, new Font(Font.FontFamily.HELVETICA, 20, 1)));
            //doc.Add(new Paragraph(geo.intro, new Font(Font.FontFamily.HELVETICA, 12, 0)));
            writeHtml(geo.intro);

            foreach (HAContent content in geo.contents)
                if (content.texts.Length > 0) { 
                    doc.Add(new Paragraph(content.texts[0].headline, new Font(Font.FontFamily.HELVETICA, 15, 1)) { SpacingBefore = 20 });
                    writeHtml(content.texts[0].text1);
                }

            foreach (HAGeoImage geoimage in geo.geo_images)
            {
                Image image = Image.GetInstance(new Uri("https://secureapi.historiskatlas.dk/api/hadb5.image/" + geoimage.image.id + "?action=scale&amp;size={640:10000}&amp;scalemode=inner"));
                var width = (doc.PageSize.Width - doc.LeftMargin - doc.RightMargin);
                var height = width * (image.Height / image.Width);
                image.ScaleAbsolute(width, height);
                doc.Add(image);
                writeHtml(geoimage.image.text);
            }

            writer.CloseStream = false;
            doc.Close();
            ms.Position = 0;

            //context.Response.AppendHeader("Content-Disposition", "attachment;filename=abc.pdf");
            context.Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);
            context.Response.OutputStream.Flush();
            context.Response.OutputStream.Close();
            context.Response.End();
            ms.Close();
        }

        private void writeHtml(string html) {
            using (var sr = new StringReader("<div>" + html + "</div>"))
                XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, sr);
        }

        public bool IsReusable { get { return false; } }
    }
}