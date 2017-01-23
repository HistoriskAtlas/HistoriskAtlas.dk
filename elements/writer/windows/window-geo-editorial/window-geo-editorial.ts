@component("window-geo-editorial")
class WindowGeoEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    @property({ type: Object })
    public geo: HaGeo;

    //@property({ type: Object })
    //public contents: Array<HaContent>;

    @property({ type: Object, notify: true })
    public content: HaContent;

    //@observe('contents')
    //contentsChanged() {
    //    if (this.contents)
    //        this.$.selector.select(this.contents.filter((content) => content.isEditorial).pop())
    //}

}

WindowGeoEditorial.register();