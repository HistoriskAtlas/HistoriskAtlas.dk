@component("window-route")
class WindowRoute extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public route: HaCollection;

    @listen('windowbasic.closed') 
    windowBasicClosed() {
        App.haCollections.deselect(this.route)
        App.map.routeLayer.clear();
    }

    @observe('route')
    routeChanged(val: HaCollection) {
        App.map.showRouteLayer()
        this.updateRouteLayer();
    }

    //public setRoute(route: HaCollection) {
    //    this.route = route;
    //    App.map.routeLayer.clear();

    //    for (var i = 1; i < route.geos.length; i++)
    //        App.map.routeLayer.addPath(route.geos[i].icon.coord4326, route.geos[i - 1].icon.coord4326);
    //}

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
        if (this.route.geos.length > 1) {
            var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
            App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
        }
    }

    @listen('geoAutosuggestRemoved')
    geoRemoved(e: any) {
        var geo = App.haGeos.geos[e.detail.id];
        this.splice('route.geos', this.route.geos.indexOf(geo), 1);
        this.route.removeGeo(geo);
        this.updateRouteLayer();
    }

    @listen('geoSortableList.update') 
    geoSortableListUpdate(e: any)
    {
        if (e.detail) {
            this.updateRouteLayer();
            this.route.updateOrdering(e.detail.oldIndex, e.detail.newIndex);
        }
    }
    //@observe('route.geos.splices')
    //routeGeosSplices(changeRecord: ChangeRecord<HaGeo>) {
    //    if (!changeRecord)
    //        return;
    //    for (var indexSplice of changeRecord.indexSplices) {
    //        for (var geo of indexSplice.removed)
    //            this.route.removeGeo(geo);
    //        for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
    //            this.route.saveNewGeo(this.route.geos[i]);
    //        if (indexSplice.addedCount > 0)
    //            this.route.updateOrdering();
    //    }
    //}

    private updateRouteLayer() {
        App.map.routeLayer.clear();
        if (!this.route)
            return;

        var lastGeo;
        for (var geo of this.route.geos) {
            if (lastGeo)
                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
            lastGeo = geo;
        }
    }

}

WindowRoute.register();