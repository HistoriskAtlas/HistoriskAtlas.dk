<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HistoriskAtlas5.Frontend.Default" %>

<!DOCTYPE html>

<html lang="da">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <% if (beta) { %><meta name="robots" content="noindex"><% } %>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="<%=(passedGeo == null ? "G&aring; p&aring; opdagelse i historiske kort og udforsk din lokale kulturarv." : htmlEncode(passedGeo.intro))%>" />
    <title><%=Title%></title>

<!--#region appicon -->
    <meta name="application-name" content="Historisk Atlas" />
    <meta property="og:title" content="<%# Title%>" />
    <meta property="og:image" content="<%# ImageURL%>" />
    <%--<link rel="icon" href="favicon.ico" />--%>
    <link rel="icon" type="image/png" href="/images/appicons/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-48x48.png" sizes="48x48" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-64x64.png" sizes="64x64" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-128x128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="/images/appicons/favicon-256x256.png" sizes="256x256" />
    <link rel="icon" type="image/png" href="/images/appicons/coast-228x228.png" sizes="228x228" />
    <!-- Add to homescreen for Chrome on Android -->
    <meta name="mobile-web-app-capable" content="yes" />
    <link rel="icon" type="image/png" href="/images/appicons/maskable-192x192.png" sizes="192x192" />
    <link rel="icon" type="image/png" href="/images/appicons/maskable-512x512.png" sizes="512x512" />
    <link rel="manifest" href="/manifest.json" />
    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Historisk Atlas" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="apple-touch-icon" sizes="57x57" href="/images/appicons/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="/images/appicons/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/images/appicons/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="/images/appicons/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/images/appicons/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/images/appicons/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/images/appicons/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/images/appicons/apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/appicons/apple-touch-icon-180x180.png" />
    <!-- Tile icon for Win10 + 8 -->
    <meta name="theme-color" content="#005b9c" />
    <meta name="msapplication-TileColor" content="#005b9c" />
    <meta name="msapplication-TileImage" content="/images/appicons/mstile-144x144.png" />
    <meta name="msapplication-config" content="/browserconfig.xml" />
