@component("dialog-embed")
class DialogEmbed extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public src: string;

    @property({ type: Boolean, notify: true })
    public show: boolean;

    @property({ type: Number, value: 1 })
    public size: number;

    @property({ type: Number, value: 600 })
    public embedWidth: number;

    @property({ type: Number, value: 450 })
    public embedHeight: number;

    ready() {
        window.addEventListener("message", (e) => {
            if (e.data.event == 'urlChanged') {
                this.src = e.data.url; //TODO: dont change the url of the iframe.... post messages instead and change settings that way..................
            }
        });

        this.src = UrlState.stateUrl + '&embed'; 
    }

    private html(src: string): string {
        return '<iframe src="' + src + '" width="500" height="500" frameborder="0" style="border:0"></iframe>';
    }

    @observe('size') 
    sizeChanged() {
        switch (this.size) {
            case 0: this.embedWidth = 400; this.embedHeight = 300; break;
            case 1: this.embedWidth = 600; this.embedHeight = 450; break;
            case 2: this.embedWidth = 800; this.embedHeight = 600; break;
        }
    }

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        if (e.target == this.$.dialog)
            this.show = false;
    }

}

DialogEmbed.register();