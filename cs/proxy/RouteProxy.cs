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
        private static string[] types = { "driving", "bike", "foot" };

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
                var type = Int32.Parse(context.Request.QueryString["type"]);
                //if (type == 1)
                //    json = wc.DownloadString("https://routes.ibikecph.dk/v5/fast/route/" + locString + "?overview=full");
                //else
                try { 
                    json = wc.DownloadString("http://router.project-osrm.org/route/v1/" + types[type] + "/" + locString + "?overview=full");
                }
                catch (Exception e)
                {
                    context.Response.Output.WriteLine("Error occured: " + e.Message);
                    return;
                }
            }
            OSRMRoute osrmRoute = JsonConvert.DeserializeObject<OSRMResult>(json).routes[0];
            HARoute haRoute = new HARoute() { distance = osrmRoute.distance, time = osrmRoute.duration, geometry = osrmRoute.geometry, fromCache = true };

            string output = JsonConvert.SerializeObject(haRoute);
            try
            {
                File.WriteAllText(filename, output);
            }
            catch { }

            haRoute.fromCache = true;
            output = JsonConvert.SerializeObject(haRoute);
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
        public Boolean fromCache;
    }

}