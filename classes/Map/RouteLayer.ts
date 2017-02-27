class RouteLayer extends ol.layer.Vector {
    private source: ol.source.Vector;
    private cache: any;

    constructor() {
        var source = new ol.source.Vector();

        super({
            source: source,
            style: RouteLayer.styleFunction
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

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate, collection: HaCollection, callback: (feature: ol.Feature, distance: number) => void) {
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't'+ collection.type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            var feature: ol.Feature = this.cache[cacheIndex];
            callback(feature, (<any>feature).distance);
            this.source.addFeature(feature);
            return;
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
            this.source.addFeature(feature);
            this.cache[cacheIndex] = feature;
            callback(feature, data.distance);
        });
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
               })
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

}
