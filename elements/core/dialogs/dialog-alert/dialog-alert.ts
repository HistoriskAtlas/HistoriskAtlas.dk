@component("dialog-alert")
class DialogAlert extends polymer.Base implements polymer.Element {
    @property({ type: String })
    public text: string;

    @property({ type: Boolean })
    public modal: boolean;

    @property({ type: String })
    public buttonText: string;

    private callback: () => any;

    constructor(text: string, callback: () => any = null, modal: boolean = false, buttonText: string = "OK") {
        super();
        this.callback = callback;
        this.text = text;
        this.modal = modal;
        this.buttonText = buttonText;
    }

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        $(this).remove();
        if (this.callback)
            this.callback();
    }
}

DialogAlert.register();