using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Routing;

namespace HistoriskAtlas5.Frontend
{
    public class RouteProxy : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new RouteProxyHandler();
        }
    }
    public class RouteProxyHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=UTF-8";
            string filename = ConfigurationManager.AppSettings["SharedPath"] + @"\routes\" + context.Request.QueryString + ".json";

            if (File.Exists(filename)) {
                context.Response.Output.WriteLine(File.ReadAllText(filename));
                return;
            }
            
            string json;
            using (WebClient wc = new WebClient())
            {
                wc.Encoding = Encoding.UTF8;
                string locString = string.Join(";", context.Request.QueryString.GetValues("loc"));
                json = wc.DownloadString("http://router.project-osrm.org/route/v1/driving/" + locString + "?overview=full");
            }
            OSRMRoute osrmRoute = JsonConvert.DeserializeObject<OSRMResult>(json).routes[0];
            HARoute haRoute = new HARoute() { distance = osrmRoute.distance, time = osrmRoute.duration, geometry = osrmRoute.geometry };

            string output = JsonConvert.SerializeObject(haRoute);
            File.WriteAllText(filename, output);

            context.Response.Output.WriteLine(output);
        }

        public bool IsReusable { get { return false; } }

    }

    public class OSRMResult
    {
        public OSRMRoute[] routes;
    }
    public class OSRMRoute
    {
        public float distance;
        public float duration;
        public string geometry;
    }
    public class HARoute
    {
        public float distance;
        public float time;
        public string geometry;
    }

}