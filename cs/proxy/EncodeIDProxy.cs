//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.IO;
//using System.Net;
//using System.Text;
//using System.Web;
//using System.Web.Routing;

//namespace HistoriskAtlas5.Frontend
//{
//    public class EncodeIDProxy : IRouteHandler
//    {
//        public IHttpHandler GetHttpHandler(RequestContext context)
//        {
//            return new EncodeIDProxyHandler();
//        }
//    }
//    public class EncodeIDProxyHandler : IHttpHandler
//    {
//        public void ProcessRequest(HttpContext context)
//        {
//            context.Response.ContentType = "application/json; charset=UTF-8";
//            int id = Int32.Parse(context.Request.QueryString["id"]);

//            int shiftetID = (int)Math.Pow(id + 56, 2) * 80183242 - 21398769;
//            string encodedID = HttpUtility.UrlEncode(Convert.ToBase64String(BitConverter.GetBytes(shiftetID)));
//            Random r = new Random(shiftetID);
//            encodedID =  (char)r.Next(65, 66) + encodedID;

//            string output = JsonConvert.SerializeObject(new EncodedID() { id = encodedID });
//            context.Response.Output.WriteLine(output);
//        }

//        public bool IsReusable { get { return false; } }

//    }

//    public class EncodedID
//    {
//        public string id;
//    }

//}