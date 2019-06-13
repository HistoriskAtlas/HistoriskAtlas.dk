using Newtonsoft.Json;
using System;
using System.Net;
using System.Text;
using System.Web;
using System.Collections.Generic;

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
        public bool ugc;
        public decimal lat;
        public decimal lng;
        public HAUser user;
        public HAContent[] contents;
        public HAGeoImage[] geo_images;
        public HATagGeo[] tag_geos;

        [JsonIgnore]
        public string urlPath
        {
            get
            {
                return title.Replace(' ', '_').Replace(':', '_').Replace('/', '_') + "_(" + id + ")";
            }
        }

        [JsonIgnore]
        public string absUrlPath
        {
            get
            {
                return HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + "/" + this.urlPath;
            }
        }

        [JsonIgnore]
        public string absUrlPathImage
        {
            get
            {
                if (geo_images is null)
                    return "";
                if (geo_images.Length == 0)
                    return "";

                return "https://secureapi.historiskatlas.dk/api/hadb5.image/" + geo_images[0].image.id + "?action=scale&size={640:10000}&scalemode=inner";
            }
        }

        [JsonIgnore]
        public List<HATag> tags
        {
            get
            {
                var result = new List<HATag>();
                foreach (HATagGeo tag_geo in tag_geos)
                    result.Add(tag_geo.tag);

                return result;                    
            }
        }
    }

    public class HACollections
    {
        public static string schema = "{collection:[collectionid,title,ugc,cyclic,distance,type,userid,{collection_geos:[id,geoid,ordering,showonmap,calcroute,contentid,longitude,latitude]}]}";
        public HACollection[] data;
    }
    public class HAUser
    {
        public string firstname;
        public string lastname;
        public string about;

        [JsonIgnore]
        public string fullnameAndAbout
        {
            get {
                return firstname + " " + lastname + (about == null ? "" : ", " + about);
            }
        }

    }
    public class HACollection
    {
        public int collectionid;
        public string title;
        public bool ugc;
        public bool cyclic;
        public int distance;
        public int type;
        public int userid;
        public HACollectionGeo[] collection_geos;

        [JsonIgnore]
        public string urlPath
        {
            get
            {
                return title.Replace(' ', '_').Replace(':', '_').Replace('/', '_') + "_(r" + collectionid + ")";
            }
        }
    }
    public class HACollectionGeo
    {
        public int id;
        public int? geoid;
        public int ordering;
        public bool showonmap;
        public bool calcroute;
        public int? contentid;
        public decimal? longitude;
        public decimal? latitude;
    }
    //var collectionGeosAPISchema = "{collection_geos:[id,geoid,ordering,showonmap,calcroute,contentid,longitude,latitude]}'";
    //string schema = "{collection:[collectionid,title,ugc,cyclic,distance,type,userid," + collectionGeosAPISchema + "]}";

    public class HAContent
    {
        public int contenttypeid;
        public int ordering;
        public HAText[] texts;
        public HATagContent[] tag_contents;

        [JsonIgnore]
        public List<HATag> tags
        {
            get
            {
                var result = new List<HATag>();
                foreach (HATagContent tag_content in tag_contents)
                    result.Add(tag_content.tag);

                return result;
            }
        }

        [JsonIgnore]
        public List<int> tagIDs
        {
            get
            {
                var result = new List<int>();
                foreach (HATagContent tag_content in tag_contents)
                    result.Add(tag_content.tag.id);

                return result;
            }
        }
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
    public class HATagGeo
    {
        public HATag tag;
    }
    public class HATagContent
    {
        public HATag tag;
    }
    public class HATagImage
    {
        public HATag tag;
    }
    public class HAImage
    {
        public int id;
        public string text;
        public int? year;
        public string photographer;
        public string licensee;
        public HATagImage[] tag_images;

        [JsonIgnore]
        public List<HATag> tags
        {
            get
            {
                var result = new List<HATag>();
                if (tag_images == null)
                    return result;

                foreach (HATagImage tag_image in tag_images)
                    result.Add(tag_image.tag);

                return result;
            }
        }
    }


    public class HATags
    {
        public HATag[] data;
    }
    public class HATag
    {
        public int id;
        public string plurName;
        public int category;

        [JsonIgnore]
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