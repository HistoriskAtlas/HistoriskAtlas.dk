@component("dialog-text")
class DialogText extends polymer.Base implements polymer.Element {
    
    @property({ type: String })
    private input: string;

    //@property({ type: Boolean, notify: true })
    //public opened: boolean;

    @property({ type: String })
    public confirmCallback: string;

    @property({ type: String })
    public headline: string;

    @property({ type: String })
    public text: string;

    @property({ type: String })
    public type: string;

    @property({ type: Boolean, value: false })
    public required: boolean;

    @property({ type: Number })
    public minlength: number;

    @property({ type: String })
    public errorMessage: string;

    @property({ type: String })
    public label: string;

    @property({ type: String, value: "OK" })
    public textOK: string;

    @property({ type: Boolean, value: false })
    public autoValidate: boolean;    

    private confirmCallbackFunction: (string) => void;

    constructor(headline: string, confirmCallbackFunction: (string) => void, prefilled: string = null, text: string = null, label: string = null, textOK: string = null) {
        super();
        if (!headline) //if declerative created
            return;
        this.headline = headline;
        this.text = text;
        this.confirmCallbackFunction = confirmCallbackFunction;
        this.label = label;
        if (textOK)
            this.textOK = textOK;
        this.open(null, prefilled);
    }

    public open(confirmCallback: string = null, prefilled: string = null) {
        if (confirmCallback)
            this.confirmCallback = confirmCallback;
        if (prefilled)
            this.input = prefilled;
        this.$.dialog.open();
    }

    @listen('dialog.iron-overlay-closed')
    dialogIronOverlayClosed(e: any) {
        this.closeDialog(e.detail.confirmed);
    }

    checkForEnter(e: any) {
        if (e.which === 13) {
            this.closeDialog(true);
        }
    }
    dismiss() {
        this.closeDialog(false);
    }
    confirm() {
        this.closeDialog(true);
    }

    private closeDialog(confirmed: boolean) {
        if (!this.$.dialogInput.validate() && confirmed)
            return;

        this.$.dialog.close();

        if (confirmed) {
            if (this.confirmCallback) 
                this.fire(this.confirmCallback, this.input);
            if (this.confirmCallbackFunction)
                this.confirmCallbackFunction(this.input);
        }

        this.input = '';
    }
}

DialogText.register();