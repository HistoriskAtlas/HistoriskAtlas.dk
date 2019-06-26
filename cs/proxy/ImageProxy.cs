//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Drawing;
//using System.Drawing.Imaging;
//using System.IO;
//using System.Net;
//using System.Text.RegularExpressions;
//using System.Web;
//using System.Web.Routing;
//using System.Xml;

//namespace HistoriskAtlas5.Frontend
//{
//    public class ImageProxy : IRouteHandler
//    {
//        public IHttpHandler GetHttpHandler(RequestContext context)
//        {
//            return new ImageProxyHandler(context.RouteData);
//        }
//    }
//    public class ImageProxyHandler : IHttpHandler
//    {
//        private RouteData routeData;

//        public ImageProxyHandler(RouteData routeData)
//        {
//            this.routeData = routeData;
//        }

//        public void ProcessRequest(HttpContext context)
//        {
//            context.Response.ContentType = "image/jpeg";
//            //context.Response.AddHeader("Access-Control-Allow-Origin", "*");

//            //string CQL = context.Request.QueryString["cql"];

//            WebClient wc = new WebClient();
//            var url = HttpUtility.UrlDecode(context.Request.QueryString["url"]);

//            Stream inStream;
//            try { 
//                inStream = wc.OpenRead(url);
//            }
//            catch
//            {
//                return;
//            }

//            //Image img = Image.FromStream(inStream);

//            ////Bitmap bitmap = new Bitmap(img, 36, 36);


//            var outStream = new System.IO.MemoryStream();
//            //img.Save(outStream, ImageFormat.Jpeg);
//            inStream.CopyTo(outStream);
//            outStream.Position = 0;


//            context.Response.BinaryWrite(outStream.ToArray());
//        }

//        public bool IsReusable { get { return false; } }

//    }
//}