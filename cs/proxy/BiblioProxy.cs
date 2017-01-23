using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
            CQL = CQL.Replace("dc.title", "dkcclterm.ti");
            CQL = CQL.Replace("dc.subject", "dkcclterm.em");
            CQL = CQL.Replace("dc.creator", "dkcclterm.fo");
            CQL = CQL.Replace("dc.date", "dkcclterm.år");
            CQL = CQL.Replace("dc.type", "dkcclterm.ma");
            CQL = CQL.Replace("dc.serverChoice", "cql.serverChoice");
            CQL = CQL.Replace("bath.notes", "term.description");
            CQL = CQL.Replace("bath.possessingInstitution", "dkcclterm.ln");
            //rec.id should still work


            string output = JsonConvert.SerializeObject(GetOutput(CQL));
            context.Response.Output.WriteLine(output);
        }

        private HABiblioSearchResult GetOutput(string CQL)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //doc.Load(@"http://oss-services.dbc.dk/opensearch/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&agency=100200&profile=test&start=1&stepValue=50&collectionType=work-1");
                doc.Load(@"http://opensearch.addi.dk/b3.0_4.3/?action=search&query=" + HttpUtility.UrlEncode(CQL) + @"&start=1&stepValue=50&collectionType=work-1"); //WAS version 4.0
                //doc.Load("http://localhost/cs/proxy/test.xml");
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

                if (result == null)
                    return new HABiblioSearchResult(0);

                HABiblioSearchResult HABiblioSearchResult = new HABiblioSearchResult(Int32.Parse(result.SelectSingleNode("x:collectionCount", xmlnsManager).InnerText));

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
            catch
            {
                return new HABiblioSearchResult(0, "opensearch.addi.dk returnerede en fejl.");
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
        public List<HABiblio> biblios;

        public HABiblioSearchResult(int count, string errorMessage = null)
        {
            this.count = count;
            this.errorMessage = errorMessage;
            biblios = new List<HABiblio>();
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