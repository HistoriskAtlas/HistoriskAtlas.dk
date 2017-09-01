@component("content-viewer-pdf")
class ContentViewerPdf extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Object })
    public pdf: HaSubContentPDF;

    pdfTap(e: any) {
        Common.savePDF(Common.api + 'pdf/' + this.pdf.id + '.pdf', this.pdf.filename);
    }

    closeTap(e: any) {
        e.stopPropagation();
        //TODO
    }
}

ContentViewerPdf.register();