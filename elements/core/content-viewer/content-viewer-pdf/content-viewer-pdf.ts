@component("content-viewer-pdf")
class ContentViewerPdf extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Object })
    public pdf: HaSubContentPDF;

    private fileUpload: FileUpload;

    pdfTap(e: any) {
        //Common.savePDF(Common.api + 'pdf/' + this.pdf.id + '.pdf', this.pdf.title.indexOf('.pdf') == this.pdf.title.length - 4 ? this.pdf.title : this.pdf.title + '.pdf');
        Common.savePDF(Services.getPDFUrl(this.pdf.filename), this.pdf.title.indexOf('.pdf') == this.pdf.title.length - 4 ? this.pdf.title : this.pdf.title + '.pdf');
    }

    ready() {
        if (this.pdf.title || !this.editing)
            return;

        this.fileUpload = <FileUpload>FileUpload.create(true, '*.pdf', 'target');
        this.listen(this.fileUpload, 'success', 'uploadSuccess');
        $(this.$.title).append(this.fileUpload);
        this.fileUpload.uploadClick();
    }

    private uploadSuccess(result: any) {
        this.set('pdf.filename', result.detail.file.name);
        //this.set('pdf.title', (<string>result.detail.file.name).replace('.pdf', ''));
        this.set('pdf.title', result.detail.file.name);
        $(this.fileUpload).remove();
    }
}

ContentViewerPdf.register();