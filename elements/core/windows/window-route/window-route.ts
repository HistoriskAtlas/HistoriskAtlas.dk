@component("window-route")
class WindowRoute extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public route: HaCollection;

    constructor(route: HaCollection) {
        super();
        App.windowRoute = this;
        App.map.showRouteLayer();
        this.setRoute(route);
        //App.haUsers.addEventListener('userFavouritesGeosChanged', () => this.$.templateGeos.render())
    }
    
    @listen('windowbasic.closed') 
    windowBasicClosed() {
        App.windowRoute = null;
        App.map.routeLayer.clear();
    }

    public setRoute(route: HaCollection) {
        this.route = route;
        App.map.routeLayer.clear();
        for (var i = 1; i < route.geos.length; i++)
            App.map.routeLayer.addPath(route.geos[i].icon.coord4326, route.geos[i - 1].icon.coord4326);
    }

    public addGeo(geo: HaGeo) {
        this.push('route.geos', geo);
        this.route.saveNewGeo(geo)
        if (this.route.geos.length > 1) {
            var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
            App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
        }
    }

    geoTap(e: any) {
        Common.dom.append(WindowGeo.create(<HaGeo>e.model.geo));
    }
}

WindowRoute.register();