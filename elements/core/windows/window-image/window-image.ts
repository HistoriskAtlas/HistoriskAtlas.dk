@component("window-image")
class WindowImage extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Array })
    public contents: Array<HaContent>;

    @property({ type: Boolean, notify: true })
    public fullscreen: Boolean;

    @property({ type: Number })
    public width: number;

    @property({ type: Number })
    public height: number;

    @property({ type: Number })
    public left: number;

    @property({ type: Number })
    public top: number;

    @property({ type: Object })
    private image: HAImage & Object;

    @property({ type: Boolean })
    public editing: boolean;

    public windowGeo: WindowGeo; //not needed when created static

    constructor(windowGeo: WindowGeo, width: number, height: number, left: number, top: number) {
        super();

        this.windowGeo = windowGeo;
        this.set('width', width);
        this.set('height', height);
        this.set('left', left);
        this.set('top', top);

        this.set('editing', windowGeo.editing);
        this.set('geo', windowGeo.geo);
        this.set('contents', windowGeo.contents);
        $('.inner-container').css('width', (((this.youTubeEmbedUrl(this.contents) ? 1 : 0) + windowGeo.geo.images.length) * 100) + '%');
        this.image = windowGeo.geo.images[0];
        this.scroll(0);
        setTimeout(() => { this.set('fullscreen', true) }, 10);

        $('.overlay').on('swipeleft', (event) => this.arrowRightTap());
        $('.overlay').on('swiperight', (event) => this.arrowLeftTap());
        if (this.youTubeEmbedUrl(this.contents))
            $('.overlay').css('pointer-events', 'none')
        $(window).resize(() => $(this.$.container).scrollLeft(this.geo.images.indexOf(this.image) * $(this.$.container).width()));
    }


    imageStyle(image: HAImage) {
        return "background-image: url('" + image.urlLowRes + "')"
    }

    showHighRes(image: HAImage, curImage: HAImage): boolean {
        return Math.abs(this.geo.images.indexOf(image) - this.geo.images.indexOf(curImage)) < 2
    }

    imageload(e: CustomEvent) {
        var image = <HTMLImageElement>e.target;
        image.parentElement.style.backgroundImage = "url('" + image.src + "')";
    }

    externalContent(contents: Array<HaContent>): HaContent {
        if (!contents)
            return null;
        for (var content of contents)
            if (content.isExternal)
                return content;
        return null;
    }
    youTubeEmbedUrl(contents: Array<HaContent>): string {
        var content = this.externalContent(contents)
        return content ? content.externals[0].embedUrl : null;
    }

    isFirstImage(image: HAImage): boolean {
        return this.geo.images[0] == image;
    }

    isLastImage(image: HAImage): boolean {
        return this.geo.images[this.geo.images.length - 1] == image;
    }

    arrowRightTap() {
        this.scroll(1);
    }

    arrowLeftTap() {
        this.scroll(-1);
    }

    @listen('licens-changed')
    licensChanged(e: any) {
        (<HaImageService>this.$.haImageService).addTagById(e.detail.tagID, true, true);
    }

    private scroll(delta: number) {
        var i = this.geo.images.indexOf(this.image) + delta;
        this.image = this.geo.images[i];
        $(this.$.container).animate({ scrollLeft: i * $('#container').width() }, 250, 'easeOutQuad');
    }

    deleteImage() {
        $(this).append(DialogConfirm.create('delete-image', 'Er du sikker på at du vil slette dette billede?'));
    }
    @listen('delete-image-confirmed')
    deleteImageConfirmed() {
        this.$.windowbasic.close();
        (<HaImageService>this.$.haImageService).deleteImage();
    }
}

WindowImage.register();