<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LangSelect.aspx.cs" Inherits="HistoriskAtlas5.Frontend.LangSelect" %>

<!DOCTYPE html>

<html>
<head>
    <title>Historisk Atlas - choose language</title>
    <meta name="viewport" content="width=device-width; initial-scale=1.0; user-scalable=no" />
    <style>
        .langDiv {
            font-size:30px;
            background-color:#808080;
            margin-left:auto;
            margin-right:auto;
            width:246px;
            padding:14px;       
            color:#ffffff;
            text-align:left;
            min-height:40px;
        }
        .titleDiv {
            font-size:15px;
            min-height:43px;

            display:-ms-flexbox;
            -ms-flex-align:center;

            display:-moz-box;
            -moz-box-align:center;

            display:-webkit-box;
            -webkit-box-align:center;

            display:box;
            box-align:center;
        }
        A {
            text-decoration:none;
        }
        .flagImg {
            width:42px;
            height:43px;
            border:0px;
            float:left;
            padding-right:10px;
        }
    </style>
</head>
<body style="text-align:center; background-color:#e4e4e4; font-family:Arial; font-size:18px; color:#808080">
    <br>
    <img src="images/splash/logo.png" style="width:250px; border:0px" /><br>
    <br>
    <b>vælg sprog</b> / select language<br>
    <% 
        NameValueCollection qs = Request.QueryString;
        foreach (string lang in new string[] { "da", "en", "de" }) {
            if (qs[lang + "Title"] == null && qs[lang + "GeoID"] == null)
                continue;

            var test = qs[lang + "GeoID"];
            int geoid = qs[lang + "GeoID"] == null ? 0 : Int32.Parse(qs[lang + "GeoID"]);
            HistoriskAtlas5.Frontend.HAGeo geo = GetGeo(geoid);
            string title = Request.QueryString[lang + "Title"] == null ? geo.title : HttpUtility.UrlDecode(Request.QueryString[lang + "Title"]);
            string url = Request.QueryString[lang + "Url"] == null ? geo.absUrlPath : HttpUtility.UrlDecode(Request.QueryString[lang + "Url"]);
           %>
    <br>
    <a href="<%=url%>">
        <div class="langDiv"<% if (lang == "da") { %> style="font-weight:bold"<% } %>>
            <%--<%=lang %><br><br><span class="titleSpan"><%=title%></span>--%>
            <img src="images/lang/<%=lang%>Flag.png" class="flagImg"><div class="titleDiv"><%=title%></div>
        </div>
    </a>
    <% } %>
</body>
</html>
