@component("window-ext-image")
class WindowExtImage extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Number })
    public width: number;

    @property({ type: Number })
    public height: number;

    constructor(geo: HaGeo) {
        super();

        this.geo = geo;
    }

}

WindowExtImage.register();