@component("dialog-tour")
class DialogTour extends polymer.Base implements polymer.Element {

    //@property({ type: Object })
    //public positionTarget: Object;
    @property({ type: String })
    public title: string;
    @property({ type: String })
    public text: string;

    @property({ type: Boolean })
    private opened: boolean;

    @property({ type: Boolean })
    private buttonOK: boolean;

    private localStorageKey: string;

    constructor(title: string, text: string, left: number, right: number, top: number, bottom: number, arrowLeft: number, arrowRight: number, arrowTop: number, arrowBottom: number, buttonOK: boolean = false, localStorageKey: string = null) {
        super();

        this.title = title;
        this.text = text;
        this.buttonOK = buttonOK;
        this.localStorageKey = localStorageKey;

        if (left != null)
            this.left = left;
        if (right != null)
            this.right = right;
        if (top != null)
            this.top = top;
        if (bottom != null)
            this.bottom = bottom;

        if (arrowLeft != null)
            $(this.$.arrow).css('left', arrowLeft)
        if (arrowRight != null)
            $(this.$.arrow).css('right', arrowRight)
        if (arrowTop != null)
            $(this.$.arrow).css('top', arrowTop)
        if (arrowBottom != null)
            $(this.$.arrow).css('bottom', arrowBottom)
    }
    
    ready() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }

    @listen('iron-overlay-closed')
    closed() {
        $(this).remove();
    }

    closeTap() {
        if (this.localStorageKey)
            LocalStorage.set(this.localStorageKey, 'true');
    }

    nextTap() {
        this.fire('next')
    }

    public set left(value: number) {
        this.setCSS('left', value);
    }
    public set right(value: number) {
        this.setCSS('right', value);
    }
    public set top(value: number) {
        this.setCSS('top', value);
    }
    public set bottom(value: number) {
        this.setCSS('bottom', value);
    }

    public setCSS(attribute: string, value: number) {
        $(this.$.container).css(attribute, value);
        $(this.$.dialog).addClass('dialog-' + attribute);
    }

    nextText(buttonOK: boolean) {
        return buttonOK ? 'OK' : 'Næste';
    }
}

DialogTour.register();