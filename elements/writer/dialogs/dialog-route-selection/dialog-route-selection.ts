@component("dialog-route-selection")
class DialogRouteSelection extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public title: string;

    @property({ type: String })
    public collections: Array<HaCollection>;

    private geo: HaGeo;

    constructor(title, geo: HaGeo) {
        super();
        this.title = title;
        this.geo = geo;
        this.collections = App.haCollections.collections;
    }

    newRouteTap() {
        App.haCollections.newRoute(this.geo);
    }

    existingRouteTap(e) {
        var route = <HaCollection>e.model.collection;
        App.haCollections.select(<HaCollection>e.model.collection, this.geo)
    }

    @listen('dialog.iron-activate')
    @listen('dialog.iron-overlay-closed')
    close() {
        $(this).remove();
    }
}

DialogRouteSelection.register();