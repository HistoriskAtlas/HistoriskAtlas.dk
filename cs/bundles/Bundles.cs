using System.Web.Optimization;

namespace HistoriskAtlas5.Frontend
{
    public class Bundles
    {
        //public static string htmlComponents;
        private static string[] GeoOnlyElements = new string[] { "windows/window-basic", "windows/window-geo", "windows/window-geo/window-geo-biblio", "lists/horizontal-tag-list", "by-line", "windows/window-image", "input/rich-text", "input/plain-text", "collections/base", "collections/ha-geo", "collections/ha-contents", "collections/ha-image", "collections/ha-licenses", "icons/licens-mark", "icons/cc-icons", "content-viewer" };

        public static void Create()
        {
            BundleTable.Bundles.UseCdn = true;

            foreach (string module in new string[] { "core", "admin", "editor", "writer" }) {
                HTMLBundle hb = new HTMLBundle("~/bundles/ha_" + module + "_html");
                hb.IncludeDirectory("~/elements/" + module, "*.html", true);
                BundleTable.Bundles.Add(hb);
            }

            HTMLBundle habGeo = new HTMLBundle("~/bundles/ha_core_geo_only_html");
            foreach (string element in GeoOnlyElements)
                habGeo.IncludeDirectory("~/elements/core/" + element, "*.html", false);
            BundleTable.Bundles.Add(habGeo);


            //TODO?
            //HTMLBundle bowerb = new HTMLBundle("~/bundles/bower.html");
            ////bowerb.Include("~/bower_components/iron-icons/iron-icons.html");
            //BundleTable.Bundles.Add(bowerb);

            foreach (string module in new string[] { "admin", "editor", "writer" })
            {
                ScriptBundle sb = new ScriptBundle("~/bundles/ha_" + module);
                sb.IncludeDirectory("~/elements/" + module, "*.js", true);
                BundleTable.Bundles.Add(sb);
            }

            foreach (string bundle in new string[] { "ha_core", "ha_core_geo_only" })
            { 
                ScriptBundle sb = new ScriptBundle("~/bundles/" + bundle); //Change to Script to disable minification.

                //sb.Include("~/classes/Logon/socialLoginSDK.js"); //TODO: This file should be moved somewhere else
                sb.Include("~/classes/common.js");
                sb.Include("~/classes/baseApp.js");
                sb.Include("~/classes/services.js");
                sb.Include("~/classes/localStorage.js");
                sb.Include("~/classes/urlState.js");
                sb.Include("~/classes/analytics.js");
                sb.Include("~/classes/Map/Icon.js");

                if (bundle != "ha_core_geo_only")
                {
                    sb.Include("~/classes/Map/IconLayerBase.js");
                    sb.Include("~/classes/Map/TileLayer.js");
                    sb.IncludeDirectory("~/classes/Map", "*.js", false);
                    sb.Include("~/classes/appmode.js");
                }

                //sb.Include("~/classes/HAClasses/Collections/base/tags.js"); //Because of class inheritance
                //sb.Include("~/classes/HAClasses/Collections/apptags.js"); //Because of class inheritance
                sb.IncludeDirectory("~/classes/HAClasses", "*.js", true);

                switch(bundle)
                { 
                    case "ha_core":
                        sb.IncludeDirectory("~/elements/core", "*.js", true); //Needs to be last because of HAClasses in constructors
                        break;
                    case "ha_core_geo_only":
                        foreach (string element in GeoOnlyElements)
                            sb.IncludeDirectory("~/elements/core/" + element, "*.js", false);
                        break;
                }

                BundleTable.Bundles.Add(sb);
            }

            ScriptBundle sbJQuery = new ScriptBundle("~/bundles/jquery"); //, "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js"
            sbJQuery.Include("~/js/jquery/jquery-2.2.0.min.js");
            //sbJQuery.CdnFallbackExpression = "window.jQuery";
            BundleTable.Bundles.Add(sbJQuery);

            ScriptBundle sbJQueryExtent = new ScriptBundle("~/bundles/jquery-extent");
            //sbJQueryExtent.Include("~/js/jquery/jquery.mobile.custom.js");
            sbJQueryExtent.Include("~/js/jquery/jquery-ui.1.11.4.custom.js"); //Effects Core ONLY... TOOD: use "min"?
            sbJQueryExtent.Include("~/js/jquery/jquery.mobile.1.4.5.custom.js"); //Swipe ONLY... TOOD: use "min"? and only serve on mobile devices?
            //sbJQueryExtent.Include("~/js/jquery/simplegallery.js");
            sbJQueryExtent.Include("~/js/jquery/Base64.js"); //needed?
            sbJQueryExtent.Include("~/js/jquery/jquery.md5.js");
            //sbJQueryExtent.Include("~/js/jquery/jquery.mCustomScrollbar.concat.min.js");
            //sbJQueryExtent.Include("~/js/jquery/js.cookie.2.1.0");
            BundleTable.Bundles.Add(sbJQueryExtent);

            StyleBundle sbCSS = new StyleBundle("~/bundles/ha_css");
            sbCSS.IncludeDirectory("~/css", "*.css", true);
            BundleTable.Bundles.Add(sbCSS);
        }
    }
}