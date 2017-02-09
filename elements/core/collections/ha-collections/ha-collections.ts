@component("ha-collections")
class HaCollections extends Tags implements polymer.Element {

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    private waitingForCallbackCount: number = 0;
    //private drawRouteRequestCount: number = 0;

    public allCollectionsFetched: boolean = false;

    public getPublishedCollections() {
        if (this.allCollectionsFetched)
            return;

        //TODO: wait for geos to load?...................

        this.allCollectionsFetched = true;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,userid,{collection_geos:[geoid,ordering]}]}', online: true });

        if (!App.haUsers.user.isDefault)
            this.getCollectionsFromUser();
    }

    public getCollectionsFromUser() {
        //TODO: wait for geos to load?...................
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '},{collection_geos:[geoid,ordering]}]}', online: false });
    }

    public getCollectionsByTagId(tagId: number) {
        //TODO: wait for geos to load?...................
        //TODO: NOT WORKING?!?!..... whats wrong? SID? API bug?...........................................................................
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:{fields:[collectionid,title,ugc,distance,type,userid,{collection_geos:[geoid,ordering]}],filters:[{content:[{tag_contents:[{id:' + tagId + '}]}]}]}}', online: true });
    }


    private getCollections(sendData: any) {
        Services.get('collection', sendData, (result) => {
            var collections: Array<HaCollection> = this.collections;
            for (var data of result.data) {
                data.online = sendData.online;
                collections.push(new HaCollection(data));
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
                //App.map.showRouteLayer();
                var collection: HaCollection = this.collections[path[1].substring(1)];

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

    public select(collection: HaCollection, addGeo?: HaGeo) {
        App.map.showRouteLayer();

        this.$.selector.select(collection);
        this.set('collection.selected', true);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }

        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + collection.id + '}]}]}}' }, (result) => {
            var geos: Array<HaGeo> = [];
            for (var data of result.data)
                for (var geo of collection.geos)
                    if (geo.id == data.geoid)
                        this.set('collection.geos.' + this.collection.geos.indexOf(geo) + '.title', data.title);
            //TODO: needed?
            //for (var geo of collection.geos)
            //    geo.isPartOfCurrentCollection = true;
        })

    }

    public deselect(collection: HaCollection) {
        this.$.selector.deselect(collection);
    }

    public newRoute(geo?: HaGeo) {
        Common.dom.append(DialogText.create('Angiv titel på rute', (title) => this.newCollection(title, geo)));
    }

    private newCollection(title: string, geo?: HaGeo)/*: HaCollection*/ {
        var collection = new HaCollection({ title: title, userid: App.haUsers.user.id, ugc: !App.haUsers.user.isPro, online: false, distance: 0, type: 0 });
        collection.save(() => {
            this.push('collections', collection);
            this.select(collection);
            if (geo) {
                this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
        //return collection;
    }

    @observe('collection')
    collectionChanged(newVal: HaCollection, oldVal: HaCollection) {

        if (oldVal) {
            //App.map.routeLayer.clear();
            for (var geo of oldVal.geos)
                geo.isPartOfCurrentCollection = false;
            if (!newVal)
                App.map.routeLayer.redraw();
        }

        if (!newVal)
            return;

        App.map.routeLayer.redraw();

        this.initTags('collection', /*this.collection.id,*/ 'content');

        for (var geo of newVal.geos)
            geo.isPartOfCurrentCollection = true;

        //App.map.showRouteLayer();

        if (!this.collection.content) {

            Services.get('collection', { schema: '{collection:[' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, (result) => { //,{collection_geos:[{collapse:geoid}]}
                if (result.data[0].content) {
                    this.set('collection.content', new HaContent(result.data[0].content))
                    if (result.data[0].content.tag_contents)
                        for (var tagid of result.data[0].content.tag_contents)
                            this.addTag(App.haTags.byId[tagid], true, false);
                }
                else {
                    var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
                    this.set('collection.content', content);
                    content.insert(() => {
                        Services.update('collection', { collectionid: this.collection.id, contentid: content.id });
                    });
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
            for (var geo of this.collection.geos)
                this.notifyPath('collection.geos.' + this.collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
        }, 10);
        setTimeout(() => {
            for (var geo of this.collection.geos)
                geo.icon.updateStyle();
        }, 100);
    }

    @observe('collection.*')
    typeChanged(changeRecord: any) {
        if (!this.collection)
            return;

        var path = (<string>changeRecord.path).split('.');
        if (path.length != 2)
            return

        var prop = path[1]
        if (prop == 'type')
            this.drawRoute();
        if (prop == 'online')
            App.map.routeLayer.redraw();
        if (prop == 'title' || prop == 'online' || prop == 'type')
            this.collection.saveProp(prop);
    }

    @observe('collection.geos.splices')
    routeGeosSplices(changeRecord: ChangeRecord<HaGeo>) {
        if (!changeRecord)
            return;

        for (var indexSplice of changeRecord.indexSplices) {
            for (var geo of indexSplice.removed) {
                geo.isPartOfCurrentCollection = false;
                geo.icon.updateStyle();
            }
            for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
                this.collection.geos[i].isPartOfCurrentCollection = true;
        }

        for (var keySplice of changeRecord.keySplices) {
            if (keySplice.removed.length > 0 || keySplice.added.length > 0) {
                this.drawRoute();
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

    private drawRoute(collection?: HaCollection) {
        if (!collection)
            collection = this.collection;


        //TODO: Handling of multiple requests while waiting for callback?....................

        //if (this.waitingForCallbackCount > 0) {
        //    this.drawRouteRequestCount++;
        //    return;
        //}

        //App.map.routeLayer.clear();
        App.map.routeLayer.removeFeatures(collection.features);

        //if (!this.collection)
        //    return;


        if (collection.geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(collection) + '.distance', 0);
            //this.nextUpdateRouteLayerRequest();
        }

        var lastGeo;
        var totalDistance: number = 0;
        this.waitingForCallbackCount = collection.geos.length - 1;

        for (var geo of collection.geos) { //TODO: Reuse features on collection when present?................
            //this.updateIconStyle(geo);
            if (lastGeo) {
                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, collection, (feature, distance) => { //TODO: use addFeatureS instead......
                    collection.features.push(feature);
                    totalDistance += Math.round(distance);
                    this.waitingForCallbackCount--;
                    if (this.waitingForCallbackCount == 0) {
                        this.set('collections.' + this.collections.indexOf(collection) + '.distance', totalDistance);
                        //this.nextUpdateRouteLayerRequest();
                    }
                });
            }
            lastGeo = geo;
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

    private eraseRoute(collection: HaCollection) {
        //TODO: Handling of multiple requests while waiting for callback?....................
        App.map.routeLayer.removeFeatures(collection.features);
    }

}

HaCollections.register();