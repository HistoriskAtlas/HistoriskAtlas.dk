using System;
using System.Web;
using System.Web.Routing;
using System.Collections.Generic;

namespace HistoriskAtlas5.Frontend
{
    public class Global : HttpApplication
    {
        public static Dictionary<int, Tuple<int, int>> languageMapping; //Tunø workaround
        public static Dictionary<int, Tuple<string, string>> redirectMapping; //På sporet af Maribo workaround

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
            RouteTable.Routes.Add(new Route("_({geoid})", null, new RouteValueDictionary { { "geoid", new GeoIDConstraintMaribo() } }, new RedirectRouteHandlerMaribo()));
            RouteTable.Routes.MapPageRoute("Default", "{*url}", "~/Default.aspx");

            //Tunø workaround
            languageMapping = new Dictionary<int, Tuple<int, int>>
            {
                { 10940, new Tuple<int, int>(10971, 10972) },
                { 10934, new Tuple<int, int>(10983, 10984) },
                { 10935, new Tuple<int, int>(10985, 10986) },
                { 10953, new Tuple<int, int>(10987, 10988) },
                { 10952, new Tuple<int, int>(10989, 10990) },
                { 10951, new Tuple<int, int>(10991, 10992) },
                { 10950, new Tuple<int, int>(10993, 10994) },
                { 10955, new Tuple<int, int>(10995, 10996) },
                { 10947, new Tuple<int, int>(11000, 11001) },
                { 10948, new Tuple<int, int>(10997, 11004) },
                { 10949, new Tuple<int, int>(11005, 11006) },
                { 10944, new Tuple<int, int>(11007, 11008) },
                { 10945, new Tuple<int, int>(11009, 11010) },
                { 10936, new Tuple<int, int>(10981, 10982) },
                { 10954, new Tuple<int, int>(11013, 11014) },
                { 10943, new Tuple<int, int>(11011, 11012) },
                { 10937, new Tuple<int, int>(10977, 10980) },
                { 10938, new Tuple<int, int>(10978, 10979) },
                { 10939, new Tuple<int, int>(10975, 10976) },
                { 10942, new Tuple<int, int>(11015, 11016) },
                { 10941, new Tuple<int, int>(11017, 11018) }
            };

            redirectMapping = new Dictionary<int, Tuple<string, string>>
            {
                { 10136, new Tuple<string, string>("https://youtu.be/cLZl4_leSHM", "https://youtu.be/lB8Bx0zmOxM") },
                {  7049, new Tuple<string, string>("https://youtu.be/Z8M0do8pOQ8", "https://youtu.be/3HibbuUEBPk") },
                { 17917, new Tuple<string, string>("https://youtu.be/5Nva3AQEXuU", "https://youtu.be/02csUuoTzZo") },
                { 10123, new Tuple<string, string>("https://youtu.be/7wFuetaimPQ", "https://youtu.be/K02PRNjN81g") },
                { 17799, new Tuple<string, string>("https://youtu.be/E8-zhFHVV10", "https://youtu.be/mEmZPomy6CQ") },
                { 10602, new Tuple<string, string>("https://youtu.be/e9jR18p4XK4", "https://youtu.be/MoUeCjgZ6vI") },
                { 17904, new Tuple<string, string>("https://youtu.be/gm4cPgc0jpc", "https://youtu.be/_QmmhKV3FkI") },
                { 17797, new Tuple<string, string>("https://youtu.be/5FhbePJP_yk", "https://youtu.be/nOom3XFAxkM") },
                { 17905, new Tuple<string, string>("https://youtu.be/j7pGLamr66w", "https://youtu.be/x2quN0NGySY") },
                { 17915, new Tuple<string, string>("https://youtu.be/VOqvDrV3Apw", "https://youtu.be/K3oQOdi30_c") },
                {  8421, new Tuple<string, string>("https://youtu.be/dMESuaJqKjc", "https://youtu.be/fjfVuci1pvg") },
                { 10122, new Tuple<string, string>("https://youtu.be/479XeUCXY7U", "https://youtu.be/Lu0yvuhk3W4") },
                { 17796, new Tuple<string, string>("https://youtu.be/kpwWa3f3mmE", "https://youtu.be/ajm3GugHgXA") },
                { 17916, new Tuple<string, string>("https://youtu.be/X2QEQksU6iE", "https://youtu.be/C5G6o-_CUM4") },
                { 17907, new Tuple<string, string>("https://youtu.be/Q4usybYNZnk", "https://youtu.be/3dts3C718P8") },
                { 17798, new Tuple<string, string>("https://youtu.be/uWcCgerbRqs", "https://youtu.be/nxksPOyWidU") }
            };
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

        public class RedirectRouteHandlerMaribo : IRouteHandler
        {
            public IHttpHandler GetHttpHandler(RequestContext context)
            {
                return new RedirectHttpHandlerMaribo(Int32.Parse((string)context.RouteData.Values["geoid"]));
            }
        }
        public class RedirectHttpHandlerMaribo : IHttpHandler
        {
            private int geoID;
            public RedirectHttpHandlerMaribo(int geoID)
            {
                this.geoID = geoID;
            }

            public void ProcessRequest(HttpContext context)
            {
                context.Response.Redirect($"https://historiskatlas.dk/langselect.aspx?daGeoID={geoID}&daUrl=_({geoID})%3Fredirected=true&enUrl={Global.redirectMapping[geoID].Item1}&deUrl={Global.redirectMapping[geoID].Item2}", true);
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

    public class GeoIDConstraintMaribo : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, String parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {
            int geoid;
            if (!Int32.TryParse(values[parameterName].ToString(), out geoid))
                return false;
            return Global.redirectMapping.ContainsKey(geoid) && httpContext.Request.QueryString["redirected"] == null;
        }
    }
}