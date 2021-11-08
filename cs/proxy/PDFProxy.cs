using System;
using System.IO;
using System.Web;
using System.Net;
using System.Web.Routing;
using System.Collections.Generic;
using System.Globalization;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using iTextSharp.text.pdf.draw;


namespace HistoriskAtlas5.Frontend
{
    public abstract class PDFProxyHandler : IHttpHandler
    {
        protected RouteData routeData;
        protected Document doc;
        private PdfWriter writer;
        private MemoryStream ms;
        protected PageEvent pageEventHandler;
        protected HttpContext context;
        
        public PDFProxyHandler(RouteData routeData) {
            this.routeData = routeData;
        }

        public abstract void ProcessRequest(HttpContext context);

        protected void StartRequest(string urlPath, bool defaultHeader = true) {
            context.Response.ContentType = "application/PDF";

            doc = new Document(PageSize.A4, 36f, 36f, 36f, defaultHeader ? 72f : 150f);
            ms = new MemoryStream();
            writer = PdfWriter.GetInstance(doc, ms);

            pageEventHandler = new PageEvent(urlPath);
            writer.PageEvent = pageEventHandler;

            doc.Open();

            if (defaultHeader)
                this.writeImage("/images/pdfHeader.jpg", null, false);
        }

        protected void EndRequest()
        {
            writer.CloseStream = false;
            doc.Close();
            ms.Position = 0;

            context.Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);
            context.Response.OutputStream.Flush();
            context.Response.OutputStream.Close();
            context.Response.End();
            ms.Close();
        }

        protected void writeGeoWithoutTitle(HAGeo geo) {
            writeByLine(geo.tags, geo.user);
            writeHtml(geo.intro);            

            foreach (HAContent content in geo.contents)
                if (content.texts.Length > 0)
                {
                    writeParagraph(content.texts[0].headline, 12, 1, 10);
                    writeHtml(content.texts[0].text1);
                }

            //newPage();
            writeHtml("<br/><br/>");

            foreach (HAGeoImage geoimage in geo.geo_images)
            {
                var licens = getLicens(geoimage.image.tags);
                var text = geoimage.image.text;
                text += geoimage.image.year.HasValue ? (geoimage.image.year.Value == 0 ? "" : " - Årstal: ") + geoimage.image.year : "";
                text += " - Fotograf: " + (string.IsNullOrEmpty(geoimage.image.photographer) ? "Ikke angivet" : geoimage.image.photographer);
                text += string.IsNullOrEmpty(licens) ? "" : (" - " + licens);
                text += string.IsNullOrEmpty(geoimage.image.licensee) ? "" : " " + geoimage.image.licensee;
                //writeImage("https://secureapi.historiskatlas.dk/api/hadb6.image/" + geoimage.image.imageid + "?action=scale&amp;size={640:10000}&amp;scalemode=inner", text); //hadb5.image
                writeImage($"https://haapi.historiskatlas.dk/image/{geoimage.image.imageid}.jpg?width=640&key=00e763e5df5f47e3a4a64aea3a18fdaa", text); //hadb5.image
            }
        }

        protected Paragraph writeParagraph(string text, float size = 12, int style = 0, float? spacingBefore = null, float? spacingAfter = null) {
            Paragraph p = new Paragraph(text, new Font(Font.FontFamily.HELVETICA, size, style));
            if (spacingBefore.HasValue)
                p.SpacingBefore = spacingBefore.Value;
            if (spacingAfter.HasValue)
                p.SpacingAfter = spacingAfter.Value;
            doc.Add(p);
            return p;
        }

        protected void writeByLine(List<HATag> tags, HAUser user) {
            List<string> institutions = new List<string>();
            foreach (HATag tag in tags)
                if (tag.category == 3)
                    institutions.Add(tag.plurName + (tag.tagid == 731 ? " / " + user.fullnameAndAbout : ""));

            var byline = institutions.Count == 0 ? user.fullnameAndAbout : string.Join(", ", institutions);

            var licens = getLicens(tags);
            if (licens != null)
                byline += " - " + licens;
            
            writeParagraph("af " + byline, 11, 2, null, 10);
        }

