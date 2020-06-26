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
        //private static string[] types = { "driving", "bike", "foot" };





            //TODO: Remember to clear the route cache on the server, if this is puplished.................................................................


        private static string[] types = { "car", "pedestrian", "pedestrian" }; //HERE maps routing. No "Bike" available............... should be avail. early Juli 2020: https://stackoverflow.com/questions/62518002/routing-v7-v8-bicycle-and-durations






        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=UTF-8";
            string filename = ConfigurationManager.AppSettings["SharedPath"] + @"\routes\" + context.Request.QueryString + ".json";

            //if (File.Exists(filename)) {
            //    context.Response.Output.WriteLine(File.ReadAllText(filename));
            //    return;
            //}
            
            string json;
            using (WebClient wc = new WebClient())
            {
                wc.Encoding = Encoding.UTF8;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

                var loc = context.Request.QueryString.GetValues("loc");
                //string locString = string.Join(";", context.Request.QueryString.GetValues("loc"));
                var type = Int32.Parse(context.Request.QueryString["type"]);
                //if (type == 1)
                //    json = wc.DownloadString("https://routes.ibikecph.dk/v5/fast/route/" + locString + "?overview=full");
                //else
                try {
                    //json = wc.DownloadString("http://router.project-osrm.org/route/v1/" + types[type] + "/" + locString + "?overview=full");
                    json = wc.DownloadString("https://router.hereapi.com/v8/routes?transportMode=" + types[type] + "&origin=" + loc[0] + "&destination=" + loc[1] + "&return=polyline,summary&apikey=N_r0VTxJt_6gNBd_I4xi7GkZqp1TfkSZUSENri_NWgM");
                }
                catch (Exception e)
                {
                    context.Response.Output.WriteLine("Error occured: " + e.Message);
                    return;
                }
            }
            //OSRMRoute osrmRoute = JsonConvert.DeserializeObject<OSRMResult>(json).routes[0];
            //HARoute haRoute = new HARoute() { distance = osrmRoute.distance, time = osrmRoute.duration, geometry = osrmRoute.geometry, fromCache = false };

            var hereSection = JsonConvert.DeserializeObject<HERERouteResult>(json).routes[0].sections[0];
            var haRoute = new HARoute() { distance = hereSection.summary.length, time = hereSection.summary.duration, geometry = hereSection.polyline, fromCache = false };

            var output = JsonConvert.SerializeObject(haRoute);
            context.Response.Output.WriteLine(output);

            //haRoute.fromCache = true;
            //output = JsonConvert.SerializeObject(haRoute);
            //try
            //{
            //    File.WriteAllText(filename, output);
            //}
            //catch { }
        }

        public bool IsReusable { get { return false; } }

    }

    public class HERERouteResult
    {
        public HERERoute[] routes;
    }
    public class HERERoute
    {
        public HERERouteSection[] sections;
    }
    public class HERERouteSection
    {
        public string polyline;
        public HERERouteSummary summary;
    }
    public class HERERouteSummary
    {
        public int duration;
        public int length;
    }


    //public class OSRMResult
    //{
    //    public OSRMRoute[] routes;
    //}
    //public class OSRMRoute
    //{
    //    public float distance;
    //    public float duration;
    //    public string geometry;
    //}
    public class HARoute
    {
        public float distance;
        public float time;
        public string geometry;
        public Boolean fromCache;
    }

}