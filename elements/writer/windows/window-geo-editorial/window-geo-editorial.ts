@component("window-geo-editorial")
class WindowGeoEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    @property({ type: Object })
    public geo: HaGeo;

    @property({ type: Array, notify: true })
    public destinations: Array<HaTag>;

    @property({ type: Object, notify: true })
    public content: HaContent;

    @property({ type: Array, notify: true })
    public contents: Array<HaContent>;

    @property({ type: Object })
    public tagsService: Tags;
}

WindowGeoEditorial.register();