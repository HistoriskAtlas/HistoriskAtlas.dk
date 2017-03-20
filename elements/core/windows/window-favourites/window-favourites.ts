@component("window-favourites")
class WindowFavourites extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public collection_geos: Array<HaCollectionGeo>;

    constructor() {
        super();
        this.collection_geos = App.haUsers.user.favourites.collection_geos;
        App.haUsers.addEventListener('userFavouritesGeosChanged', () => this.$.templateGeos.render())
    }
    
    @listen('windowbasic.closed') 
    windowBasicClosed() {
        App.windowFavourites = null;
    }

    geoTap(e: any) {
        Common.dom.append(WindowGeo.create(<HaGeo>e.model.geo));
    }

    geoTapRemove(e: any) {
        e.cancelBubble = true;
        this.splice('collection_geos', this.collection_geos.indexOf(e.model.geo), 1)
    }
}

WindowFavourites.register();