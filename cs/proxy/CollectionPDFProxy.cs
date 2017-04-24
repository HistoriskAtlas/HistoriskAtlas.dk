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
            HACollectionsPDF collections = (new Service<HACollectionsPDF>()).Get("collection.json?v=1&count=1&schema=" + HACollectionsPDF.schema + "&online=true&collectionid=" + routeData.Values["collectionid"] );
            if (collections.data.Length == 0)
                return;
            HACollectionPDF collection = collections.data[0];

            StartRequest(collection.urlPath);

            writeParagraph(collection.title, 20, 1, 20, 10);


            writeByLine(collection.content == null ? new List<HATag>() : collection.content.tags, collection.user);

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

                if (cg.geo == null)
                {
                    cg.headline = (Char.ConvertFromUtf32(++j + 64) + ". " + (cg.content == null ? "" : cg.content.texts[0].text1));
                    var split = new List<string>(cg.headline.Split(new string[] { "\n" }, StringSplitOptions.None));
                    cg.headline = split[0];
                    split.RemoveAt(0);
                    cg.text = split.Count > 0 ? string.Join("\n", split.ToArray()) : "";
                }
                else
                    cg.headline = (++i).ToString() + ". " + cg.geo.title;

                writeTOCentry(cg.headline);
            }


            foreach (HACollectionGeoPDF cg in collection.collection_geos)
            {
                if (!cg.showonmap)
                    continue;

                newPage();

                writeHeadline(cg.headline);
                if (cg.geo != null)
                    writeGeoWithoutTitle(cg.geo);
                else {
                    writeHtml("<br/>");
                    writeHtml(cg.text);
                }

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
        //public static string schema = "{collection:[collectionid,title,ugc,cyclic,distance,type,{user:[firstname,lastname,about]},{content:[{texts:[headline,text1]}]},{collection_geos:[id," + GeoPDFProxyHandler.schema + ",ordering,showonmap,calcroute,{content:[{texts:[headline,text1]}]},longitude,latitude]}]}";
        public static string schema = "{collection:[collectionid,title,ugc,cyclic,distance,type,{user:[firstname,lastname,about]},{content:[{texts:[headline,text1]},{tag_contents:[{tag:[id,plurname,category]}]}]},{collection_geos:[id,{geo:[id,title,intro,lat,lng,{contents:[{texts:[headline,text1]}]},{geo_images:[{image:[id,text,year,photographer,licensee,{tag_images:[{tag:[id,plurname,category]}]}]}]},{tag_geos:[{tag:[id,plurname,category]}]},{user:[firstname,lastname,about]}]},ordering,showonmap,calcroute,{content:[{texts:[headline,text1]}]},longitude,latitude]}]}";
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
        public HAUser user;
        public HAContent content;
        public HACollectionGeoPDF[] collection_geos;

        public string urlPath
        {
            get
            {
                return title.Replace(' ', '_').Replace(':', '_').Replace('/', '_') + "_(r" + collectionid + ")";
            }
        }
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
        public string text;
    }


}