
using Newtonsoft.Json;
using System;
using System.Net;
using System.Text;
using System.Web;

namespace HistoriskAtlas5.Frontend
{
    public class Service<O>
    {
        static bool isDevOrBeta = HttpContext.Current.Request.IsLocal || HttpContext.Current.Request.Url.Host.StartsWith("beta");

        public O Get(string url)
        {
            var api = "http://" + (isDevOrBeta ? "beta." : "") + "api.historiskatlas.dk/hadb5" + (isDevOrBeta ? "beta" : "") + ".";

            using (WebClient wc = new WebClient())
            {
                wc.Encoding = Encoding.UTF8;
                string json = wc.DownloadString(api + url);
                O geosJsonObject = JsonConvert.DeserializeObject<O>(json);
                return geosJsonObject;
            }
        }
    }

    public class HAGeos
    {
        public HAGeo[] data;
    }
    public class HAGeo
    {
        public int id;
        public string title;
        public string intro;
        public decimal lat;
        public decimal lng;
        public HAContent[] contents;
        public HAGeoImage[] geo_images;

        public string urlPath
        {
            get
            {
                return title.Replace(' ', '_').Replace(':', '_').Replace('/', '_') + "_(" + id + ")";
            }
        }
        public string absUrlPath
        {
            get
            {
                return HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + "/" + this.urlPath;
            }
        }
    }
    public class HAContent
    {
        public int contenttypeid;
        public int ordering;
        public HAText[] texts;
    }
    public class HAText
    {
        public string headline;
        public string text1;
    }
    public class HAGeoImage
    {
        public int ordering;
        public HAImage image;
    }
    public class HAImage
    {
        public int id;
        public string text;
    }


    public class HATags
    {
        public HATag[] data;
    }
    public class HATag
    {
        public int id;
        public string plurName;

        public string urlPath
        {
            get
            {
                return plurName.Replace(' ', '_').Replace('/', '_');
            }
        }
    }

    public class HAThemes
    {
        public HATheme[] data;
    }
    public class HATheme
    {
        public string id;
        public string name;
        public int? mapid;
        public decimal? maplatitude;
        public decimal? maplongitude;
        public double? mapzoom;
        public int tagid;
        public HAContent content;
    }
}