        protected void writeHoDLines() {
            PdfContentByte cb = writer.DirectContent;
            cb.SetLineWidth(0.5f);
            cb.SetRGBColorStroke(0, 0, 0);

            cb.MoveTo(doc.PageSize.Width / 3f, doc.PageSize.Height);
            cb.LineTo(doc.PageSize.Width / 3f, doc.PageSize.Height * (3f / 4f));
            cb.LineTo(0, doc.PageSize.Height * (3f / 4f) - (doc.PageSize.Width / 3f) * 0.4f);

            cb.MoveTo(doc.PageSize.Width * (2f / 3f), 0);
            cb.LineTo(doc.PageSize.Width * (2f / 3f), doc.PageSize.Height * (1f / 4f));
            cb.LineTo(doc.PageSize.Width, doc.PageSize.Height * (1f / 4f) + (doc.PageSize.Width / 3f) * 0.4f);

            cb.Stroke();
        }

        protected string getLicens(List<HATag> tags)
        {
            foreach (HATag tag in tags)
                if (tag.category == 4)
                    return tag.plurName;
            return null;
        }
        protected void writeHtml(string html) {
            using (var sr = new StringReader("<div>" + html + "</div>"))
                XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, sr);
        }
        protected void writeImage(string url, string text = null, bool absUrl = true, float width = 0, float left = 0, float bottom = 0)
        {
            if (!absUrl) { 
                var curUrl = HttpContext.Current.Request.Url;
                var port = curUrl.Port != 80 ? (":" + curUrl.Port) : String.Empty;
                url = String.Format("{0}://{1}{2}{3}", curUrl.Scheme, curUrl.Host, port, VirtualPathUtility.ToAbsolute(url));
            }

            //Image image = Image.GetInstance(new Uri(url));
            Image image;
            using (WebClient wc = new WebClient())
                using (Stream stream = wc.OpenRead(url))
                    using (MemoryStream ms = new MemoryStream())
                    {
                        stream.CopyTo(ms);
                        image = Image.GetInstance(ms.ToArray());
                    }
            writeImage(image, text, width, left, bottom);
        }
        protected void writeImage(byte[] data, string text = null)
        {
            writeImage(Image.GetInstance(data), text, 0, 0, 0);
        }
        private void writeImage(Image image, string text, float w, float left, float bottom) {
            if (text == null)
            {
                var width = w == 0 ? doc.PageSize.Width - doc.LeftMargin - doc.RightMargin : w;
                var height = width * (image.Height / image.Width);
                image.ScaleAbsolute(width, height);
                if (w > 0)
                    image.SetAbsolutePosition(left, bottom);
                doc.Add(image);
            }
            else
            {
                PdfPTable table = new PdfPTable(1) { KeepTogether = true, };
                PdfPCell cell = new PdfPCell(image, true) { Border = Rectangle.NO_BORDER };
                table.AddCell(cell);
                PdfPCell textCell = new PdfPCell() { Border = Rectangle.NO_BORDER };
                textCell.AddElement(new Paragraph(12, text, new Font(Font.FontFamily.HELVETICA, 10, 2)) { SpacingAfter = 15 });
                table.AddCell(textCell);
                doc.Add(table);
            }
        }

        protected void writeHeadline(string text) {
            Chunk c = new Chunk(text, new Font(Font.FontFamily.HELVETICA, 15, 1));
            c.SetGenericTag(text);
            add(new Paragraph(c));
        }
        protected void newPage()
        {
            doc.NewPage();
        }
        protected void writeTOCentry(string text) {
            var cb = writer.DirectContent;
            var template = cb.CreateTemplate(50, 50);

            var tocText = text.Length > 70 ? text.Substring(0, 64) + " [...]" : text;
            var paragraph = new Paragraph(tocText, new Font(Font.FontFamily.HELVETICA));

            paragraph.Add(new Chunk(new DottedLineSeparator()));
            doc.Add(paragraph);
            cb.AddTemplate(template, doc.PageSize.Width - doc.RightMargin - 50, writer.GetVerticalPosition(false) - 2);
            pageEventHandler.tocTemplates.Add(text, template);
        }

        protected void add(IElement elem)
        {
            doc.Add(elem);
        }
        //protected void TOC() {
        //    writer.DirectContent.AddTemplate(pageEventHandler.templateTOC, 0, 0);
        //}
        public bool IsReusable { get { return false; } }
    }

    public class PageEvent : PdfPageEventHelper
    {
        PdfContentByte cb;
        public PdfTemplate templatePageCount;
        BaseFont bf = null;
        DateTime PrintTime = DateTime.Now;
        CultureInfo culture;
        string urlPath;

        public Dictionary<string, PdfTemplate> tocTemplates = new Dictionary<string, PdfTemplate>();
        public Dictionary<String, int> toc = new Dictionary<string, int>();

        public PageEvent(string urlPath): base() {
            this.urlPath = urlPath;
        }

        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            culture = new CultureInfo("da-DK");
            PrintTime = DateTime.Now;
            bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            cb = writer.DirectContent;
            templatePageCount = cb.CreateTemplate(50, 50);
            //templateTOC = cb.CreateTemplate(50, 50);
        }

        public override void OnStartPage(PdfWriter writer, Document document)
        {
            base.OnStartPage(writer, document);
            //Rectangle pageSize = document.PageSize;
            //if (Title != string.Empty)
            //{
            //    cb.BeginText();
            //    cb.SetFontAndSize(bf, 15);
            //    cb.SetRGBColorFill(50, 50, 200);
            //    cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetTop(40));
            //    cb.ShowText(Title);
            //    cb.EndText();
            //}
            //if (HeaderLeft + HeaderRight != string.Empty)
            //{
            //    PdfPTable HeaderTable = new PdfPTable(2);
            //    HeaderTable.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            //    HeaderTable.TotalWidth = pageSize.Width - 80;
            //    HeaderTable.SetWidthPercentage(new float[] { 45, 45 }, pageSize);

            //    PdfPCell HeaderLeftCell = new PdfPCell(new Phrase(8, HeaderLeft, HeaderFont));
            //    HeaderLeftCell.Padding = 5;
            //    HeaderLeftCell.PaddingBottom = 8;
            //    HeaderLeftCell.BorderWidthRight = 0;
            //    HeaderTable.AddCell(HeaderLeftCell);
            //    PdfPCell HeaderRightCell = new PdfPCell(new Phrase(8, HeaderRight, HeaderFont));
            //    HeaderRightCell.HorizontalAlignment = PdfPCell.ALIGN_RIGHT;
            //    HeaderRightCell.Padding = 5;
            //    HeaderRightCell.PaddingBottom = 8;
            //    HeaderRightCell.BorderWidthLeft = 0;
            //    HeaderTable.AddCell(HeaderRightCell);
            //    cb.SetRGBColorFill(0, 0, 0);
            //    HeaderTable.WriteSelectedRows(0, -1, pageSize.GetLeft(40), pageSize.GetTop(50), cb);
            //}
        }

        public override void OnGenericTag(PdfWriter writer, Document document, Rectangle rect, string text) {
            if (!toc.ContainsKey(text))
                toc.Add(text, writer.CurrentPageNumber);
        }

        public override void OnEndPage(PdfWriter writer, Document document)
        {
            base.OnEndPage(writer, document);
            int pageN = writer.PageNumber;
            String text = "Side " + pageN + " af ";
            float len = bf.GetWidthPoint(text, 8);
            Rectangle pageSize = document.PageSize;
            cb.SetRGBColorFill(100, 100, 100);
            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetBottom(30));
            cb.ShowText(text);
            cb.EndText();
            cb.AddTemplate(templatePageCount, pageSize.GetLeft(40) + len, pageSize.GetBottom(30));

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, "Downloaded fra HistoriskAtlas.dk/" + urlPath + " d. " + PrintTime.ToString(culture.DateTimeFormat.LongDatePattern, culture), pageSize.GetRight(40), pageSize.GetBottom(30), 0);
            cb.EndText();
        }
        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);

            foreach (KeyValuePair<string, PdfTemplate> kvp in tocTemplates)
            {
                var text = "" + toc[kvp.Key];
                kvp.Value.SaveState();
                kvp.Value.SetColorFill(BaseColor.WHITE);
                kvp.Value.Rectangle(50 - bf.GetWidthPoint(text, 12) - 1, 0, 50, 5);
                kvp.Value.Fill();
                kvp.Value.RestoreState();

                kvp.Value.BeginText();
                kvp.Value.SetFontAndSize(bf, 12);
                kvp.Value.SetTextMatrix(0, 0);
                kvp.Value.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, text, 50, 2, 0);
                kvp.Value.EndText();
            }


            templatePageCount.BeginText();
            templatePageCount.SetFontAndSize(bf, 8);
            templatePageCount.SetTextMatrix(0, 0);
            templatePageCount.ShowText("" + (writer.PageNumber));
            templatePageCount.EndText();
        }
    }
}