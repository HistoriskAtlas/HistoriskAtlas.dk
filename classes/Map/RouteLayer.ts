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

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate) {
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString()).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            this.source.addFeature(<ol.Feature>this.cache[cacheIndex]);
            return;
        }

        $.getJSON("proxy/route.json?loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], (data) => {
            var route = new (<any>ol.format.Polyline)({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature(route);
            this.source.addFeature(feature);
            this.cache[cacheIndex] = feature;
        });
    }

    public clear() {
        this.source.clear();
    }

}
