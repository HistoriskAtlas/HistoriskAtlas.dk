using System;
using System.Web;
using System.Web.Routing;

namespace HistoriskAtlas5.Frontend
{
    public class Global : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            Bundles.Create();
            Markers.Create();

            RouteTable.Routes.Add(new Route("sitemap.xml", new Sitemap()));
            RouteTable.Routes.Add(new Route("robots.txt", new RobotsTxt()));
            RouteTable.Routes.Add(new Route("proxy/route.json", new RouteProxy()));
            RouteTable.Routes.Add(new Route("proxy/biblio.json", new BiblioProxy()));
            RouteTable.Routes.Add(new Route("{title}_({geoid}).pdf", new GeoPDFProxy()));
            RouteTable.Routes.MapPageRoute("Default", "{*url}", "~/Default.aspx");
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
    }
}