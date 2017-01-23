@component("dialog-confirm")
class DialogConfirm extends polymer.Base implements polymer.Element {

    //@property({ type: Boolean, notify: true })
    //public result: boolean;

    @property({ type: String })
    public question: string;

    //public open() {
    //    //this.result = null;
    //    this.$.dialog.open();
    //}
    private eventPrefix: string;
    private detail: Object;

    constructor(eventPrefix: string, question: string, detail: Object = null) {
        super();
        this.eventPrefix = eventPrefix;
        this.question = question;
        this.detail = detail;
    }

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        this.fire(this.eventPrefix + (e.detail.confirmed ? '-confirmed' : '-dismissed'), this.detail)
        $(this).remove();
        //this.closeDialog(e.detail.confirmed);
    }

    //checkForEnter(e: any) {
    //    if (e.which === 13) {
    //        this.$.dialog.close();
    //        this.closeDialog(true);
    //    }
    //}
    //private closeDialog(confirmed: boolean) {
    //    if (confirmed)
    //        this.result = true;
    //}
}

DialogConfirm.register();