class RouteLayer extends ol.layer.Vector {
    private source: ol.source.Vector;
    private cache: any;

    constructor() {
        var source = new ol.source.Vector();

        super({
            source: source,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 93, 154, 1],
                    width: 5
                })
            })
        })

        this.cache = {};
        this.source = source;
    }

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate, type: number, callback: (distance: number) => void) {
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't'+ type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            callback((<any>this.cache[cacheIndex]).distance);
            this.source.addFeature(<ol.Feature>this.cache[cacheIndex]);
            return;
        }

        $.getJSON("proxy/route.json?type=" + type +  "&loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], (data) => {
            var route = new (<any>ol.format.Polyline)({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature(route);
            (<any>feature).distance = data.distance;
            this.source.addFeature(feature);
            this.cache[cacheIndex] = feature;
            callback(data.distance);
        });
    }

    public clear() {
        this.source.clear();
    }

}