<!--#endregion -->

    <script>

        !function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={ },a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e) { var t, n, a, i, r, o, s, c, u, p, l; g = !0, m.queue = [], f || (f = !0, t = h, s = function () { var e = {}, t = d.connectionString; if (t) for (var n = t.split(";"), a = 0; a < n.length; a++) { var i = n[a].split("="); 2 === i.length && (e[i[0][b]()] = i[1]) } if (!e[C]) { var r = e.endpointsuffix, o = r ? e.location : null; e[C] = "https://" + (o ? o + "." : "") + "dc." + (r || "services.visualstudio.com") } return e }(), c = s[D] || d[D] || "", u = s[C], p = u ? u + "/v2/track" : d.endpointUrl, (l = []).push((n = "SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)", a = t, i = p, (o = (r = v(c, "Exception")).data).baseType = "ExceptionData", o.baseData.exceptions = [{ typeName: "SDKLoadFailed", message: n.replace(/\./g, "-"), hasFullStack: !1, stack: n + "\nSnippet failed to load [" + a + "] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: " + (S && S.pathname || "_unknown_") + "\nEndpoint: " + i, parsedStack: [] }], r)), l.push(function (e, t, n, a) { var i = v(c, "Message"), r = i.data; r.baseType = "MessageData"; var o = r.baseData; return o.message = 'AI (Internal): 99 message:"' + ("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) (" + n + ")").replace(/\"/g, "") + '"', o.properties = { endpoint: a }, i }(0, 0, t, p)), function (e, t) { if (JSON) { var n = T.fetch; if (n && !y.useXhr) n(t, { method: N, body: JSON.stringify(e), mode: "cors" }); else if (XMLHttpRequest) { var a = new XMLHttpRequest; a.open(N, t), a.setRequestHeader("Content-type", "application/json"), a.send(JSON.stringify(e)) } } }(l, p)) }function i(e,t){f || setTimeout(function () { !t && m.core || a() }, 500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded" !== n.readyState && "complete" !== n.readyState || i(0, t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie = l.cookie}catch(p){ }function t(e){for(;e.length;)!function(t){m[t] = function () { var e = arguments; g || m.queue.push(function () { m[t].apply(m, e) }) }}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{ }).ApplicationInsightsAnalytics||{ };if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit && y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({ })):a()}(window,document,{
            src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", crossOrigin: "anonymous",
            cfg: { connectionString: "InstrumentationKey=b2a5f111-511f-4b09-846f-6ab590229d08;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/" }
        });

        //(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        //    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        //    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        //})(window,document,'script','https://www.google-analytics.com/analytics.js','analytics');

        //analytics('create', 'UA-1465579-9', {'name':'obm'}); //deprecated
        //analytics('create', 'UA-84971843-1', {'name':'ha'});
        //analytics('obm.send', 'pageview'); //deprecated
        //analytics('ha.send', 'pageview');

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./js/sw.js', { scope: '/' }).then(function (reg) {
                //console.log('Successfully registered service worker', reg);
            }).catch(function(err) {
                //console.warn('Error whilst registering service worker', err);
            });
        }

        window.Polymer = {
            lazyRegister: true,
            useNativeCSSProperties: true
        };
    </script>

    <%--Polymer links --%>
    <link rel="import" href="bower_components/polymer/polymer.html">
    <link rel="import" href="bower_components/polymer-ts/polymer-ts.html">
    
    <%--<link rel="import" href="bundles/bower.html">--%>
    <%--TODO: use this CDN instead? https://github.com/download/polymer-cdn--%>
    <link rel="import" href="bower_components/iron-ajax/iron-ajax.html">
    <link rel="import" href="bower_components/iron-icons/iron-icons.html">
    <link rel="import" href="bower_components/iron-icons/social-icons.html">
    <link rel="import" href="bower_components/iron-icons/editor-icons.html">
    <link rel="import" href="bower_components/iron-icons/maps-icons.html">
    <link rel="import" href="bower_components/iron-pages/iron-pages.html">
    <link rel="import" href="bower_components/iron-collapse/iron-collapse.html">
    <link rel="import" href="bower_components/iron-list/iron-list.html">
    <link rel="import" href="bower_components/paper-button/paper-button.html">
    <link rel="import" href="bower_components/paper-toolbar/paper-toolbar.html">
    <link rel="import" href="bower_components/paper-icon-button/paper-icon-button.html">
    <link rel="import" href="bower_components/paper-drawer-panel/paper-drawer-panel.html">
    <link rel="import" href="bower_components/paper-item/paper-item.html">
    <link rel="import" href="bower_components/paper-item/paper-icon-item.html">
    <link rel="import" href="bower_components/paper-item/paper-item-body.html">
    <link rel="import" href="bower_components/paper-checkbox/paper-checkbox.html">
    <link rel="import" href="bower_components/paper-material/paper-material.html">
    <link rel="import" href="bower_components/paper-menu/paper-submenu.html">
    <link rel="import" href="bower_components/paper-menu/paper-menu.html">
    <link rel="import" href="bower_components/paper-input/paper-input.html">
    <link rel="import" href="bower_components/paper-input/paper-textarea.html">
    <link rel="import" href="bower_components/paper-fab/paper-fab.html">
    <link rel="import" href="bower_components/paper-tooltip/paper-tooltip.html">
    <link rel="import" href="bower_components/paper-tabs/paper-tabs.html">
    <link rel="import" href="bower_components/paper-tabs/paper-tab.html">
    <link rel="import" href="bower_components/paper-menu-button/paper-menu-button.html">
    <link rel="import" href="bower_components/paper-toast/paper-toast.html">
    <link rel="import" href="bower_components/paper-slider/paper-slider.html">
    <link rel="import" href="bower_components/paper-header-panel/paper-header-panel.html">
    <link rel="import" href="bower_components/paper-radio-button/paper-radio-button.html">   
    <link rel="import" href="bower_components/paper-dialog/paper-dialog.html">   
    <link rel="import" href="bower_components/paper-dialog-scrollable/paper-dialog-scrollable.html">   
    <link rel="import" href="bower_components/paper-dropdown-menu/paper-dropdown-menu.html">   
    <link rel="import" href="bower_components/paper-listbox/paper-listbox.html">   
    <link rel="import" href="bower_components/paper-toggle-button/paper-toggle-button.html">   
    <link rel="import" href="bower_components/gold-email-input/gold-email-input.html">
    <link rel="import" href="bower_components/polymer-sortablejs/polymer-sortablejs.html">
    
    <%=string.Format("<link rel=\"import\" href=\"{0}\">", System.Web.Optimization.BundleTable.Bundles.ResolveBundleUrl("~/bundles/ha_core_" + (fullapp ? "" : "geo_only_")  + "html"))%>

    <%--<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold&lang=da" type="text/css" />--%> <%--,italic,thin,light,bolditalic,black,medium--%>
    <%--<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />--%>
    <%:System.Web.Optimization.Styles.Render("~/bundles/ha_css") %>
   
    <style is="custom-style"> /*TODO: ARE these needed? */
    :root {
        --default-primary-color: #005b9c;
        --text-primary-color: #FFFFFF;
        --accent-color: #fece00;
        --primary-text-color: #000000;
        --secondary-text-color: #000000;
    }
    </style>

    <script type="text/javascript">
        document.sid = '<%=(Request.Cookies["ASP.NET_SessionId"] != null ? Request.Cookies["ASP.NET_SessionId"].Value : "")%>';
    </script>
    <%--<script src="//connect.facebook.com/da_DK/sdk.js" type="text/javascript" id="facebook-jssdk"></script>--%>
    <%--<script src="https://apis.google.com/js/client:platform.js" type="text/javascript"></script>--%>
    <%:System.Web.Optimization.Scripts.Render("~/bundles/jquery") %>
    <%:System.Web.Optimization.Scripts.Render("~/bundles/jquery-extent") %>
    <script src="./js/ol/ol-custom.js" type="text/javascript"></script>
    
    <%--:System.Web.Optimization.Scripts.Render("~/bundles/ha_core") --%>
    <link rel="import" href="elements/ha_core<%=(fullapp ? "" : "_geo_only")%>.aspx"> <!-- Workaround for webcomponents polyfill browsers -->
    
    <% if (this.passedTheme != null) { %><%=string.Format("<link id=\"theme-{0}\" rel=\"stylesheet\" href=\"css/themes/theme-{0}.css\">", this.passedTheme.linkname )%><% } %>
