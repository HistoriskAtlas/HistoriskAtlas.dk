﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Routing;
using System.Xml;

namespace HistoriskAtlas5.Frontend
{
    public class BiblioProxy : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext context)
        {
            return new BiblioProxyHandler();
        }
    }
    public class BiblioProxyHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=UTF-8";
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");

            string CQL = context.Request.QueryString["cql"]; 
            CQL = CQL.Replace("dc.title", "term.title");
            CQL = CQL.Replace("dc.subject", "facet.subject");
            CQL = CQL.Replace("dc.creator", "term.creator");
            CQL = CQL.Replace("dc.date", "facet.date");
            CQL = CQL.Replace("dc.type", "facet.type");
            CQL = CQL.Replace("dc.serverChoice", "cql.serverChoice");
            CQL = CQL.Replace("bath.notes", "term.description");
            CQL = CQL.Replace("bath.possessingInstitution", "holdingsitem.agencyId");
            //rec.id should still work


            string output = JsonConvert.SerializeObject(GetOutput(CQL));
            context.Response.Output.WriteLine(output);
        }

        private HABiblioSearchResult GetOutput(string CQL)
        {
            try
            {
                if (!ServicePointManager.SecurityProtocol.HasFlag(SecurityProtocolType.Tls12))
                    ServicePointManager.SecurityProtocol = ServicePointManager.SecurityProtocol | SecurityProtocolType.Tls12;

                XmlDocument doc = new XmlDocument();
                //doc.Load("http://localhost/cs/proxy/test.xml");
                //doc.Load(@"http://oss-services.dbc.dk/opensearch/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&agency=100200&profile=test&start=1&stepValue=50&collectionType=work-1");
                //doc.Load(@"http://opensearch.addi.dk/b3.0_4.3/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1");
                //doc.Load(@"https://opensearch.addi.dk/b3.5_4.5/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1");
                //doc.Load(@"https://oss-services.dbc.dk/opensearch/5.0/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1");
                //doc.Load(@"https://opensearch.addi.dk/b3.5_5.0/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1&profile=opac&agency=150043"); //<--ha agency and profile!
                //doc.Load(@"https://opensearch.addi.dk/b3.5_5.0/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1&profile=default&agency=190101"); //<--bibliotek.dk agency and profile!
                //doc.Load(@"https://opensearch.addi.dk/b3.5_5.2/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1&profile=default&agency=190101"); //<--bibliotek.dk agency and profile!
                doc.Load(@"https://opensearch.addi.dk/b3.5_5.2/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1&profile=opac&agency=150043"); //<--ny bibliotek.dk agency and profile!

                XmlNamespaceManager xmlnsManager = new XmlNamespaceManager(doc.NameTable);
                xmlnsManager.AddNamespace("x", "http://oss.dbc.dk/ns/opensearch");
                xmlnsManager.AddNamespace("SOAP-ENV", "http://schemas.xmlsoap.org/soap/envelope/");
                xmlnsManager.AddNamespace("ac", "http://biblstandard.dk/ac/namespace/");
                xmlnsManager.AddNamespace("dc", "http://purl.org/dc/elements/1.1/");
                xmlnsManager.AddNamespace("dcterms", "http://purl.org/dc/terms/");
                xmlnsManager.AddNamespace("dkabm", "http://biblstandard.dk/abm/namespace/dkabm/");
                xmlnsManager.AddNamespace("dkdcplus", "http://biblstandard.dk/abm/namespace/dkdcplus/");
                xmlnsManager.AddNamespace("oss", "http://oss.dbc.dk/ns/osstypes");
                xmlnsManager.AddNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");

                XmlNode result = doc.SelectSingleNode(@"SOAP-ENV:Envelope/SOAP-ENV:Body/x:searchResponse/x:result", xmlnsManager);

                if (result == null) {
                    var error = doc.SelectSingleNode(@"SOAP-ENV:Envelope/SOAP-ENV:Body/x:searchResponse/x:error", xmlnsManager).InnerText;
                    var errorPos = 0;
                    var matchPos = new Regex("at pos ([0-9]*)").Match(error);

                    if (matchPos.Success)
                        errorPos = int.Parse(matchPos.Groups[1].Value);

                    var matchUnsupported = new Regex("Unsupported index \\((.*?)\\)").Match(error);
                    if (matchUnsupported.Success)
                        error = matchUnsupported.Groups[1].Value + " er ikke understøttet";

                    var matchParentheses = new Regex("unsupported use of parentheses").Match(error);
                    if (matchParentheses.Success)
                        error = "Ikke understøttet brug af parenteser";

                    var matchSyntax = new Regex("syntax error").Match(error);
                    if (matchSyntax.Success)
                        error = "Syntaks fejl";

                    return new HABiblioSearchResult(0, CQL, error, errorPos);
                }

                HABiblioSearchResult HABiblioSearchResult = new HABiblioSearchResult(Int32.Parse(result.SelectSingleNode("x:collectionCount", xmlnsManager).InnerText), CQL);

                foreach (XmlNode searchResult in result.SelectNodes("x:searchResult", xmlnsManager))
                {
                    XmlNode record = searchResult.SelectSingleNode("x:collection/x:object/dkabm:record", xmlnsManager);

                    string title = GetFromXML(ref record, "dc:title", ref xmlnsManager);
                    if (title.StartsWith("Cannot read record"))
                        continue;

                    string publisher = GetFromXML(ref record, "dc:publisher", ref xmlnsManager);
                    string creator = GetFromXML(ref record, "dc:creator", ref xmlnsManager);
                    string subject = GetFromXML(ref record, "dcterms:abstract", ref xmlnsManager);
                    string date = GetFromXML(ref record, "dc:date", ref xmlnsManager);
                    string format = null;
                    string description = "";
                    string id = GetFromXML(ref record, "ac:identifier", ref xmlnsManager);
                    string url = "https://bibliotek.dk/da/search/work?search_block_form=" + id;
                    string type = GetFromXML(ref record, "dc:type", ref xmlnsManager);

                    List<string> identifiers = new List<string>();
                    var objectsAvailable = searchResult.SelectSingleNode("x:collection/x:object/x:objectsAvailable", xmlnsManager);
                    if (objectsAvailable != null)
                    {
                        foreach (XmlNode identifier in objectsAvailable.SelectNodes("x:identifier", xmlnsManager))
                            identifiers.Add(identifier.InnerText);
                    }

                    //subject = subject != null ? subject.Length > 400 ? subject.Substring(0, 397) + "..." : subject : null;

                    creator = publisher != null ? (creator != null ? publisher + " - " + creator : publisher) : creator;

                    HABiblioSearchResult.biblios.Add(new HABiblio() { title = title, creator = creator, subject = subject, date = date, format = format, description = description, url = url, type = type, id = id, identifiers = identifiers });
                }

                return HABiblioSearchResult;
            }
            catch (Exception e)
            {
                return new HABiblioSearchResult(0, CQL, "opensearch.addi.dk returnerede en fejl: " + e.Message);
            }
        }

        private string GetFromXML(ref XmlNode node, string tag, ref XmlNamespaceManager manager)
        {
            return (node.SelectSingleNode(tag, manager) == null) ? null : node.SelectSingleNode(tag, manager).InnerText;
        }

        public bool IsReusable { get { return false; } }

    }

    public class HABiblioSearchResult
    {
        public int count;
        public string errorMessage;
        public int errorPos;
        public List<HABiblio> biblios;
        public string CQL;

        public HABiblioSearchResult(int count, string CQL, string errorMessage = null, int errorPos = 0)
        {
            this.count = count;
            this.errorMessage = errorMessage;
            this.errorPos = errorPos;
            biblios = new List<HABiblio>();
            this.CQL = CQL;
        }
    }

    public class HABiblio
    {
        public string title;
        public string creator;
        public string subject;
        public string date;
        public string format;
        public string description;
        public string url;
        public string type;
        public string id;
        public List<string> identifiers;

        public HABiblio()
        {
        }
    }
}