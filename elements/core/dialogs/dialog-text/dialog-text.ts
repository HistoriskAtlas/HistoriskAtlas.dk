@component("dialog-text")
class DialogText extends polymer.Base implements polymer.Element {
    
    @property({ type: String })
    private input: string;

    //@property({ type: Boolean, notify: true })
    //public opened: boolean;

    @property({ type: String })
    public confirmCallback: string;

    @property({ type: String })
    public text: string;

    private confirmCallbackFunction: (string) => void;

    constructor(text: string, confirmCallbackFunction: (string) => void, prefilled: string = null) {
        super();
        if (!text) //if declerative created
            return;
        this.text = text;
        this.confirmCallbackFunction = confirmCallbackFunction;
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
            this.$.dialog.close();
            this.closeDialog(true);
        }
    }
    private closeDialog(confirmed: boolean) {
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