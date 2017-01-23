@component("dialog-alert")
class DialogAlert extends polymer.Base implements polymer.Element {
    @property({ type: String })
    public text: string;

    private callback: () => any;

    constructor(text: string, callback: () => any = null) {
        super();
        this.callback = callback;
        this.text = text;
    }

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        $(this).remove();
        if (this.callback)
            this.callback();
    }
}

DialogAlert.register();