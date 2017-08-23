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

    private dialogTour: DialogTour;
    private curTourStep: number;

    @observe('editing')
    editingChanged() {
        if (this.editing) { //!LocalStorage.get('firstRouteTourDone') && 
            this.spawnDialogTour('introContentViewer', 0, 'Du har netop oprettet et turforslag!', 'Du kan altid finde hjælp i denne menu. Skal vi hjælpe dig med de næste skridt nu?', null, 43, -15, null, true, false);
            this.curTourStep = 1;
        } else
            this.curTourStep = 0;
    }

    helpTap() {
        this.curTourStep = 1;
        this.help();
    }

    //@listen('contentChanged')
    @listen('next')
    help() {
        if (!this.curTourStep)
            return;

        if (this.curTourStep == 5 && this.route.collection_geos.length == 0)
            return;

        if (this.curTourStep == 6 && this.route.collection_geos.length > 1)
            this.curTourStep++;

        if (this.curTourStep == 7 && this.route.collection_geos.length < 2)
            return;

        this.curTourStep++;

        if (this.dialogTour)
            this.dialogTour.remove();

        switch (this.curTourStep) {
            case 2: this.spawnDialogTour('introContentViewer', -10, 'Giv dit turforslag en kort beskrivelse', 'Klik her og skriv en kort tekst der beskriver og introducerer dit turforslag. Klik på NÆSTE når du er færdig.', 6, null, -15, null); break;
            case 3: this.spawnDialogTour('byAndInfoLine', -20, 'Vælg typen af dit turforslag', 'Klik på pilen og vælg om dit turforslag er bedst at opleve i bil, på cykel eller til fods. Klik på NÆSTE når du er færdig.', null, 56, -15, null); break;
            case 4: this.spawnDialogTour('subjects', -225, 'Tilføj emner og perioder', 'Klik på plus\'et for at tilføje et emne eller en periode som dit turforslag omhandler. Tilføj gerne flere emner og perioder. Klik på NÆSTE når du er færdig.', 16, null, null, -15, false, false); break;
            case 5: this.spawnDialogTour('geoAutosuggest', 10, 'Tilføj fortællinger til dit turforslag', 'Klik på plus-knappen for at søge efter, og tilføje, fortællinger til turforslaget. Du kan også tilføje fortællinger ved at åbne dem og vælge "Tilføj til turforslag" i menuen.' + (this.route.collection_geos.length == 0 ? ' Guiden fortsætter, når du har gjort dette.' : ' Klik på NÆSTE når du er færdig.'), null, 6, -15, null, this.route.collection_geos.length == 0); break;
            case 6: this.spawnDialogTour('geoAutosuggest', -40, 'Fold fortællingen ud ved at klikke på pilen', 'Herunder kan du vælge om ruten mellem denne og den næste fortælling skal beregnes som den hutigste vej, eller om det blot skal være en fugleflugtslinie. Slå også "Tekst" til, hvis du ønsker at give fortællingen en beskrivelse der er specifik for dette turforslag. Klik på NÆSTE når du er færdig.', 6, null, -15, null); break;
            case 7: this.spawnDialogTour('geoAutosuggest', 10, 'Tilføj mere end én fortælling', 'Et turforslag skal indeholde mere end én fortælling. Tilføj en eller flere fortællinger. Guiden fortsætter, når du har gjort dette.', null, 6, -15, null, true); break;
            case 8: this.spawnDialogTour('geoAutosuggest', -40, 'Via-punkter', 'Hvis ruten ikke helt følger den vej du ønsker, kan du indsætte via-punkter ved at trække i selve ruten på kortet. Denne guide er nu slut. Start den evt. igen ved at vælge "Hjælp" i menuen øverst. Du kan også finde en vejledning i menuen under "Brug for hjælp?"', -15, null, 6, null, true); break;
            case 9: this.curTourStep = 0; break;
        }

    }

    @observe('route.collection_geos.length')
    cgLengthChanged() {
        if (this.curTourStep == 5 || this.curTourStep == 7)
            this.help();
    }

    private spawnDialogTour(insertAt: string, top: number, title: string, text: string, arrowLeft: number, arrowRight: number, arrowTop: number, arrowBottom: number, buttonOK: boolean = false, insertAfter: boolean = true) {
        this.dialogTour = <DialogTour>DialogTour.create(title, text, -40, null, top, null, arrowLeft, arrowRight, arrowTop, arrowBottom, buttonOK, 'firstRouteTourDone')
        if (insertAfter)
            $(this.$$('#' + insertAt)).after(this.dialogTour);
        else
            $(this.$$('#' + insertAt)).before(this.dialogTour);

        this.dialogTour.setCSS('position', 'relative');
        this.dialogTour.width = 366;
    }

    @listen('canceltour')
    cancelTour() {
        this.curTourStep = 0;
    }


    @listen('windowbasic.closed') 
    windowBasicClosed() {
        if (this.route) {
            //this.route.saveProp('distance');
            App.haCollections.deselect(this.route);
        }
        //App.map.routeLayer.clear();
    }

    shareGoogleMaps() {
        var coords: Array<string> = [];
        var via: Array<number> = [];
        for (var cg of this.route.collection_geos) {
            var coord = Common.fromMapCoord(cg.coord);
            if (!cg.isViaPoint || cg.showOnMap)
                //via.push(this.route.collection_geos.indexOf(cg) + 1);
            //else
                coords.push(coord[1].toFixed(7) + ',' + coord[0].toFixed(7));}
        if (this.route.cyclic)
            coords.push(coords[0]);

        var startCoord = coords.shift();

        window.open('https://www.google.dk/maps/dir/?saddr=' + startCoord + '&daddr=' + coords.join('+to:') + (via.length > 0 ? '&via=' + via.join(',') : '') + '&dirflg=' + HaCollection.googleMapsTypes[this.route.type], '_blank')
    }

    shareKML() {
        var coords: Array<string> = [];
        for (var cg of this.route.collection_geos) {
            var coord = Common.fromMapCoord(cg.coord);
            coords.push(coord[0].toFixed(7) + ',' + coord[1].toFixed(7));
        }
        if (this.route.cyclic)
            coords.push(coords[0]);

        var kml = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark><name>' + this.route.title + '</name>'; /*<description>test Desc< /description>*/
        kml += '<Style id="route"><LineStyle><color>ff9a5d00</color><width>10</width></LineStyle></Style><LineString><coordinates>';
        kml += coords.join(' ');
        kml += '</coordinates></LineString></Placemark></Document></kml>';

        var filename = encodeURIComponent('HistoriskAtlas.dk-' + this.route.title.replace(new RegExp(' ', 'g'), '-') + '.kml');
        var blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        Common.saveBlob(blob, filename);
    }

    shareImage() {
        this.route.showOnMap(false, true);
        setTimeout(() => App.map.saveAsPng(this.route.title + " - " + this.route.link, this.route.title + " - HistoriskAtlas.dk.png"), 1);
    }

    sharePDF() {
        this.route.showOnMap(false, true);
        setTimeout(() => App.map.getAsBase64Png((base64png) => {
            Common.savePDF(this.route.link + '.pdf', this.route.title + " - HistoriskAtlas.dk.pdf", 'POST', base64png);
        }, this.route.title + " - " + this.route.link), 1);
    }

    shareLink() {
        this.$.shareLinkDialog.open();
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
        var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: (this.route.collection_geos.length > 0 ? this.route.collection_geos[this.route.collection_geos.length - 1].ordering : 0) + HaCollectionGeo.orderingGap });
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