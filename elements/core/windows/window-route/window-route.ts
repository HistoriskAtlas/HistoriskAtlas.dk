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

    shareGoogleMaps() {
        var coords: Array<string> = [];
        var via: Array<number> = [];
        for (var cg of this.route.collection_geos) {
            var coord = Common.fromMapCoord(cg.coord);
            coords.push(coord[1].toFixed(7) + ',' + coord[0].toFixed(7));
            if (cg.isViaPoint)
                via.push(this.route.collection_geos.indexOf(cg) + 1);
        }

        window.open('https://www.google.dk/maps/dir/?saddr=My+Location&daddr=' + coords.join('+to:') + (via.length > 0 ? '&via=' + via.join(',') : '') + '&dirflg=' + HaCollection.googleMapsTypes[this.route.type], '_blank')
    }

    shareKML() {
        var coords: Array<string> = [];
        for (var cg of this.route.collection_geos) {
            var coord = Common.fromMapCoord(cg.coord);
            coords.push(coord[0].toFixed(7) + ',' + coord[1].toFixed(7));
        }

        var kml = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark><name>' + this.route.title + '</name>'; /*<description>test Desc< /description>*/
        kml += '<Style id="route"><LineStyle><color>ff9a5d00</color><width>10</width></LineStyle></Style><LineString><coordinates>';
        kml += coords.join(' ');
        kml += '</coordinates></LineString></Placemark></Document></kml>';

        var filename = encodeURIComponent('HistoriskAtlas.dk-' + this.route.title.replace(new RegExp(' ', 'g'), '-') + '.kml');
        var blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveBlob(blob, filename);
        else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.setAttribute('download', filename);
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
            window.URL.revokeObjectURL(elem.href);
        }
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

    toggleCyclicTap(e: Event) {
        this.set('route.cyclic', !this.route.cyclic);
        e.cancelBubble = true;
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

    getAutosuggestSchema(collection_geos: Array<HaCollectionGeo>): string {
        var existingIds: Array<number> = [];
        for (var cg of collection_geos)
            existingIds.push(cg.geo.id)
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
        var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: this.route.collection_geos[this.route.collection_geos.length - 1].ordering + HaCollectionGeo.orderingGap });
        this.push('route.collection_geos', collection_geo);
        this.route.saveNewCollectionGeo(collection_geo);
        //if (this.route.geos.length > 1) {
        //    var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
        //    App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, (distance) => {
        //        this.route.distance += distance;
        //    });
        //}
    }

    @listen('geoAutosuggestRemoved')
    geoRemoved(e: any) {
        var collection_geo = e.detail; //App.haGeos.geos[e.detail.id];
        this.route.removeCollectionGeo(collection_geo);
        this.splice('route.collection_geos', this.route.collection_geos.indexOf(collection_geo), 1);
        //this.updateRouteLayer();
    }

    @listen('update')  //geoSortableList.update....
    geoSortableListUpdate(e: any) {
        if (e.detail) {
            this.route.updateOrdering(e.detail.newIndex);
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

    //public formatType(type: number): string {
    //    return HaCollection.types[type];
    //}
    public iconType(type: number): string {
        return HaCollection.iconTypes[type];
    }

    //public types(): Array<string> {
    //    return HaCollection.types;
    //}
    public iconTypes(): Array<string> {
        return HaCollection.iconTypes;
    }

    typeTap(e: any) {
        this.set('route.type', HaCollection.iconTypes.indexOf(e.model.item));
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