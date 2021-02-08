@component("ha-collections")
class HaCollections extends Tags implements polymer.Element {

    @property({ type: Array, notify: true, value: [] })
    public collections: Array<HaCollection>;

    @property({ type: Array })
    public geos: Array<HaGeo>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Boolean })
    public userCreators: boolean;

    @property({ type: Boolean })
    public profCreators: boolean;

    @property({
        type: Array, notify: true, value: [
            { name: 'I bil', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 0, ignoreCreators: false },
            { name: 'På cykel', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 1, ignoreCreators: false },
            { name: 'Til fods', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 2, ignoreCreators: false },
            { name: 'spacer', shown: false, selected: false, filter: null, ignoreCreators: false },
            { name: 'Under 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance < 10000, ignoreCreators: false },
            { name: 'Over 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance >= 10000, ignoreCreators: false },
            { name: 'spacer', shown: false, selected: false, filter: null, ignoreCreators: false }
        ] })
    public topLevels: Array<ICollectionTopLevel>;

    @property({ type: String, notify: true, value: '' })
    public selectedCollectionNames: string;

    private waitingForCallbackCount: number;
    //private drawRouteRequestCount: number = 0;

    public allCollectionsFetched: boolean = false;
    //private static awitingGeos: Array<() => any> = [];
    private static collectionGeosAPISchema = '{collection_geos:[id,geoid,ordering,showonmap,calcroute,contentid,longitude,latitude]}'; //Remeber to apply changes to default.aspx.cs also

    private static routeDrawingDisabled: boolean = false;

    //ready() {
    //    if (App.passed.collection) {
    //        //HaCollections.awitingGeos.push(() => {
    //        var collection = this.getCollectionFromData(App.passed.collection, true); //this.allCollectionIDs, 
    //        this.push('collections', collection);
    //        this.select(collection);
    //        //});
    //    }
    //}

    public addPassedColection(data: any) {
        var collection = this.getCollectionFromData(data, true);
        this.push('collections', collection);
        this.select(collection, null, false, false);
    }

    public getPublishedCollections() {
        if (this.allCollectionsFetched)
            return;

        //if (this.awaitGeos(() => this.getPublishedCollections()))
        //    return;

        this.allCollectionsFetched = true;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,cyclic,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ']}', online: true }); //Remeber to apply changes to default.aspx.cs also

        //if (!App.haUsers.user.isDefault)
        //    this.getCollectionsFromUser();
    }

    public getCollectionsFromUser() {
        //if (this.awaitGeos(() => this.getCollectionsFromUser()))
        //    return;

        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,cyclic,distance,type,{userid:' + App.haUsers.user.id + '},' + HaCollections.collectionGeosAPISchema + ']}', online: false });
    }

    public getCollectionsByTagId(tagId: number, drawOnMap: boolean = false) {
        //if (this.awaitGeos(() => this.getCollectionsByTagId(tagId)))
        //    return;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:{fields:[collectionid,title,ugc,cyclic,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ',{content:[{tag_contents:[{collapse:id}]}]}],filters:[{content:[{tag_contents:[{id:' + tagId + '}]}]}]}}', online: true }, drawOnMap);
    }

    //private awaitGeos(callback: () => any): boolean {
    //    if (App.haGeos.geos.length == 0) {
    //        HaCollections.awitingGeos.push(callback);
    //        return true;
    //    }
    //    return false
    //}

    public get allCollectionIDs(): Array<number> {
        var result = [];
        for (var collection of this.collections)
            result.push(collection.id)
        return result;
    }

    private getCollections(sendData: any, drawOnMap: boolean = false) {
        Services.get('collection', sendData, (result) => {
            var collections: Array<HaCollection> = this.collections.slice();
            var allCollectionIDs = this.allCollectionIDs;
            var tempFeatures: ol.Feature[];
            var tempSelected: boolean;
            for (var data of result.data) {
                if (allCollectionIDs.indexOf(data.collectionid) > -1) {
                    for (var collection of this.collections)
                        if (collection.id == data.collectionid) {
                            tempFeatures = collection.features;
                            tempSelected = collection.selected;
                            collections.splice(collections.indexOf(collection), 1);
                            //this.splice('collections', this.collections.indexOf(collection), 1);
                            break;
                        }
                }
                var collection = this.getCollectionFromData(data, sendData.online) //allCollectionIDs, 
                if (collection) {
                    if (tempFeatures) {
                        collection.features = tempFeatures;
                        tempFeatures = null;
                    }
                    if (tempSelected) {
                        collection.selected = tempSelected;
                        tempSelected = null;
                    }

                    collections.push(collection);
                    //this.push('collections', collection);

                    if (drawOnMap)
                        this.drawRoute(collection);
                }
            }
            var curCollection = this.collection;

            this.set('collections', collections);
            //this.notifyPath('collections', this.collections);

            if (curCollection)
                this.select(curCollection);
        })
    }

    private getCollectionFromData(data: any, online: boolean): HaCollection { //allCollectionIDs: Array<number>, 
        //if (allCollectionIDs.indexOf(data.collectionid) > -1) {
        //    return null;
        //}

        data.online = online;

        var collection = new HaCollection(data);
        if (data.content)
            for (var tagId of data.content.tag_contents)
                collection.tags.push(App.haTags.byId[tagId]);

        return collection;
    }

    @observe('userCreators')
    userCreatorsChanged() {
        if (this.userCreators || !this.collections)
            return;

        for (var i = 0; i < this.collections.length; i++)
            if (this.collections[i].ugc)
                this.set('collections.' + i + '.selected', false);
    }
    @observe('profCreators')
    profCreatorsChanged() {
        if (this.profCreators || !this.collections)
            return;

        for (var i = 0; i < this.collections.length; i++)
            if (!this.collections[i].ugc)
                this.set('collections.' + i + '.selected', false);
    }

    @observe('collections.*')
    collectionsChanged(changeRecord: any) {
        var path: Array<string> = changeRecord.path.split('.');

        if (path.length == 3) {
            if (path[2] == 'selected') {

                if (!CollectionList.ignoreCollectionChanges)
                    this.updateSelectedCollectionNames()

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

                if (changeRecord.value) {
                    this.drawRoute(collection);
                    //this.drawRoute(collection, null, false, (collection == this.collection) ? () => {
                    //    collection.showOnMap(); //TODO: will zoom to map every time the selected collection becomes active..................... good idea?........................................
                    //} : null);
                } else
                    this.eraseRoute(collection);
            }
        }
    }

    public select(collection: HaCollection, addGeo?: HaGeo, mapClick: boolean = false, anim: boolean = true) {
        if (!App.haUsers.user.isWriter)
            App.map.iconLayer.visible = false;

        App.map.showRouteLayer();

        if (addGeo) {
            var ordering = collection.collection_geos.length == 0 ? HaCollectionGeo.orderingGap : collection.collection_geos[collection.collection_geos.length - 1].ordering + HaCollectionGeo.orderingGap;
            var collection_geo = new HaCollectionGeo({ geoid: addGeo.id, ordering: ordering });
            this.push('collection.collection_geos', collection_geo);
            collection.saveNewCollectionGeo(collection_geo);
        }

        this.$.selector.select(collection);

        if (!collection.selected) {
            HaCollections.routeDrawingDisabled = true;
            this.set('collection.selected', true);
            HaCollections.routeDrawingDisabled = false;
        }
        this.drawRoute(collection, null, false, () => {
            if (!mapClick)
                collection.showOnMap(anim);
        });


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

        Services.get('content', { count: 'all', schema: ContentViewer.contentSchema, collection_geos: '[{collection:[{collectionid:' + collection.id + '}]}]' }, (result) => {
            for (var data of result.data)
                for (var cg of collection.collection_geos)
                    if (cg.contentID == data.id)
                        this.set('collection.collection_geos.' + this.collection.collection_geos.indexOf(cg) + '.content', new HaContent(data));
        })
    }

    public deselect(collection: HaCollection) {
        this.$.selector.deselect(collection);
        App.map.iconLayer.visible = true;
    }

    public newRoute(geo?: HaGeo) {
        Common.dom.append(DialogText.create('Angiv titel på turforslaget', (title) => this.newCollection(title, geo)));
    }

    private newCollection(title: string, geo?: HaGeo)/*: HaCollection*/ {
        var collection = new HaCollection({ title: title, userid: App.haUsers.user.id, ugc: !App.haUsers.user.isPro, online: false, distance: 0, type: 0, cyclic: false });
        collection.save(() => {
            this.push('collections', collection);

            var content = new HaContent({ contenttypeid: 0, ordering: 0, headline: '', texts: [{ headline: '', text1: '', ordering: 0, type: 0 }] });
            //this.set('collection.content', content);
            collection.content = content;
            this.select(collection);

            content.insert(() => {
                Services.update('collection', { collectionid: this.collection.id, contentid: content.id });
                if (App.haUsers.user.isPro)
                    this.addTag(App.haUsers.user.currentInstitution.tag, true, true);
            });


            if (geo) {
                var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: HaCollectionGeo.orderingGap });
                this.push('collection.collection_geos', collection_geo);
                collection.saveNewCollectionGeo(collection_geo);
            }

            //var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
            //this.set('collection.content', content);
            //content.insert(() => {
            //    Services.update('collection', { collectionid: this.collection.id, contentid: content.id });
            //    if (App.haUsers.user.isPro)
            //        this.addTag(App.haUsers.user.currentInstitution.tag, true, true);
            //});
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

        //this.drawRoute(newVal);

        this.initTags('collection', /*this.collection.id,*/ 'content');

        for (var cg of newVal.collection_geos) {
            if (App.haGeos.geos[cg.geo.id])
                cg.geo = App.haGeos.geos[cg.geo.id];
            cg.geo.isPartOfCurrentCollection = true;
        }

        //App.map.showRouteLayer();

        if (!this.collection.content) {

            Services.get('collection', { schema: '{collection:[{user:[id,firstname,lastname]},' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, (result) => { //,{collection_geos:[{collapse:geoid}]}
                if (!result.data)
                    return;

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
            var cgPath = path[0] + '.' + path[1] + '.' + path[2];
            var collection_geo: HaCollectionGeo = this.get(cgPath);
            if (prop == 'calcRoute') { 
                this.drawRoute();
                Services.update('collection_geo', { id: collection_geo.id, calcroute: collection_geo.calcRoute }, () => { });
            }
            if (prop == 'showOnMap') {
                this.drawRoute();
                this.updateMarkers();
                Services.update('collection_geo', { id: collection_geo.id, showonmap: collection_geo.showOnMap }, () => { });
            }
            if (prop == 'showText') {
                if (this.get(changeRecord.path)) {
                    if (!collection_geo.content) {
                        var content = new HaContent({ contenttypeid: 0, ordering: 0, headline: '', texts: [{ headline: '', text1: '', type: 0, ordering: 0 }] });
                        this.set(cgPath + '.content', content);
                        content.insert(() => {
                            Services.update('collection_geo', { id: collection_geo.id, contentid: content.id });
                            this.set(cgPath + '.contentID', content.id);
                        });
                    }
                } else {
                    $(this).append(DialogConfirm.create('delete-cg-text', 'Er du sikker på at du vil slette denne tekst?', cgPath));
                }
            }
        }

        if (path.length != 2)
            return

        if (prop == 'type' || prop == 'cyclic')
            this.drawRoute();
        if (prop == 'online')
            App.map.routeLayer.redraw();
        if ((prop == 'title' || prop == 'online' || prop == 'type' || prop == 'cyclic' || prop == 'distance') && App.haUsers.user.canEditCollection(this.collection))
            this.collection.saveProp(prop);
    }

    @listen('delete-cg-text-confirmed')
    deleteCGTextConfirmed(e) {
        var collection_geo: HaCollectionGeo = this.get(e.detail);
        Services.delete('content', { id: collection_geo.id, contentid: collection_geo.content.id }, () => {
            this.set(e.detail + '.content', null);
            this.set(e.detail + '.contentID', null);
        });

    }

    @listen('delete-cg-text-dismissed')
    deleteCGTextDismissed(e) {
        this.set(e.detail + '.showText', true);
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

        if (changeRecord.keySplices)
            for (var keySplice of changeRecord.keySplices) {
                if (keySplice.removed.length > 0 || keySplice.added.length > 0) { //&& indexSplice.index == this.collection.geos.length - 1
                    this.drawRoute(this.collection, keySplice.added.length > 0 ? indexSplice.index : null);
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

    public drawRoute(collection?: HaCollection, addedPointIndex?: number, onlyRedrawViaPoints: boolean = false, callback: () => void = null) { //drawViaPoints: boolean = true, 
        if (HaCollections.routeDrawingDisabled)
            return;

        if (!collection)
            collection = this.collection;
        
        if (!onlyRedrawViaPoints)
            App.map.routeLayer.removeFeatures(collection.features);
        else {
            var nonViaPoints: ol.Feature[] = [];
            for (var feature of collection.features)
                if ((<any>feature).locs)
                    nonViaPoints.push(feature);
            App.map.routeLayer.removeFeatures(nonViaPoints);
        }
        
        if (collection.collection_geos.length < 2) {
            this.setDistance(collection, 0);
            //this.set('collections.' + this.collections.indexOf(collection) + '.distance', 0);
            //this.nextUpdateRouteLayerRequest();
        }

        //var lastCG: HaCollectionGeo = collection.cyclic ? collection.collection_geos[collection.collection_geos.length - 1] : null;
        var lastCG: HaCollectionGeo = collection.collection_geos[collection.collection_geos.length - 1];
        var drawPath: boolean = collection.cyclic;
        var totalDistance: number = 0;
        this.waitingForCallbackCount = collection.collection_geos.length - 1;
        var canEdit: boolean = App.haUsers.user.canEditCollection(collection);

        for (var cg of collection.collection_geos) { //TODO: Reuse features on collection when present?................
            //if (lastCG) {
            var drawViaPoint = onlyRedrawViaPoints ? false : (cg.isViaPoint && collection == this.collection && (canEdit || cg.showOnMap))
            var viaPoint = App.map.routeLayer.addPath(cg.geo.icon.coord4326, lastCG.geo.icon.coord4326, collection, drawViaPoint, drawPath, lastCG.calcRoute, (feature, distance) => { //TODO: use addFeatureS instead......

                //TODO: calc extent of the whole collection: ..... console.log(feature.getGeometry().getExtent());

                collection.features.push(feature); //TODO: Could be optmized if its a LineString, by putting all adjecent linestring into a MultiLineString (but this is not present in the current OL build)

                totalDistance += Math.round(distance);
                this.waitingForCallbackCount--;
                if (this.waitingForCallbackCount == 0) {
                    this.setDistance(collection, totalDistance);
                    //this.set('collections.' + this.collections.indexOf(collection) + '.distance', totalDistance);
                    if (callback)
                        callback();
                    //this.nextUpdateRouteLayerRequest();
                }
            }, collection.collection_geos[collection.collection_geos.length - 1] == cg);

            if (viaPoint) {
                (<any>viaPoint).collection_geo = cg;
                if (addedPointIndex == collection.collection_geos.indexOf(cg))
                    App.map.curHoverFeature = viaPoint;
            }
            //}
            lastCG = cg;
            drawPath = true;
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

    private setDistance(collection: HaCollection, distance: number) {
        if (distance != collection.distance)
            this.set('collections.' + this.collections.indexOf(collection) + '.distance', distance);
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

    public updateSelectedCollectionNames() {

        var selectedNames = [];
        var realTopLevelsCount = 0;
        for (var topLevel of this.topLevels) {
            if (topLevel.selected)
                selectedNames.push(topLevel.name.toLocaleLowerCase());
            if (topLevel.name != 'spacer')
                realTopLevelsCount++;
        }

        if (selectedNames.length == realTopLevelsCount) {
            this.set('selectedCollectionNames', 'Alle');
            return;
        } 

        var containedInSelectedTopLevelNames = []
        for (var topLevel of this.topLevels)
            if (topLevel.selected && topLevel.filter)
                for (var collection of this.collections)
                    if (topLevel.filter(collection))
                        containedInSelectedTopLevelNames.push(collection.title);
        
        for (var topLevel of this.topLevels)
            if (!topLevel.selected && topLevel.filter)
                for (var collection of this.collections)
                    if (topLevel.filter(collection))
                        if (collection.selected && containedInSelectedTopLevelNames.indexOf(collection.title) == -1 && selectedNames.indexOf(collection.title) == -1)
                            selectedNames.push(collection.title);

        if (selectedNames.length == 0) {
            this.set('selectedCollectionNames', '');
            return;
        }

        if (selectedNames.length == 1) {
            this.set('selectedCollectionNames', Common.capitalize(selectedNames[0]));
            return;
        }

        if (selectedNames.length > 3) {
            this.set('selectedCollectionNames', Common.capitalize(selectedNames.slice(0, 3).join(", ") + "..."));
            return;
        }

        this.set('selectedCollectionNames', Common.capitalize(selectedNames.slice(0, selectedNames.length - 1).join(", ") + ' og ' + selectedNames[selectedNames.length - 1]));
    }

    public deselectAll() {

        if (this.collection) {
            this.$.selector.deselect(this.collection);
            App.map.iconLayer.visible = true;
        }

        CollectionList.ignoreCollectionChanges = true;

        for (var collection of this.collections)
            this.set('collections.' + this.collections.indexOf(collection) + '.selected', false);

        CollectionList.ignoreCollectionChanges = false;

        for (var list of CollectionList.collectionLists)
            list.updateTopLevelSelections();

        this.updateSelectedCollectionNames();
    }


}

HaCollections.register();