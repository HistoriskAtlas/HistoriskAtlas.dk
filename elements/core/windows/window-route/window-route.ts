@component("window-route")
class WindowRoute extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public route: HaCollection;

    @property({ type: Array })
    public subjects: Array<HaTag>;

    @property({ type: Array })
    public periods: Array<HaTag>;

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Boolean, value: false })
    public windowEditorialShown: boolean;

    @property({ type: Array, notify: true })
    public destinations: Array<HaTag>;

    @property({ type: Array })
    public institutions: Array<HaTag>;

    @listen('windowbasic.closed') 
    windowBasicClosed() {
        if (this.route) {
            this.route.saveProp('distance');
            App.haCollections.deselect(this.route);
        }
        //App.map.routeLayer.clear();
    }

    renameTap() {
        Common.dom.append(DialogText.create('Angiv ny titel på turforslag', (title) => this.set('route.title', title)));
    }

    editorialTap() {
        this.windowEditorialShown = !this.windowEditorialShown;
    }
    windowEditorialClosed() {
        this.windowEditorialShown = false;
    }

    togglePublishText(online: boolean): string {
        return (online ? 'Afp' : 'P') + 'ublicér turforslag';
    }
    togglePublishedTap() {
        this.set('route.online', !this.route.online);
    }

    deleteTap() {
        $(this).append(DialogConfirm.create('delete-route', 'Er du sikker på at du vil slette dette turforslag?'));
    }
    @listen('delete-route-confirmed')
    deleteRouteConfirmed() {
        var route = this.route;
        this.set('route.selected', false);
        App.haCollections.deselect(this.route);
        App.haCollections.deleteRoute(route);
        this.$.windowbasic.close();
    }


    //@observe('route')
    //routeChanged(val: HaCollection) {
    //    App.map.showRouteLayer()
    //    //this.updateRouteLayer();
    //}

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
        //if (this.route.geos.length > 1) {
        //    var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
        //    App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, (distance) => {
        //        this.route.distance += distance;
        //    });
        //}
    }

    @listen('geoAutosuggestRemoved')
    geoRemoved(e: any) {
        var geo = e.detail; //App.haGeos.geos[e.detail.id];
        if (geo.id)
            this.route.removeGeo(geo);
        this.splice('route.geos', this.route.geos.indexOf(geo), 1);
        //this.updateRouteLayer();
    }

    @listen('update')  //geoSortableList.update....
    geoSortableListUpdate(e: any) {
        if (e.detail) {
            this.route.updateOrdering(e.detail.oldIndex, e.detail.newIndex); //TODO: wait for routelayer update so distance can also be saved, same in the two above.........?
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

    public formatDistance(distance: number): string {
        return HaCollection.formatDistance(distance);
    }

    public formatType(type: number): string {
        return HaCollection.types[type];
    }

    public types(): Array<string> {
        return HaCollection.types;
    }

    typeTap(e: any) {
        this.set('route.type', HaCollection.types.indexOf(e.model.item));
        this.$$('#paperMenuButtonType').close();
    }

    showPeriodTags(length: number, editing: boolean): boolean {
        return editing || length > 0;
    }
    tagsService(): Tags {
        return App.haCollections;
    }
}

WindowRoute.register();