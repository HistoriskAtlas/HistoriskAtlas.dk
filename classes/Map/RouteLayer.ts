class RouteLayer extends ol.layer.Vector {
    private source: ol.source.Vector;
    private cache: any;
    private oldDragCoordinate: ol.Coordinate;
    private viaPointDragDirty: boolean;
    private waitingRouteProxyCalls: Array<RouteProxyCall>

    constructor() {
        var source = new ol.source.Vector();

        super({
            source: source,
            style: RouteLayer.styleFunction,
            updateWhileInteracting: true
            //style: new ol.style.Style({
            //    stroke: new ol.style.Stroke({
            //        //color: [0, 93, 154, 1],
            //        color: [153, 0, 0, 1],
            //        width: 5
            //    })
            //})
        })

        this.waitingRouteProxyCalls = [];
        this.cache = {};
        this.source = source;
    }

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate, collection: HaCollection, drawViaPoint: boolean, drawPath: boolean, calcRoute: boolean, callback: (feature: ol.Feature, distance: number) => void, flush: boolean): ol.Feature {

        var viaPoint;
        if (drawViaPoint) {
            viaPoint = new ol.Feature({
                geometry: new ol.geom.Point(Common.toMapCoord(loc1)),
                //style: new ol.style.Style({
                //    image: new ol.style.Circle({
                //        radius: 20,
                //        fill: new ol.style.Fill({
                //            color: [153, 0, 0, 1]
                //        })
                //    })
                //})
            });
            (<any>viaPoint).collection = collection;
            (<any>viaPoint).loc = loc1;
            this.source.addFeature(viaPoint);
            collection.features.push(viaPoint);
        }

        if (!drawPath) {
            if (flush)
                this.flush();
            return viaPoint;
        }

        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't' + collection.type + 'c' + calcRoute).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            var feature: ol.Feature = this.cache[cacheIndex];
            callback(feature, (<any>feature).distance);
            this.source.addFeature(feature);
            if (flush)
                this.flush();
            return viaPoint;
        }

        if (!calcRoute) {
            var geom = new (<any>ol.geom.LineString)([Common.toMapCoord(loc1), Common.toMapCoord(loc2)]);
            var feature = new ol.Feature({
                geometry: geom
            });

            this.addFeature(feature, Common.sphericalDistance(loc1, loc2), collection, loc1, loc2, cacheIndex, callback);
            if (flush)
                this.flush();
            return viaPoint;
        }

        this.waitingRouteProxyCalls.push({ collection: collection, loc1: loc1, loc2: loc2, cacheIndex: cacheIndex, callback: callback });

        if (flush)
            this.flush();

        return viaPoint;
    }

    private flush() {
        this.getRouteFromProxy(this.waitingRouteProxyCalls);
        this.waitingRouteProxyCalls = [];
    }

    private getRouteFromProxy(waitingRouteProxyCalls: Array<RouteProxyCall>) {
        if (waitingRouteProxyCalls.length == 0)
            return;

        var locs: Array<{ loc1: ol.Coordinate, loc2: ol.Coordinate, type: number }> = [];
        for (var call of waitingRouteProxyCalls)
            locs.push({ loc1: call.loc1, loc2: call.loc2, type: call.collection.type });

        $.post("proxy/route.json", JSON.stringify(locs), (data) => {
        //$.getJSON("proxy/route.json?type=" + collection.type + "&loc=" + loc1[1] + "," + loc1[0] + "&loc=" + loc2[1] + "," + loc2[0], (data) => {
            var i = 0;
            for (var call of waitingRouteProxyCalls) {
                //var route = new (<any>ol.format.Polyline)({
                //    factor: 1e5,
                //    geometryLayout: 'xy'
                //}).readGeometry(data.geometry, {
                //    dataProjection: 'EPSG:4326',
                //    featureProjection: 'EPSG:3857'
                //});

                var coords = FlexiblePolyline.decode(data[i].geometry);

                var route = new (<any>ol.geom.LineString)(coords);

                var feature = new ol.Feature({
                    geometry: route
                });

                this.addFeature(feature, data[i].distance, call.collection, call.loc1, call.loc2, call.cacheIndex, call.callback);
                //(<any>feature).distance = data.distance;
                //(<any>feature).collection = collection;
                //(<any>feature).locs = [loc1, loc2];
                //this.source.addFeature(feature);
                //this.cache[cacheIndex] = feature;
                //callback(feature, data.distance);

                if (!data[i].fromCache)
                    Analytics.calcRoute(call.collection.type)
                i++;
            }
        });

    }

    private addFeature(feature: ol.Feature, distance: number, collection: HaCollection, loc1: ol.Coordinate, loc2: ol.Coordinate, cacheIndex: string, callback: (feature: ol.Feature, distance: number) => void) {
        (<any>feature).distance = distance;
        (<any>feature).collection = collection;
        (<any>feature).locs = [loc1, loc2];
        this.source.addFeature(feature);
        this.cache[cacheIndex] = feature;
        callback(feature, distance);
    }

    private static styleFunction(feature: ol.Feature, res: number): Array<ol.style.Style> {
        var collection: HaCollection = (<any>feature).collection;
        if ((<any>feature).loc)
            return [
                new ol.style.Style({
                    image: new ol.style.Icon({
                        src: HaTags.viaPointMarker(collection.viaPointOrdering((<HaCollectionGeo>(<any>feature).collection_geo).geo))
                    })
                })
            ]
        else
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: collection == App.haCollections.collection ? [153, 0, 0, collection.online ? 1 : 0.5] : [0, 93, 154, collection.online ? 1 : 0.5],
                        width: 5,
                        //width: collection == App.haCollections.collection ? 8 : 5
                        lineDash: collection.isWalk ? [0, 10] : null
                    })
                    //, image: new ol.style.Circle({
                    //    radius: 10,
                    //    fill: new ol.style.Fill({
                    //        color: 'white'
                    //    }),
                    //    stroke: new ol.style.Stroke({
                    //        color: [153, 0, 0, 1],
                    //        width: 3
                    //    })
                    //})
                })
            ]
    }

    public removeFeatures(features: Array<ol.Feature>) {
        if (features.length == 0)
            return;

        var existingFeatures = (<any>this.source).getFeatures()

        var newFeatures: Array<ol.Feature> = [];
        for (var feature of existingFeatures)
            if (features.indexOf(feature) == -1)
                newFeatures.push(feature)

        this.source.clear();
        this.source.addFeatures(newFeatures);                
    }

    public redraw() {
        //TODO: implement using changed() instead? (when new ol is compiled)
        var existingFeatures = (<any>this.source).getFeatures()
        this.source.clear();
        this.source.addFeatures(existingFeatures)
    }


    //public clear() {
    //    this.source.clear();
    //}

    public moveEvent(event: ol.MapBrowserEvent) {
        this.oldDragCoordinate = null;
    }


    public dragEvent(event: ol.MapBrowserEvent, collection: HaCollection, feature: ol.Feature) { //: ol.Feature
        if (!(collection == App.haCollections.collection))
            return;

        if (!App.haUsers.user.canEditCollection(collection))
            return;

        //var viaPoint: ol.Feature;
        var first = false;
        if (!this.oldDragCoordinate) {
            first = true;
            this.oldDragCoordinate = event.coordinate
            //return;
        }

        if ((<any>feature).locs && first) {

            if (collection.viaPointCount == 29) {
                App.toast.show('Der kan max være 29 via-punkter (A-Å) pr. turforslag.');
                return;
            }

            var locs: Array<ol.Coordinate> = (<any>feature).locs;
            var cgs: Array<HaCollectionGeo> = [];
            for (var cg of collection.collection_geos) {
                for (var i = 0; i < 2; i++)
                    if (cg.geo.icon.coord4326[0] == locs[i][0] && cg.geo.icon.coord4326[1] == locs[i][1])
                        cgs[i] = cg;
            }

            var index0 = collection.collection_geos.indexOf(cgs[0]);
            var index1 = collection.collection_geos.indexOf(cgs[1]);

            var cyclicLeg = index0 < index1;

            var index = cyclicLeg ? collection.collection_geos.length - 1 : Math.min(index0, index1);

            this.removeFeatures([feature]);
            collection.features.splice(collection.features.indexOf(feature), 1);


            var coord = Common.fromMapCoord(event.coordinate);
            //var geo = new HaGeo({ id: 0, lng: coord[0], lat: coord[1] }, false, false)
            //geo.isPartOfCurrentCollection = true;
            var collection_geo = new HaCollectionGeo({ ordering: cyclicLeg ? cgs[1].ordering + HaCollectionGeo.orderingGap : Math.round((cgs[0].ordering + cgs[1].ordering) / 2), latitude: coord[1], longitude: coord[0] });
            //collection_geo.geo = geo;
            collection_geo.geo.isPartOfCurrentCollection = true;
            App.haCollections.splice('collection.collection_geos', index + 1, 0, collection_geo);

            collection.saveNewCollectionGeo(collection_geo);
            

            //this.addPath(locs[0], coord, collection, false, (feature, distance) => {
            //    collection.features.push(feature);
            //});
            //viaPoint = this.addPath(coord, locs[1], collection, true, (feature, distance) => {
            //    collection.features.push(feature);
            //});

            //(<any>viaPoint).geo = geo;
        }

        if ((<any>feature).loc) { //via point
            var deltaX = event.coordinate[0] - this.oldDragCoordinate[0];
            var deltaY = event.coordinate[1] - this.oldDragCoordinate[1];
            var collection_geo = <HaCollectionGeo>(<any>feature).collection_geo;
            collection_geo.geo.icon.translateCoord(deltaX, deltaY);
            (<any>feature.getGeometry()).translate(deltaX, deltaY);
            this.oldDragCoordinate = event.coordinate

            if (!this.viaPointDragDirty) {
                setTimeout(() => {
                    if (this.viaPointDragDirty) {
                        App.haCollections.drawRoute(collection, null, true); //, false
                        collection_geo.saveCoords();
                        this.viaPointDragDirty = false;
                    }
                }, 1000)
                this.viaPointDragDirty = true;
            }
        }

        App.map.preventDrag(event);

        //return viaPoint;
    }
    
}

class RouteProxyCall {
    public collection: HaCollection;
    public loc1: ol.Coordinate;
    public loc2: ol.Coordinate;
    public cacheIndex: string;
    public callback: (feature: ol.Feature, distance: number) => void
}