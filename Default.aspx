<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HistoriskAtlas5.Frontend.Default" %>

<!DOCTYPE html>

<html lang="da">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="<%=(passedGeo == null ? "G&aring; p&aring; opdagelse i historiske kort og udforsk din lokale kulturarv." : htmlEncode(passedGeo.intro))%>" />
    <title><%=(passedGeo == null ? (passedTag == null ? "" : htmlEncode(passedTag.plurName) + " | ") : htmlEncode(passedGeo.title) + " | ")%>Historisk Atlas</title>

<!--#region appicon -->
    <meta name="application-name" content="Historisk Atlas" />
    <meta property="og:title" content="Historisk Atlas" />
    <meta property="og:image" content="/images/appicons/logo-1000x1000.png" />
    <link rel="icon" href="favicon.ico" />
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
    <link rel="icon" type="image/png" href="/images/appicons/android-128x128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="/images/appicons/android-196x196.png" sizes="196x196" />
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
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-1465579-9', {'name':'obm'});
        ga('create', 'UA-84971843-1', {'name':'ha'});
        ga('obm.send', 'pageview');
        ga('ha.send', 'pageview');
    </script>

    <%--Polymer links --%>
    <%--<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>--%> <%--TODO: needed in chrome? Bundle? --%>
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
    <%--<link rel="import" href="bower_components/paper-radio-group/paper-radio-group.html">--%>
    <link rel="import" href="bower_components/paper-radio-button/paper-radio-button.html">   
    <link rel="import" href="bower_components/paper-dialog/paper-dialog.html">   
    <link rel="import" href="bower_components/paper-dropdown-menu/paper-dropdown-menu.html">   
    <link rel="import" href="bower_components/paper-listbox/paper-listbox.html">   
    <link rel="import" href="bower_components/paper-toggle-button/paper-toggle-button.html">   
    <%--<link rel="import" href="bower_components/paper-spinner/paper-spinner-lite.html">--%>   
    <link rel="import" href="bower_components/gold-email-input/gold-email-input.html">   
    
    
    <%=string.Format("<link rel=\"import\" href=\"{0}\">", System.Web.Optimization.BundleTable.Bundles.ResolveBundleUrl("~/bundles/ha_core_" + (passedGeo == null ? "" : "geo_only_")  + "html"))%>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold&lang=da" type="text/css" /> <%--,italic,thin,light,bolditalic,black,medium--%>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> <%--TODO: needed?--%>
    <%:System.Web.Optimization.Styles.Render("~/bundles/ha_css") %>
    <style is="custom-style">
    :root {
        /*--dark-primary-color: #FFA000;*/
        --default-primary-color: #005b9c;
        /*--light-primary-color: #FFECB3;*/
        --text-primary-color: #FFFFFF;
        --accent-color: #fece00;
        --primary-text-color: #000000;
        --secondary-text-color: #000000;
        /*--divider-color: #B6B6B6;*/
    }
    </style>

    <script type="text/javascript">
        document.sid = '<%=(Request.Cookies["ASP.NET_SessionId"] != null ? Request.Cookies["ASP.NET_SessionId"].Value : "")%>';
    </script>
    <script src="//connect.facebook.com/da_DK/sdk.js" type="text/javascript" id="facebook-jssdk"></script><%--Possibly IE bug here?--%>
    <script src="https://apis.google.com/js/client:platform.js" type="text/javascript"></script> <%--TODO: use polymerversion instead?--%> 
    <%:System.Web.Optimization.Scripts.Render("~/bundles/jquery") %>
    <%:System.Web.Optimization.Scripts.Render("~/bundles/jquery-extent") %>
    <script src="./js/ol/ol-custom.js" type="text/javascript"></script>
    
    <%--:System.Web.Optimization.Scripts.Render("~/bundles/ha_core") --%>
    <link rel="import" href="elements/ha_core<%=(passedGeo == null ? "" : "_geo_only")%>.aspx"> <!-- Workaround for webcomponents polyfill browsers -->
    
    <style>
    <% if (passedGeo != null) { %>
        body {
            background-color: grey;
        }
    <% } %>
    </style>
</head>
<body<%=(crawler && passedGeo != null ? " style=\"overflow:auto\"" : "")%>>
    <% foreach (HistoriskAtlas5.Frontend.HATag tag in sitemapTags.data) { %>
        <a href="<%=tag.urlPath%>"><%=tag.plurName%></a>
    <% } %>
    <% foreach (HistoriskAtlas5.Frontend.HAGeo geo in sitemapGeos.data) { %>
        <a href="<%=geo.urlPath%>"><%=geo.title%></a>
    <% } %>
    <% if (crawler && passedGeo != null) { %>
        <h1><%=passedGeo.title%></h1>
        <% if (passedGeo.geo_images != null) { %>
            <% foreach (HistoriskAtlas5.Frontend.HAGeoImage image in passedGeo.geo_images) { %>
                <img src="http://api.historiskatlas.dk/hadb5.image/<%=image.image.id%>" style="width:50%"/><br>
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
            tag: <%=(passedTag == null ? "null" : json(passedTag) )%>,
            theme: <%=(passedTheme == null ? "null" : json(passedTheme) )%>,
            dev: <%=(dev ? "true": "false")%>,
            redribbon: <%=(Request.QueryString["redribbon"] != null ? (Request.QueryString["redribbon"] == "false" ? "false" : "true") : "false")%>
        };
    </script>
    <% if (passedGeo == null) { %>
        <main-app></main-app>
    <% } else { %>
        <window-geo></window-geo>
    <% } %>

    <script>
        window.addEventListener('WebComponentsReady', function() {
            App.init();
        });

        (function() {
            if ('registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')) {
                // platform is good!
                if (!Common.standalone)
                    App.init();
            } else {
                // polyfill the platform first!
                var e = document.createElement('script');
                e.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
                document.body.appendChild(e);
            }
        })();
    </script>
</body>

</html>