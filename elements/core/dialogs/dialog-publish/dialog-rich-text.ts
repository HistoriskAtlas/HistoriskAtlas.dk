@component("dialog-rich-text")
class DialogRichText extends polymer.Base implements polymer.Element {

    @property({ type: String })
    private headline: string;

    @property({ type: String })
    private placeholder: string;

    @property({ type: String })
    private input: string;

    private _confirmCallback: (string) => void;

    constructor(headline: string, placeholder: string, confirmCallback: (string) => void) {
        super();
        this.headline = headline;
        this.placeholder = placeholder;
        this._confirmCallback = confirmCallback
    }

    @listen('dialog.iron-overlay-closed')
    dialogIronOverlayClosed(e: any) {
        this.closeDialog(e.detail.confirmed);
    }

    private closeDialog(confirmed: boolean) {
        if (confirmed) {
            if (this._confirmCallback)
                this._confirmCallback(this.input);
        }
    }
}

DialogRichText.register();