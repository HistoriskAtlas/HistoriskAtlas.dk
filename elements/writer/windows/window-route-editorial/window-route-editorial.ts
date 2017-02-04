@component("window-route-editorial")
class WindowRouteoEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    @property({ type: Object })
    public route: HaCollection;

    @property({ type: Array, notify: true })
    public destinations: Array<HaTag>;

    @property({ type: Object })
    public tagsService: Tags;
}

WindowRouteoEditorial.register();