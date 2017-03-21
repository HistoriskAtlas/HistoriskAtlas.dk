@component("ha-collections")
class HaCollections extends Tags implements polymer.Element {

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    @property({ type: Array })
    public geos: Array<HaGeo>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    private waitingForCallbackCount: number = 0;
    //private drawRouteRequestCount: number = 0;

    public allCollectionsFetched: boolean = false;
    private static awitingGeos: Array<() => any> = [];
    private static collectionGeosAPISchema = '{collection_geos:[id,geoid,ordering,showonmap,calcroute,longitude,latitude]}';

    public getPublishedCollections() {
        if (this.allCollectionsFetched)
            return;

        if (this.awaitGeos(() => this.getPublishedCollections()))
            return;

        this.allCollectionsFetched = true;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ']}', online: true });

        if (!App.haUsers.user.isDefault)
            this.getCollectionsFromUser();
    }

    public getCollectionsFromUser() {
        if (this.awaitGeos(() => this.getCollectionsFromUser()))
            return;

        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '},' + HaCollections.collectionGeosAPISchema + ']}', online: false });
    }

    public getCollectionsByTagId(tagId: number) {
        if (this.awaitGeos(() => this.getCollectionsByTagId(tagId)))
            return;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:{fields:[collectionid,title,ugc,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ',{content:[{tag_contents:[{collapse:id}]}]}],filters:[{content:[{tag_contents:[{id:' + tagId + '}]}]}]}}', online: true });
    }

    private awaitGeos(callback: () => any): boolean {
        if (App.haGeos.geos.length == 0) {
            HaCollections.awitingGeos.push(callback);
            return true;
        }
        return false
    }

    @observe('geos.length')
    geosLengthChanged(changeRecord: any) {
        if (this.geos.length == 0 || HaCollections.awitingGeos.length == 0)
            return;

        while (HaCollections.awitingGeos.length > 0)
            HaCollections.awitingGeos.shift()();
    }


    private getCollections(sendData: any, options?: any) {
        Services.get('collection', sendData, (result) => {
            var collections: Array<HaCollection> = this.collections;
            for (var data of result.data) {
                data.online = sendData.online;

                var collection = new HaCollection(data);
                if (data.content)
                    for (var tagId of data.content.tag_contents)
                        collection.tags.push(App.haTags.byId[tagId]);

                collections.push(collection);
            }
            this.set('collections', collections);
            this.notifySplices('collections', [{ index: 0, removed: [], addedCount: collections.length, object: this.collections }]);
        })
    }

    @observe('collections.*')
    collectionsChanged(changeRecord: any) {
        var path: Array<string> = changeRecord.path.split('.');

        if (path.length == 3) {
            if (path[2] == 'selected') {

                //var collection: HaCollection = this.collections[path[1].substring(1)];
                var collection: HaCollection = this.get(path[0] + '.' + path[1]);

                //Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
                //    var geos: Array<HaGeo> = [];
                //    for (var data of result.data) {
                //        var geo = App.haGeos.geos[data.geoid];
                //        if (!geo)
                //            continue;
                //        geo.title = data.title;
                //        geos.push(geo);
                //    }
                //    this.set('collections.' + path[1].substring(1) + '.geos', geos);
                //    this.drawRoute(collection);
                //    for (var geo of collection.geos)
                //        geo.isPartOfCurrentCollection = true;
                //})



                if (changeRecord.value)
                    this.drawRoute(collection)
                else
                    this.eraseRoute(collection);
            }
        }
    }

    public select(collection: HaCollection, addGeo?: HaGeo, mapClick: boolean = false) {
        App.map.showRouteLayer();

        this.$.selector.select(collection);
        this.set('collection.selected', true);

        if (addGeo) {
            var ordering = collection.collection_geos.length == 0 ? HaCollectionGeo.orderingGap : collection.collection_geos[collection.collection_geos.length - 1].ordering + HaCollectionGeo.orderingGap;
            var collection_geo = new HaCollectionGeo({ geoid: addGeo.id, ordering: ordering });
            this.push('collection.collection_geos', collection_geo);
            collection.saveNewCollectionGeo(collection_geo);
        }

        if (!mapClick)
            collection.showOnMap();

        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + collection.id + '}]}]}}' }, (result) => {
            var geos: Array<HaGeo> = [];
            for (var data of result.data)
                for (var cg of collection.collection_geos)
                    if (cg.geo.id == data.geoid)
                        this.set('collection.collection_geos.' + this.collection.collection_geos.indexOf(cg) + '.geo.title', data.title);
            //TODO: needed?
            //for (var geo of collection.geos)
            //    geo.isPartOfCurrentCollection = true;
        })

    }

    public deselect(collection: HaCollection) {
        this.$.selector.deselect(collection);
    }

    public newRoute(geo?: HaGeo) {
        Common.dom.append(DialogText.create('Angiv titel på turforslaget', (title) => this.newCollection(title, geo)));
    }

    private newCollection(title: string, geo?: HaGeo)/*: HaCollection*/ {
        var collection = new HaCollection({ title: title, userid: App.haUsers.user.id, ugc: !App.haUsers.user.isPro, online: false, distance: 0, type: 0 });
        collection.save(() => {
            this.push('collections', collection);
            this.select(collection);
            if (geo) {
                var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: HaCollectionGeo.orderingGap });
                this.push('collection.collection_geos', collection_geo);
                collection.saveNewCollectionGeo(collection_geo);
            }

            var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
            this.set('collection.content', content);
            content.insert(() => {
                Services.update('collection', { collectionid: this.collection.id, contentid: content.id });
                if (App.haUsers.user.isPro)
                    this.addTag(App.haUsers.user.currentInstitution.tag, true, true);
            });

        });
        //return collection;
    }

    @observe('collection')
    collectionChanged(newVal: HaCollection, oldVal: HaCollection) {

        if (oldVal) {
            //App.map.routeLayer.clear();
            for (var cg of oldVal.collection_geos)
                cg.geo.isPartOfCurrentCollection = false;
            var viaPoints: Array<ol.Feature> = [];
            for (var feature of oldVal.features)
                if ((<any>feature).loc)
                    viaPoints.push(feature)
            App.map.routeLayer.removeFeatures(viaPoints);
            if (!newVal)
                App.map.routeLayer.redraw();
        }

        if (!newVal)
            return;

        //App.map.routeLayer.redraw();
        //this.eraseRoute(newVal);
        this.drawRoute(newVal, App.haUsers.user.canEditCollection(newVal));

        this.initTags('collection', /*this.collection.id,*/ 'content');

        for (var cg of newVal.collection_geos)
            cg.geo.isPartOfCurrentCollection = true;

        //App.map.showRouteLayer();

        if (!this.collection.content) {

            Services.get('collection', { schema: '{collection:[{user:[id,firstname,lastname]},' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, (result) => { //,{collection_geos:[{collapse:geoid}]}

                if (result.data[0].user.id != App.haUsers.user.id)
                    this.set('collection.user', new HAUser(result.data[0].user));

                if (result.data[0].content) {
                    this.set('collection.content', new HaContent(result.data[0].content))
                    if (result.data[0].content.tag_contents)
                        for (var tagid of result.data[0].content.tag_contents)
                            this.addTag(App.haTags.byId[tagid], true, false);
                }
                else {
                    //var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
                    //this.set('collection.content', content);
                    //content.insert(() => {
                    //    Services.update('collection', { collectionid: this.collection.id, contentid: content.id });
                    //});
                }
            })
        }




        this.updateMarkers();

        //if (this.collection.geos.length > 0 || !this.collection.id) {
        //    this.drawRoute();
        //    return;
        //}

        //Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this.collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
        //    var geos: Array<HaGeo> = [];
        //    for (var data of result.data) {
        //        var geo = App.haGeos.geos[data.geoid];
        //        if (!geo)
        //            continue;
        //        geo.title = data.title;
        //        geos.push(geo);
        //        //this.push('collection.geos', geo);
        //    }
        //    this.set('collection.geos', geos);
        //    this.drawRoute();
        //    for (var geo of this.collection.geos)
        //        geo.isPartOfCurrentCollection = true;
        //})
    }

    private updateMarkers() {
        setTimeout(() => {
            for (var cg of this.collection.collection_geos)
                this.notifyPath('collection.collection_geos.' + this.collection.collection_geos.indexOf(cg) + '.geo.icon.marker', cg.geo.icon.marker);
        }, 10);
        setTimeout(() => {
            for (var cg of this.collection.collection_geos)
                cg.geo.icon.updateStyle();
        }, 100);
    }

    @observe('collection.*')
    collectionPropChanged(changeRecord: any) {
        if (!this.collection)
            return;

        var path = (<string>changeRecord.path).split('.');

        var prop = path[path.length - 1];

        if (path.length == 4 && path[1] == 'collection_geos') {
            var collection_geo: HaCollectionGeo = this.get(path[0] + '.' + path[1] + '.' + path[2]);
            if (prop == 'calcRoute') { 
                this.drawRoute();
                Services.update('collection_geo', { id: collection_geo.id, calcroute: collection_geo.calcRoute }, () => { });
            }
            if (prop == 'showOnMap') {
                this.drawRoute();
                this.updateMarkers();
                Services.update('collection_geo', { id: collection_geo.id, showonmap: collection_geo.showOnMap }, () => { });
            }
        }

        if (path.length != 2)
            return

        if (prop == 'type')
            this.drawRoute();
        if (prop == 'online')
            App.map.routeLayer.redraw();
        if (prop == 'title' || prop == 'online' || prop == 'type')
            this.collection.saveProp(prop);
    }

    @observe('collection.collection_geos.splices')
    routeGeosSplices(changeRecord: ChangeRecord<HaCollectionGeo>) {
        if (!changeRecord)
            return;

        for (var indexSplice of changeRecord.indexSplices) {
            for (var cg of indexSplice.removed) {
                cg.geo.isPartOfCurrentCollection = false;
                if (!cg.isViaPoint)
                    cg.geo.icon.updateStyle();
            }
            for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
                this.collection.collection_geos[i].geo.isPartOfCurrentCollection = true;
        }

        for (var keySplice of changeRecord.keySplices) {
            if (keySplice.removed.length > 0 || keySplice.added.length > 0) { //&& indexSplice.index == this.collection.geos.length - 1
                this.drawRoute(this.collection, true, keySplice.added.length > 0 ? indexSplice.index : null);
                this.updateMarkers();
            }

            //if (keySplice.added[0] == this.collection.geos[] {
            //    //for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++) {
            //    var geo = this.collection.geos[indexSplice.index];
            //    //this.updateIconStyle(geo;)
            //    if (this.collection.geos.length > 1) {
            //        var lastGeo: HaGeo = this.collection.geos[indexSplice.index - 1];
            //        App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, this.collection.type, (distance) => {
            //            this.set('collection.distance', this.collection.distance + Math.round(distance));
            //        });
            //    }
            //    //}
            //} else
            //    this.updateRouteLayer();


        }



        //for (var indexSplice of changeRecord.indexSplices) {
        //    for (var geo of indexSplice.removed)
        //        this.updateIconStyle(geo, true);
        //    if (indexSplice.removed.length > 0)
        //        this.updateRouteLayer();
        //    if (indexSplice.addedCount > 0) {
        //        for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
        //            this.updateIconStyle(indexSplice. this.collection.geos[i]);

        //        if (indexSplice.index == this.collection.geos.length - 1) {
        //            //for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++) {
        //            var geo = this.collection.geos[indexSplice.index];
        //            //this.updateIconStyle(geo;)
        //            if (this.collection.geos.length > 1) {
        //                var lastGeo: HaGeo = this.collection.geos[indexSplice.index - 1];
        //                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, this.collection.type, (distance) => {
        //                    this.set('collection.distance', this.collection.distance + Math.round(distance));
        //                });
        //            }
        //            //}
        //        } else
        //            this.updateRouteLayer();
        //    //this.route.saveNewGeo(this.route.geos[i]);
        //    }
            
                
        //}
    }

    public drawRoute(collection?: HaCollection, drawViaPoints: boolean = true, addedPointIndex?: number) {
        if (!collection)
            collection = this.collection;


        //TODO: Handling of multiple requests while waiting for callback?....................

        //if (this.waitingForCallbackCount > 0) {
        //    this.drawRouteRequestCount++;
        //    return;
        //}

        //App.map.routeLayer.clear();
        if (drawViaPoints)
            App.map.routeLayer.removeFeatures(collection.features);
        else {
            var nonViaPoints: ol.Feature[] = [];
            for (var feature of collection.features)
                if ((<any>feature).locs)
                    nonViaPoints.push(feature);
            App.map.routeLayer.removeFeatures(nonViaPoints);
        }

        //if (!this.collection)
        //    return;


        if (collection.collection_geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(collection) + '.distance', 0);
            //this.nextUpdateRouteLayerRequest();
        }

        var lastCG: HaCollectionGeo;
        var totalDistance: number = 0;
        this.waitingForCallbackCount = collection.collection_geos.length - 1;
        var canEdit: boolean = App.haUsers.user.canEditCollection(collection);

        for (var cg of collection.collection_geos) { //TODO: Reuse features on collection when present?................
            //this.updateIconStyle(geo);
            if (lastCG) {
                var viaPoint = App.map.routeLayer.addPath(cg.geo.icon.coord4326, lastCG.geo.icon.coord4326, collection, drawViaPoints && cg.isViaPoint && (canEdit || cg.showOnMap), lastCG.calcRoute, (feature, distance) => { //TODO: use addFeatureS instead......
                    collection.features.push(feature);
                    totalDistance += Math.round(distance);
                    this.waitingForCallbackCount--;
                    if (this.waitingForCallbackCount == 0) {
                        this.set('collections.' + this.collections.indexOf(collection) + '.distance', totalDistance);
                        //this.nextUpdateRouteLayerRequest();
                    }
                });

                if (viaPoint) {
                    (<any>viaPoint).collection_geo = cg;
                    if (addedPointIndex == collection.collection_geos.indexOf(cg))
                        App.map.curHoverFeature = viaPoint;
                }
            }
            lastCG = cg;
        }


        //TODO: NOT ALWAYS NEEDED!..................................................... only when showing also...........
        //setTimeout(() => {
        //    for (var geo of collection.geos)
        //        this.notifyPath('collection.geos.' + collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
        //}, 10);
        //setTimeout(() => {
        //    for (var geo of collection.geos)
        //        geo.icon.updateStyle();
        //}, 100);
    }

    //public updateIconStyle(geo: HaGeo, mapOnly: boolean = false) {
    //    geo.icon.updateStyle();
    //    if (!mapOnly)
    //        this.notifyPath('collection.geos.' + this.collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
    //}

    //private nextUpdateRouteLayerRequest() {
    //    if (this.drawRouteRequestCount > 0) {
    //        this.drawRouteRequestCount--;
    //        this.drawRoute();
    //    }
    //}

    public deleteRoute(route: HaCollection) {
        route.delete();
        this.splice('collections', this.collections.indexOf(route), 1);
        this.eraseRoute(route);
    }

    private eraseRoute(collection: HaCollection) {
        //TODO: Handling of multiple requests while waiting for callback?....................
        App.map.routeLayer.removeFeatures(collection.features);
    }

}

HaCollections.register();