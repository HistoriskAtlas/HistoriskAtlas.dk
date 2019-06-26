using System;
using System.Web;
using System.Web.Routing;
using System.Collections.Generic;

namespace HistoriskAtlas5.Frontend
{
    public class Global : HttpApplication
    {
        public static Dictionary<int, Tuple<int, int>> languageMapping; //Tunø workaround

        protected void Application_Start(object sender, EventArgs e)
        {
            Bundles.Create();
            Markers.Create();

            RouteTable.Routes.Add(new Route("sitemap.xml", new Sitemap()));
            RouteTable.Routes.Add(new Route("robots.txt", new RobotsTxt()));
            RouteTable.Routes.Add(new Route("proxy/route.json", new RouteProxy()));
            RouteTable.Routes.Add(new Route("proxy/biblio.json", new BiblioProxy()));
            //RouteTable.Routes.Add(new Route("proxy/image", new ImageProxy())); //used by NM image only location PoC
            RouteTable.Routes.Add(new Route("{title}_(r{collectionid}).pdf", new CollectionPDFProxy()));
            RouteTable.Routes.Add(new Route("{title}_({geoid}).pdf", new GeoPDFProxy()));
            RouteTable.Routes.Add(new Route("{title}_({geoid})", null, new RouteValueDictionary { { "geoid", new GeoIDConstraint() } }, new RedirectRouteHandler())); //Tunø workaround
            RouteTable.Routes.MapPageRoute("Default", "{*url}", "~/Default.aspx");

            //Tunø workaround
            languageMapping = new Dictionary<int, Tuple<int, int>>();
            languageMapping.Add(10940, new Tuple<int, int>(10971, 10972));
            languageMapping.Add(10934, new Tuple<int, int>(10983, 10984));
            languageMapping.Add(10935, new Tuple<int, int>(10985, 10986));
            languageMapping.Add(10953, new Tuple<int, int>(10987, 10988));
            languageMapping.Add(10952, new Tuple<int, int>(10989, 10990));
            languageMapping.Add(10951, new Tuple<int, int>(10991, 10992));
            languageMapping.Add(10950, new Tuple<int, int>(10993, 10994));
            languageMapping.Add(10955, new Tuple<int, int>(10995, 10996));
            languageMapping.Add(10947, new Tuple<int, int>(11000, 11001));
            languageMapping.Add(10948, new Tuple<int, int>(10997, 11004));
            languageMapping.Add(10949, new Tuple<int, int>(11005, 11006));
            languageMapping.Add(10944, new Tuple<int, int>(11007, 11008));
            languageMapping.Add(10945, new Tuple<int, int>(11009, 11010));
            languageMapping.Add(10936, new Tuple<int, int>(10981, 10982));
            languageMapping.Add(10954, new Tuple<int, int>(11013, 11014));
            languageMapping.Add(10943, new Tuple<int, int>(11011, 11012));
            languageMapping.Add(10937, new Tuple<int, int>(10977, 10980));
            languageMapping.Add(10938, new Tuple<int, int>(10978, 10979));
            languageMapping.Add(10939, new Tuple<int, int>(10975, 10976));
            languageMapping.Add(10942, new Tuple<int, int>(11015, 11016));
            languageMapping.Add(10941, new Tuple<int, int>(11017, 11018));
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }

        public class RedirectRouteHandler : IRouteHandler
        {
            public IHttpHandler GetHttpHandler(RequestContext context)
            {
                return new RedirectHttpHandler(Int32.Parse((string)context.RouteData.Values["geoid"]));
            }
        }

        public class RedirectHttpHandler : IHttpHandler
        {
            private int geoID;
            public RedirectHttpHandler(int geoID)
            {
                this.geoID = geoID;
            }

            public void ProcessRequest(HttpContext context)
            {
                context.Response.Redirect("https://historiskatlas.dk/langselect.aspx?daGeoID=" + geoID + "&enGeoID=" + languageMapping[geoID].Item1 + "&deGeoID=" + languageMapping[geoID].Item2 + "&daUrl=_(" + geoID + ")%3Fredirected=true", true);
            }

            public bool IsReusable { get { return false; } }
        }
    }

    public class GeoIDConstraint : IRouteConstraint  {
        public bool Match(HttpContextBase httpContext, Route route, String parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {
            int geoid;
            if (!Int32.TryParse(values[parameterName].ToString(), out geoid))
                return false;
            return Global.languageMapping.ContainsKey(geoid) && httpContext.Request.QueryString["redirected"] == null;
        }
    }
}