using System;
using System.IO;
using System.Web;
using System.Web.Routing;
using System.Collections.Generic;

namespace HistoriskAtlas5.Frontend
{
    public class CollectionPDFProxy : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new CollectionPDFProxyHandler(context.RouteData);
        }
    }
    public class CollectionPDFProxyHandler : PDFProxyHandler
    {
        public CollectionPDFProxyHandler(RouteData routeData) : base(routeData)
        {
        }

        public override void ProcessRequest(HttpContext context)
        {
            this.context = context;
            HACollectionsPDF collections = (new Service<HACollectionsPDF>()).Get("collection.json?v=1&count=1&schema=" + HACollectionsPDF.schema  + "&online=true&collectionid=" + routeData.Values["collectionid"] );
            if (collections.data.Length == 0)
                return;
            HACollectionPDF collection = collections.data[0];

            StartRequest();

            writeParagraph(collection.title, 20, 1, 20, 10);
            if (collection.content != null)
                if (collection.content.texts.Length > 0)
                    writeHtml(collection.content.texts[0].text1);

            Array.Sort<HACollectionGeoPDF>(collection.collection_geos, (cg1, cg2) => cg1.ordering - cg2.ordering);
            writeParagraph("Punkter på ruten", 12, 1, 20);
            var i = 0;
            int j = 0;
            foreach (HACollectionGeoPDF cg in collection.collection_geos) {
                if (!cg.showonmap)
                    continue;
                cg.headline = cg.geo == null ? (Char.ConvertFromUtf32(++j + 64) + ". " + (cg.content == null ? "" : cg.content.texts[0].text1)) : ((++i).ToString() + ". " + cg.geo.title);
                writeTOCentry(cg.headline);                
            }


            foreach (HACollectionGeoPDF cg in collection.collection_geos)
            {
                newPage();

                writeHeadline(cg.headline);
                if (cg.geo != null)
                    writeGeoWithoutTitle(cg.geo);
            }


            //newPage();
            //writeParagraph("TOC");
            //Chunk dottedLine = new Chunk(new DottedLineSeparator());
            
            //Paragraph p;
            //foreach (KeyValuePair<string, int> kvp in pageEventHandler.toc) {
            //    p = new Paragraph(kvp.Key);
            //    p.Add(dottedLine);
            //    p.Add(" " + kvp.Value.ToString());
            //    add(p);
            //}

            EndRequest();
        }

    }

    public class HACollectionsPDF
    {
        public static string schema = "{collection:[collectionid,title,ugc,cyclic,distance,type,userid,{content:[{texts:[headline,text1]}]},{collection_geos:[id," + GeoPDFProxyHandler.schema + ",ordering,showonmap,calcroute,{content:[{texts:[headline,text1]}]},longitude,latitude]}]}";
        public HACollectionPDF[] data;
    }
    public class HACollectionPDF
    {
        public int collectionid;
        public string title;
        public bool ugc;
        public bool cyclic;
        public int distance;
        public int type;
        public int userid;
        public HAContent content;
        public HACollectionGeoPDF[] collection_geos;
    }
    public class HACollectionGeoPDF
    {
        public int id;
        public HAGeo geo;
        public int ordering;
        public bool showonmap;
        public bool calcroute;
        public decimal? longitude;
        public decimal? latitude;
        public HAContent content;

        public string headline;
    }


}