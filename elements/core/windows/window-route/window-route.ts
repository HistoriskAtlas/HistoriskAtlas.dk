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

        //todo:...............................................................................................
        //for (var i = 1; i < route.geos.length; i++)
        //    App.map.routeLayer.addPath(route.geos[i].icon.coord4326, route.geos[i - 1].icon.coord4326);
    }

    addGeoTap() {

    }

    //public addGeo(geo: HaGeo) {
    //    this.push('route.geos', geo);
    //    this.route.saveNewGeo(geo)
    //    if (this.route.geos.length > 1) {
    //        var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
    //        App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
    //    }
    //}

    //geoTap(e: any) {
    //    Common.dom.append(WindowGeo.create(<HaGeo>e.model.geo));
    //}

    getAutosuggestSchema(geos: Array<HaGeo>): string {
        var existingIds: Array<number> = [];
        for (var geo of geos)
            existingIds.push(geo.id)
        return '{geo:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},title:{like:$input}},fields:[id,title]}}';
    }

    @listen('geoAutosuggestSelected')
    geoSelected(e: any) {
        Common.dom.append(WindowGeo.create(<HaGeo>e.detail));
    }

    @listen('geoAutosuggestAdded')
    geoAdded(e: any) {
        var geo = App.haGeos.geos[e.detail.id];
        geo.title = e.detail.title;
        App.map.centerAnim(geo.coord, 3000, true, true);
        //geo.zoomUntilUnclustered
        this.push('route.geos', geo);
        this.route.saveNewGeo(geo)
        //if (this.route.geos.length > 1) {
        //    var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
        //    App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
        //}
    }

    @listen('geoAutosuggestRemoved')
    geoRemoved(e: any) {
        var geo = App.haGeos.geos[e.detail.id];
        this.splice('route.geos', this.route.geos.indexOf(geo), 1);
        this.route.removeGeo(geo);
    }


}

WindowRoute.register();