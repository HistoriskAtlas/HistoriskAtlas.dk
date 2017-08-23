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

        if (arrowLeft != null) {
            $(this.$.arrow).css('left', arrowLeft)
            if (arrowLeft < 0)
                $(this.$.arrow).css('box-shadow', '-3px 3px 3px rgba(0, 0, 0, 0.1)')
        }
        if (arrowRight != null) {
            $(this.$.arrow).css('right', arrowRight)
            if (arrowRight < 0)
                $(this.$.arrow).css('box-shadow', '3px -3px 3px rgba(0, 0, 0, 0.1)')
        }
        if (arrowTop != null) {
            $(this.$.arrow).css('top', arrowTop)
            if (arrowTop < 0)
                $(this.$.arrow).css('box-shadow', '-3px -3px 3px rgba(0, 0, 0, 0.1)')
        }
        if (arrowBottom != null) {
            $(this.$.arrow).css('bottom', arrowBottom)
            if (arrowBottom < 0)
                $(this.$.arrow).css('box-shadow', '3px 3px 3px rgba(0, 0, 0, 0.1)')
        }
    }
    
    ready() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }

    @listen('iron-overlay-closed')
    closed() {
        this.remove();
    }

    public remove() {
        $(this).remove();
    }

    closeTap() {
        if (this.localStorageKey)
            LocalStorage.set(this.localStorageKey, 'true');
        this.fire('canceltour')
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
    public set width(value: number) {
        $(this.$.dialog).css('width', value);
        $(this.$.dialog).css('max-width', value);
    }

    public setCSS(attribute: string, value: any) {
        $(this).css(attribute, value); //.$.container
        $(this.$.dialog).addClass('dialog-' + attribute);
    }

    nextText(buttonOK: boolean) {
        return buttonOK ? 'OK' : 'Næste';
    }
}

DialogTour.register();