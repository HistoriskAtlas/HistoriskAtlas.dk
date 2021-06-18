using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

namespace HistoriskAtlas5.Frontend
{
    public partial class Default : Page
    {
        public bool dev, beta, crawler, fullapp, embed;
        public HAGeo passedGeo;
        public HACollection passedCollection;
        public HATag passedTag;
        public HATheme passedTheme;
        public Dictionary<string, string> stateObject;

        protected void Page_Load(object sender, EventArgs e)
        {
            //HttpContext.Current.Response.PushPromise("js/ol/ol-custom.js");
            //HttpContext.Current.Response.AppendHeader("link", "</bower_components/polymer/polymer.html>; rel=preload; as=document");
            HttpContext.Current.Response.AppendHeader("link", "</js/ol/ol-custom.js>; rel=preload; as=script, </bower_components/webcomponentsjs/webcomponents-lite.min.js>; rel=preload; as=script");
            

            string deep = GetDeep();
            var keylessParameters = GetKeylessParameters();

            dev = (Request.QueryString["dev"] != null ? (Request.QueryString["dev"] != "false") : !Request.Url.Host.Contains("historiskatlas.dk"));
            //dev = false; //TODO.......................................... TEMP!

            beta = Request.Url.Host.StartsWith("beta");
            //crawler = Regex.IsMatch(Request.UserAgent, @"bot|crawler|facebook", RegexOptions.IgnoreCase);
            crawler = true;
            embed = keylessParameters.Contains("embed");

            stateObject = new Dictionary<string, string>();
            if (keylessParameters.Count > 0) {
                if (keylessParameters[0].Contains("!")) {
                    foreach (var param in keylessParameters[0].Split(new char[] { ' ' })) {
                        var kvp = param.Split(new char[] { '!' });
                        stateObject.Add(kvp[0], kvp[1]);
                    }
                }
            }

            passedGeo = GetGeo(deep);
            fullapp = Request.Cookies["fullapp"] != null ? Request.Cookies["fullapp"].Value != "false" : passedGeo == null;

            if (passedGeo != null && !fullapp)
                if ("/" + passedGeo.urlPath != Server.UrlDecode(HttpContext.Current.Request.Url.AbsolutePath)) //TODO: only if direct deep link is detected.
                    HttpContext.Current.Response.Redirect(passedGeo.absUrlPath + HttpContext.Current.Request.Url.Query, true);

            passedCollection = GetCollection(deep);
            if (passedCollection == null)
                passedTag = GetTag(deep);
            passedTheme = GetTheme(deep);

            DataBind();
            //var test = 42;
        }

        private List<string> GetKeylessParameters()
        {
            var keyless = Request.QueryString.GetValues(null);
            return keyless == null ? new List<string>() : new List<string>(keyless);
        }

        private string GetDeep()
        {
            char[] split = { '/' };
            string[] a = Request.RawUrl.Split(split);
            //return (a.Length > 1 && a[a.Length - 1].ToLower() != "default.aspx") ? a[a.Length - 1] : "";

            if (a.Length > 2)
            {
                if (a[1].ToLower() == "css") //for missing theme css files
                {
                    HttpContext.Current.Response.StatusCode = (int)HttpStatusCode.NoContent;
                    return "";
                }
                HttpContext.Current.Response.RedirectPermanent(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + "/" + a[a.Length - 1], true);
            }

            return (a[1].ToLower() != "default.aspx") ? a[1] : "";
        }

        public new string Title {
            get
            {
                return (passedGeo == null ? (passedTag == null ? "" : htmlEncode(passedTag.plurName) + " | ") : htmlEncode(passedGeo.title) + " | ") + "Historisk Atlas";
            }
        }

        public string ImageURL
        {
            get
            {
                return passedGeo == null ? "/images/appicons/logo-1000x1000.png" : passedGeo.absUrlPathImage;
            }
        }

