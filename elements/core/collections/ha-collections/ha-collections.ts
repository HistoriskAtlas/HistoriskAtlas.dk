@component("ha-collections")
class HaCollections extends Tags implements polymer.Element {

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    private waitingForCallbackCount: number = 0;
    private updateRouteLayerRequestCount: number = 0;

    public getCollectionsFromUser() {
        Services.get('collection', { count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '}]}' }, (result) => { //,{collection_geos:[{collapse:geoid}]}
            //var newCollections: Array<HaCollection> = this.collections;
            for (var data of result.data)
                this.push('collections',new HaCollection(data));
                //newCollections.push(new HaCollection(data));
            //this.set('collections', newCollections);
        })
    }

    public select(collection: HaCollection, addGeo?: HaGeo) {
        this.$.selector.select(collection);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }
    }

    public deselect(collection: HaCollection) {
        this.$.selector.deselect(collection);
    }

    public newRoute(geo?: HaGeo) {
        Common.dom.append(DialogText.create('Angiv titel på rute', (title) => this.newCollection(title, geo)));
    }

    private newCollection(title: string, geo?: HaGeo): HaCollection {
        var collection = new HaCollection({ title: title });
        this.push('collections', collection);
        this.select(collection);
        collection.save(() => {
            if (geo) {
                this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
        return collection;
    }

    @observe('collection')
    collectionChanged(newVal: HaCollection, oldVal: HaCollection) {
        if (oldVal) {
            App.map.routeLayer.clear();
            for (var geo of oldVal.geos)
                geo.isPartOfCurrentCollection = false;
        }

        if (!newVal)
            return;

        this.initTags('collection', /*this.collection.id,*/ 'content');

        for (var geo of newVal.geos)
            geo.isPartOfCurrentCollection = true;

        App.map.showRouteLayer();

        if (!this.collection.content) {
            Services.get('collection', { schema: '{collection:[' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, (result) => { //,{collection_geos:[{collapse:geoid}]}
                if (result.data[0].content) {
                    this.set('collection.content', new HaContent(result.data[0].content))
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

        if (this.collection.geos.length > 0 || !this.collection.id) {
            this.updateRouteLayer();
            return;
        }

        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this.collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
            var geos: Array<HaGeo> = [];
            for (var data of result.data) {
                var geo = App.haGeos.geos[data.geoid];
                if (!geo)
                    continue;
                geo.title = data.title;
                geos.push(geo);
                //this.push('collection.geos', geo);
            }
            this.set('collection.geos', geos);
            this.updateRouteLayer();
            for (var geo of this.collection.geos)
                geo.isPartOfCurrentCollection = true;
        })
    }

    @observe('collection.*')
    typeChanged(changeRecord: any) {
        if (!this.collection)
            return;

        if (changeRecord.path == 'collection.type')
            this.updateRouteLayer();

        if (changeRecord.path == 'collection.title')
            this.collection.saveTitle();
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
            if (keySplice.removed.length > 0 || keySplice.added.length > 0)
                this.updateRouteLayer();

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

    private updateRouteLayer() {
        if (this.waitingForCallbackCount > 0) {
            this.updateRouteLayerRequestCount++;
            return;
        }

        App.map.routeLayer.clear();
        if (!this.collection)
            return;

        if (this.collection.geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(this.collection) + '.distance', 0);
            this.nextUpdateRouteLayerRequest();
        }

        var lastGeo;
        var totalDistance: number = 0;
        this.waitingForCallbackCount = this.collection.geos.length - 1;
        for (var geo of this.collection.geos) {
            //this.updateIconStyle(geo);
            if (lastGeo) {
                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, this.collection.type, (distance) => {
                    totalDistance += Math.round(distance);
                    this.waitingForCallbackCount--;
                    if (this.waitingForCallbackCount == 0) {
                        this.set('collections.' + this.collections.indexOf(this.collection) + '.distance', totalDistance);
                        this.nextUpdateRouteLayerRequest();
                    }
                });
            }
            lastGeo = geo;
        }

        setTimeout(() => {
            for (var geo of this.collection.geos)
                this.notifyPath('collection.geos.' + this.collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
        }, 10);
        setTimeout(() => {
            for (var geo of this.collection.geos)
                geo.icon.updateStyle();
        }, 100);
    }

    //public updateIconStyle(geo: HaGeo, mapOnly: boolean = false) {
    //    geo.icon.updateStyle();
    //    if (!mapOnly)
    //        this.notifyPath('collection.geos.' + this.collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
    //}

    private nextUpdateRouteLayerRequest() {
        if (this.updateRouteLayerRequestCount > 0) {
            this.updateRouteLayerRequestCount--;
            this.updateRouteLayer();
        }
    }

}

HaCollections.register();