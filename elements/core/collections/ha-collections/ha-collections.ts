@component("ha-collections")
class HaCollections extends polymer.Base implements polymer.Element {

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
    collectionChanged() {
        if (!this.collection)
            return;

        App.map.showRouteLayer();

        if (!this.collection.content) {
            Services.get('collection', { schema: '{collection:[' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, (result) => { //,{collection_geos:[{collapse:geoid}]}
                if (result.data[0].content) 
                    this.set('collection.content', new HaContent(result.data[0].content))
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
        })
    }

    @observe('collection.*')
    typeChanged(changeRecord: any) {
        if (!this.collection)
            return;

        if (changeRecord.path == 'collection.type')
            this.updateRouteLayer();
    }

    @observe('collection.geos.splices')
    routeGeosSplices(changeRecord: ChangeRecord<HaGeo>) {
        if (!changeRecord)
            return;
        for (var indexSplice of changeRecord.indexSplices) {
            //for (var geo of indexSplice.removed)
            //    this.route.removeGeo(geo);
            if (indexSplice.removed.length > 0)
                this.updateRouteLayer();
            if (indexSplice.addedCount > 0) {
                if (indexSplice.index == this.collection.geos.length - 1) {
                    //for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++) {
                    if (this.collection.geos.length > 1) {
                        var lastGeo: HaGeo = this.collection.geos[indexSplice.index - 1];
                        App.map.routeLayer.addPath(this.collection.geos[indexSplice.index].icon.coord4326, lastGeo.icon.coord4326, this.collection.type, (distance) => {
                            this.set('collection.distance', this.collection.distance + Math.round(distance));
                        });
                    }
                    //}
                } else
                    this.updateRouteLayer();
            //this.route.saveNewGeo(this.route.geos[i]);
            }
            
                
        }
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
    }

    private nextUpdateRouteLayerRequest() {
        if (this.updateRouteLayerRequestCount > 0) {
            this.updateRouteLayerRequestCount--;
            this.updateRouteLayer();
        }
    }

}

HaCollections.register();