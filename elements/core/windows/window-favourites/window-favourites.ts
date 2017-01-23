@component("window-favourites")
class WindowFavourites extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public geos: Array<HaGeo>;

    constructor() {
        super();
        this.geos = App.haUsers.user.favourites.geos;
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
        this.splice('geos', this.geos.indexOf(e.model.geo), 1)
    }
}

WindowFavourites.register();