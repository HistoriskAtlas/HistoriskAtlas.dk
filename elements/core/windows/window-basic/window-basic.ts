@component("window-basic")
class WindowBasic extends polymer.Base implements polymer.Element {

    @property({ type: Number, notify: true })
    public left: number;

    @property({ type: Number, notify: true })
    public top: number;

    @property({ type: Number, notify: true })
    public right: number;

    @property({ type: Number, notify: true })
    public bottom: number;

    @property({ type: Number, notify: true, value: 500 })
    public width: number;

    @property({ type: Number, notify: true, value: 550 })
    public height: number;

    @property({ type: Number, value: 0 })
    public elevation: number;

    @property({ type: Object, value: false })
    public secColor: boolean & Object;

    @property({ type: Object, value: false })
    public lightbox: boolean & Object;

    @property({ type: Boolean, value: false, notify: true })
    public fullscreen: boolean;

    @property({ type: Boolean, value: false })
    public allowFullscreen: boolean;

    @property({ type: String, value: 'seamed' })
    public toolbarMode: string;

    @property({ type: String, value: '' })
    public toolbarHeight: string;

    private dom: JQuery;
    private static biggestZindex: number = 10;
    private static defaultTransition: string = 'left 0.4s, right 0.4s, top 0.4s, bottom 0.4s, width 0.4s, height 0.4s, opacity 0.2s';
    public cancelClose: boolean;

    constructor() {
        this.dom = $(this.domHost)

        if (this.right)
            this.set('left', Common.dom.width() - this.width - this.right);
        if (this.bottom)
            this.set('top', Common.dom.height() - this.height - this.bottom);
        if (!this.left)
            this.set('left', Math.max(0, Math.floor((Common.dom.width() - this.width) / 2)));
        if (!this.top)
            this.set('top', Math.max(0, Math.floor((Common.dom.height() - this.height) / 2)));

        this.dom.css('position', 'fixed'); //was absolute
        this.dom.css('opacity', 0);
        this.dom.offset({ left: this.left, top: this.top })
        this.dom.width(this.width);
        this.dom.height(this.height);
        this.dom.css('display', 'block');
        this.dom.addClass('fullscreen-when-narrow');
        this.bringToFront();

        //if (this.fullscreen)
        //    this.fullscreenChanged();
        setTimeout(() => { this.elevation = 2; this.dom.css('transition', 'opacity 0.2s'); this.dom.css('opacity', 1); }, 0);

        super();
    }

    //@computed({ type: String })
    toolbarClass(secColor: boolean, lightbox: boolean, toolbarHeight: string): string {
        return 'noselect' + (toolbarHeight ? ' ' + toolbarHeight : '') + (lightbox ? ' lightbox' : (secColor ? ' HASecColor' : ' HAPrimColor'));
    }

    materialClass(lightbox: boolean) {
        return lightbox ? 'lightbox' : '';
    }

    fullscreenButtonClass(allowFullscreen: boolean): string {
        return allowFullscreen ? 'hide-when-narrow' : 'hidden';
    }

    fullscreenIcon(fullscreen: boolean): string {
        return fullscreen ? 'fullscreen-exit' : 'fullscreen';
    }

    @listen("fullscreen.tap")
    fullscreenTap() {
        this.set('fullscreen', !this.fullscreen);
    }
    @observe('fullscreen')
    fullscreenChanged() {
        if (!this.dom)
            return;

        //if (this.fullscreen) {
            this.dom.css('transition', WindowBasic.defaultTransition)
            setTimeout(() => this.dom.css('transition', 'opacity 0.2s'), 500);
        //}
        this.dom.toggleClass('fullscreen');
    }

    @observe('left')
    leftChanged() {
        if (this.dom)
            this.dom.css('left', this.left)
    }

    @observe('top')
    topChanged() {
        if (this.dom)
            this.dom.css('top', this.top)
    }

    @observe('width')
    widthChanged() {
        if (this.dom)
            this.dom.width(this.width);
    }

    @observe('height')
    heightChanged() {
        if (this.dom)
            this.dom.height(this.height);
    }

    @listen("down")
    public bringToFront() {
        if (parseInt(this.dom.css('zIndex')) == WindowBasic.biggestZindex)
            return;

        this.dom.css('zIndex', ++WindowBasic.biggestZindex);
    }

    @listen("close.tap")
    @listen("back.tap")
    close() {
        var test = (<Event>this.fire('closing'));
        if (this.cancelClose) {
            this.cancelClose = false;
            return;
        }
        this.elevation = 0;
        this.dom.css('transition', WindowBasic.defaultTransition)
        this.dom.css('opacity', 0);
        setTimeout(() => {
            this.fire('closed');
            this.dom.remove();
        }, 200);
    }

    @listen("toolbar.track")
    track(e) {
        switch (e.detail.state) {
            case 'start':
                this.elevation = 4;
                break;
            case 'track': 
                this.set('left', this.left + e.detail.ddx);
                this.set('top', this.top + e.detail.ddy);
                break;
            case 'end':
                this.elevation = 2;
                break;
        }
    }
}

WindowBasic.register();