</head>
<body<%=(crawler && passedGeo != null ? " style=\"overflow:auto\"" : "")%>>

    <% if (crawler && passedGeo != null) { %>
        <h1><%=passedGeo.title%></h1>
        <% if (passedGeo.geo_images != null) { %>
            <% foreach (HistoriskAtlas5.Frontend.HAGeoImage image in passedGeo.geo_images) { %>
                <img src="https://secureapi.historiskatlas.dk/api/hadb6.image/<%=image.image.imageid%>" style="width:50%"/><br>
                <i><%=image.image.text%></i><br><br>
            <% } %>
        <% } %>
        <h2>Intro</h2>
        <%=passedGeo.intro%><br><br>
        <% foreach (HistoriskAtlas5.Frontend.HAContent content in passedGeo.contents) { %>
            <% if (content.texts != null) { %>
                <% foreach (HistoriskAtlas5.Frontend.HAText text in content.texts) { %>
                    <h2><%=text.headline%></h2>
                    <%=text.text1%><br><br>
                <% } %>
            <% } %>
        <% } %>
    <% } %>
    <script>
        window.passed = { 
            geo: <%=(passedGeo == null ? "null" : json(passedGeo) )%>, 
            collection: <%=(passedCollection == null ? "null" : json(passedCollection) )%>,
            tag: <%=(passedTag == null ? "null" : json(passedTag) )%>,
            theme: <%=(passedTheme == null ? "null" : json(passedTheme) )%>,
            dev: <%=(dev ? "true": "false")%>,
            redribbon: <%=(Request.QueryString["redribbon"] != null ? (Request.QueryString["redribbon"] == "false" ? "false" : "true") : "false")%>,
            crawler: <%=(crawler ? "true" : "false")%>,
            embed: <%=(embed ? "true" : "false")%>
        };
    </script>
    <% if (fullapp) { %>
        <% if (embed) { %>
            <embed-app></embed-app>
        <% } else { %>
            <main-app></main-app>
        <% } %>
    <% } else { %>
        <% if (!(crawler && passedGeo != null))
            { %>
            <window-geo></window-geo>
        <% } %>
    <% } %>

    <script>
        window.addEventListener('WebComponentsReady', function () {
            if (!Common.standalone)
                App.init();
        });

        (function() {
            //if ('registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')) {
            //    // platform is good!
            //    if (!Common.standalone)
            //        App.init();
            //} else {
                // polyfill the platform first!
                var e = document.createElement('script');
                e.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
                document.body.appendChild(e);
            //}
        })();
    </script>
</body>

</html>