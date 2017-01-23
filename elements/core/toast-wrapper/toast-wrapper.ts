@component("toast-wrapper")
class ToastWrapper extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public text: string;

    @property({ type: Boolean })
    public opened: boolean;

    public show(text: string) {
        if (this.opened) {
            this.opened = false;
            setTimeout(() => this._show(text), 300);
        } else
            this._show(text);
    }

    private _show(text: string) {
        this.set('text', text);
        this.opened = true;
    }
}

ToastWrapper.register();