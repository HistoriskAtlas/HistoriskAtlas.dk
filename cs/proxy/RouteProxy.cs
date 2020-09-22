using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Globalization;
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
            
        private static string[] types = { "car", "bicycle", "pedestrian" }; //HERE maps routing. "Bike should be avail. early Juli 2020: https://stackoverflow.com/questions/62518002/routing-v7-v8-bicycle-and-durations
                              
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=UTF-8";

            var bodyStream = new StreamReader(context.Request.InputStream);
            bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
            var bodyText = bodyStream.ReadToEnd();

            var locs = JsonConvert.DeserializeObject<List<ClientCall>>(bodyText);
            var result = new List<HARoute>();

            foreach (var loc in locs) {

                //string filename = ConfigurationManager.AppSettings["SharedPath"] + @"\routes\" + context.Request.QueryString + ".json";
                string routeLocs = $"transportMode={types[loc.type]}&origin={loc.loc1[1].ToString(CultureInfo.InvariantCulture)},{loc.loc1[0].ToString(CultureInfo.InvariantCulture)}&destination={loc.loc2[1].ToString(CultureInfo.InvariantCulture)},{loc.loc2[0].ToString(CultureInfo.InvariantCulture)}";
                string filename = ConfigurationManager.AppSettings["SharedPath"] + @"\routes\" + routeLocs + ".json";

                if (File.Exists(filename)) {
                    //context.Response.Output.WriteLine(File.ReadAllText(filename));
                    using (var fileStream = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        using (StreamReader sr = new StreamReader(fileStream))
                        {
                            var haRouteFromFile = JsonConvert.DeserializeObject<HARoute>(sr.ReadToEnd());
                            result.Add(haRouteFromFile);
                        }
                    }
                    continue;
                }

                string json;
                using (WebClient wc = new WebClient())
                {
                    wc.Encoding = Encoding.UTF8;
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

                    //var loc = context.Request.QueryString.GetValues("loc");
                    //string locString = string.Join(";", context.Request.QueryString.GetValues("loc"));
                    //var type = Int32.Parse(context.Request.QueryString["type"]);
                    //if (type == 1)
                    //    json = wc.DownloadString("https://routes.ibikecph.dk/v5/fast/route/" + locString + "?overview=full");
                    //else
                    try {
                        //json = wc.DownloadString("http://router.project-osrm.org/route/v1/" + types[type] + "/" + locString + "?overview=full");
                        //json = wc.DownloadString("https://router.hereapi.com/v8/routes?transportMode=" + types[type] + "&origin=" + loc[0] + "&destination=" + loc[1] + "&return=polyline,summary&apikey=N_r0VTxJt_6gNBd_I4xi7GkZqp1TfkSZUSENri_NWgM");
                        json = wc.DownloadString($"https://router.hereapi.com/v8/routes?{routeLocs}&return=polyline,summary&apikey=N_r0VTxJt_6gNBd_I4xi7GkZqp1TfkSZUSENri_NWgM");
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

                //var output = JsonConvert.SerializeObject(haRoute);
                //context.Response.Output.WriteLine(output);
                result.Add(haRoute);

                haRoute.fromCache = true;
                var output = JsonConvert.SerializeObject(haRoute);
                try
                {
                    File.WriteAllText(filename, output);
                }
                catch { }
            }

            context.Response.Output.WriteLine(JsonConvert.SerializeObject(result));
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

    public class ClientCall
    {
        public List<double> loc1;
        public List<double> loc2;
        public int type;
    }

}