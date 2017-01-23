class RouteLayer extends ol.layer.Vector {
    private source: ol.source.Vector;

    constructor() {
        this.source = new ol.source.Vector();

        //var feature = new ol.Feature({
        //    geometry: new (<any>ol.geom.LineString)([Common.toMapCoord([9.418085, 55.756011]), Common.toMapCoord([9.593907, 55.707600])])
        //    //labelPoint: new ol.geom.Point(labelCoords),
        //    //name: 'My Polygon',
        //    //style: new ol.style.Style({
        //    //    stroke: new ol.style.Stroke({
        //    //        color: [255, 0, 0, 1],
        //    //        width: 10
        //    //    }),
        //    //    fill: new ol.style.Fill({
        //    //        color: [0, 255, 0, 1]
        //    //    })
        //    //})
        //});

        //source.addFeature(feature);

        super({
            source: this.source,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 93, 154, 1],
                    width: 5
                })
            })
        })

        //$.getJSON("proxy/route.json?loc=55.756011,9.418085&loc=55.707600,9.593907", (data) => {
        //    var route = new (<any>ol.format.Polyline)({
        //        factor: 1e6
        //    }).readGeometry(data.geometry, {
        //        dataProjection: 'EPSG:4326',
        //        featureProjection: 'EPSG:3857'
        //    });
        //    var feature = new ol.Feature(route);
        //    //feature.setStyle(styles.route);
        //    this.source.addFeature(feature);
        //});
    }

    public addPath(loc1: ol.Coordinate, loc2: ol.Coordinate) {
        //TODO: implement local storage cache?
        $.getJSON("proxy/route.json?loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], (data) => {
            var route = new (<any>ol.format.Polyline)({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature(route);
            this.source.addFeature(feature);
        });
    }

    public clear() {
        this.source.clear();
    }

}
