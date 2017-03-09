class RouteLayer extends ol.layer.Vector {
    private source: ol.source.Vector;
    private cache: any;
    private oldDragCoordinate: ol.Coordinate;
    private viaPointDragDirty: boolean;

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

        this.cache = {};
        this.source = source;
    }

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate, collection: HaCollection, drawViaPoint: boolean, callback: (feature: ol.Feature, distance: number) => void): ol.Feature {

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

        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't' + collection.type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            var feature: ol.Feature = this.cache[cacheIndex];
            callback(feature, (<any>feature).distance);
            this.source.addFeature(feature);
            return viaPoint;
        }

        $.getJSON("proxy/route.json?type=" + collection.type +  "&loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], (data) => {
            var route = new (<any>ol.format.Polyline)({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });


            //var coord = Common.toMapCoord(loc2);
            //var stop = new ol.geom.Circle(coord, 100);
            //var featureStop = new ol.Feature(stop);
            //featureStop.setStyle(new ol.style.Style({
            //    zIndex: 10,
            //    fill: new ol.style.Fill({
            //        color: [255, 0, 0, 1]
            //    })
            //}))
            //this.source.addFeature(featureStop);

            var feature = new ol.Feature({
                geometry: route
            });
            (<any>feature).distance = data.distance;
            (<any>feature).collection = collection;
            (<any>feature).locs = [loc1, loc2];
            this.source.addFeature(feature);
            this.cache[cacheIndex] = feature;
            callback(feature, data.distance);
        });

        return viaPoint;
    }

    private static styleFunction(feature: ol.Feature, res: number): Array<ol.style.Style> {
        var collection: HaCollection = (<any>feature).collection;
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: collection == App.haCollections.collection ? [153, 0, 0, collection.online ? 1 : 0.5] : [0, 93, 154, collection.online ? 1 : 0.5],
                    width: 5
                    //width: collection == App.haCollections.collection ? 8 : 5
                    //lineDash: collection == App.haCollections.collection ? null : [5, 15]
                }), image: new ol.style.Icon({
                    src: HaTags.viaPointMarker(collection.viaPointOrdering((<any>feature).geo))
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
            var geos: Array<HaGeo> = [];
            for (var geo of collection.geos) {
                for (var i = 0; i < 2; i++)
                    if (geo.icon.coord4326[0] == locs[i][0] && geo.icon.coord4326[1] == locs[i][1])
                        geos[i] = geo;
            }

            var index = Math.min(collection.geos.indexOf(geos[0]), collection.geos.indexOf(geos[1]))

            this.removeFeatures([feature]);
            collection.features.splice(collection.features.indexOf(feature), 1);


            var coord = Common.fromMapCoord(event.coordinate);
            var geo = new HaGeo({ id: 0, lng: coord[0], lat: coord[1] }, false, false)
            geo.isPartOfCurrentCollection = true;
            App.haCollections.splice('collection.geos', index + 1, 0, geo);

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
            (<HaGeo>(<any>feature).geo).icon.translateCoord(deltaX, deltaY);
            (<any>feature.getGeometry()).translate(deltaX, deltaY);
            this.oldDragCoordinate = event.coordinate

            if (!this.viaPointDragDirty) {
                setTimeout(() => {
                    if (this.viaPointDragDirty) {
                        App.haCollections.drawRoute(collection, false);
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