        private HAGeo GetGeo(string deep)
        {
            if (deep == "")
                return null;

            Match match = new Regex(@"_\(([0-9]+)\)($|\?)").Match(deep);
            if (!match.Success)
                return null;

            //int geoID = int.Parse(match.Groups[1].Value);

            //string schema = crawler ? "{geo:[id,title,intro,lat,lng,{contents:[{texts:[headline,text1]}]},{geo_images:[ordering,{image:[id,text]}]}]}" : "{geo:[id,title,intro,lat,lng,ugc]}";
            //HAGeos geos = (new Service<HAGeos>()).Get("geo.json?v=1&schema=" + schema + "&geoid=" + geoID + "&online=true", dev); //TODO: SLOW....... implement HAAPI instead..............................
            var geo = (new Service<HAGeo>()).GetHAAPI($"geo/{match.Groups[1].Value}", crawler ? "deeplinkcrawler" : "deeplink");

            //if (geos.data.Length == 0)
            //    return null;

            if (geo.geo_images != null)
                Array.Sort(geo.geo_images, (HAGeoImage a, HAGeoImage b) => a.ordering - b.ordering);

            //return geos.data[0];
            return geo;
        }

        private HACollection GetCollection(string deep)
        {
            if (deep == "")
                return null;

            Match match = new Regex(@"_\(r([0-9]+)\)($|\?)").Match(deep);
            if (!match.Success)
                return null;

            //int collectionID = int.Parse(match.Groups[1].Value);
            //HACollections collections = (new Service<HACollections>()).Get("collection.json?v=1&schema=" + HACollections.schema + "&collectionid=" + collectionID + "&online=true", dev);
            var collection = (new Service<HACollection>()).GetHAAPI($"collection/{match.Groups[1].Value}");

            //if (collections.data.Length == 0)
            //    return null;

            //return collections.data[0];
            return collection;
        }

        private HATag GetTag(string deep)
        {
            if (deep == "" || deep.StartsWith("?") || deep.StartsWith("@"))
                return null;

            if (this.passedGeo != null)
                return null;

            HATags tags = (new Service<HATags>()).Get("tag.json?v=1&schema={tag:[id,plurName]}&plurName=" + deep + "&category=9", dev); //only subject for now  //TODO: SLOW....... implement HAAPI instead.......

            if (tags.data.Length == 0)
                return null;

            return tags.data[0];
        }

        private HATheme GetTheme(string deep)
        {
            if (deep == "")
                return null;

            if (this.passedGeo != null)
                return null;
            
            //HAThemes themes = (new Service<HAThemes>()).Get("theme.json?v=1&schema={theme:[id,name,mapid,maplatitude,maplongitude,mapzoom,tagid,{content:[id,geoid,ordering,deleted,contenttypeid,{texts:[empty,id,created,{user:[firstname,lastname]},headline,text1,type]},{biblios:[empty,id,created,cql]},{externalcontent:[empty,id,created,externalsourceid,text,link]},{tag_contents:[{collapse:tagid}]}]}]}&id=[" + HttpUtility.UrlEncode(deep) + (stateObject.ContainsKey("th") ? "," + stateObject["th"] : "") + "]");
            var theme = (new Service<HATheme>()).GetHAAPI($"theme/{(stateObject.ContainsKey("th") ? stateObject["th"] : HttpUtility.UrlEncode(deep))}");

            //if (themesdata.Length == 0)
            //    return null;

            //return themes.data[0];
            return theme;
        }

        public string json(object obj) { return JsonConvert.SerializeObject(obj); }

        public HATags sitemapTags
        {
            get
            {
                return (passedGeo != null || !crawler) ? new HATags() { data = new HATag[0] } : (new Service<HATags>()).Get("tag.json?v=1&count=all&schema={tag:{fields:[plurname],filters:[" + (passedTag == null ? "{children:[exists]}" : "{parents:{id:" + passedTag.id + "}}") + "]}}" + (passedTag == null ? "&category=9" : "")); //only subject for now
            }
        }

        public HAGeos sitemapGeos
        {
            get
            {
                return (passedTag == null || !crawler) ? new HAGeos() { data = new HAGeo[0] } : (new Service<HAGeos>()).Get("geo.json?v=1&count=all&schema={geo:{fields:[id,title],filters:[{tag_geos:[{tagid:" + passedTag.id + "}]}]}}");
            }
        }

        public string htmlEncode(string text)
        {
            return HttpUtility.HtmlEncode(text);                
        }
    }
}