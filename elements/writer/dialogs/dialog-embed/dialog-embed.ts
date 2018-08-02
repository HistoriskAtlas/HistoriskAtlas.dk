@component("dialog-embed")
class DialogEmbed extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public src: string;

    @property({ type: String })
    public initialSrc: string;

    @property({ type: Boolean, notify: true })
    public show: boolean;

    @property({ type: Number, value: 1 })
    public size: number;

    @property({ type: Number, value: 600 })
    public embedWidth: number;

    @property({ type: Number, value: 450 })
    public embedHeight: number;

    @property({ type: Boolean, value: true })
    public optionBorder: boolean;

    @property({ type: Boolean, value: true })
    public optionOpenGeoWindowInNewTab: boolean;

    private messageEventListener: (e: any) => void;

    ready() {
        this.messageEventListener = (e) => { //TODO: post messages and change settings that way..................
            if (e.data.event == 'urlChanged') {
                this.src = e.data.url;
            }
        }
        window.addEventListener('message', this.messageEventListener);

        this.initialSrc = this.src = UrlState.embedStateUrl; 
    }

    private html(src: string, width: number, height: number, size: number, optionBorder: boolean): string {
        return '<iframe src="' + Common.baseUrl + '/' + src + '" ' + (size == 4 ? '' : 'width="' + this.restrictDimension(width) + '" height="' + this.restrictDimension(height) + '" ') + 'frameborder="0" style="' + this.iframeBorder(optionBorder) + '"></iframe>';
    }

    iframeBorder(optionBorder: boolean): string {
        return 'border:' + (optionBorder ? '1px solid black; appearance:none; -moz-appearance: none; -webkit-appearance:none; outline: none;' : '0');
    }

    showCustomSizeFields(size: number): boolean {
        return size == 3;
    }

    restrictDimension(value: number): number {
        return Math.max(Math.min(value, 2000), 300);
    }

    @observe('size') 
    sizeChanged() {
        switch (this.size) {
            case 0: this.embedWidth = 400; this.embedHeight = 300; break;
            case 1: this.embedWidth = 600; this.embedHeight = 450; break;
            case 2: this.embedWidth = 800; this.embedHeight = 600; break;
        }
    }

    @observe('embedWidth')
    @observe('embedHeight')
    @observe('optionBorder')
    embedDimensionChanged() {
        this.$.dialog.notifyResize();
    }

    @observe('optionOpenGeoWindowInNewTab')
    optionOpenGeoWindowInNewTabChanged() {
        if (this.$.embedIframe.contentWindow)
            this.$.embedIframe.contentWindow.postMessage({ event: 'openGeoWindowInNewTab', value: this.optionOpenGeoWindowInNewTab }, '*');
    }    

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        if (e.target == this.$.dialog) {
            this.show = false;
            window.removeEventListener('message', this.messageEventListener);
        }
    }


}

DialogEmbed.register();