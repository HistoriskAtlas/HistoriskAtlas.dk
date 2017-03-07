var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RouteLayer = (function (_super) {
    __extends(RouteLayer, _super);
    function RouteLayer() {
        var source = new ol.source.Vector();
        _super.call(this, {
            source: source,
            style: RouteLayer.styleFunction,
            updateWhileInteracting: true
        });
        this.cache = {};
        this.source = source;
    }
    RouteLayer.prototype.addPath = function (loc1, loc2, collection, drawViaPoint, callback) {
        var _this = this;
        var viaPoint;
        if (drawViaPoint) {
            viaPoint = new ol.Feature({
                geometry: new ol.geom.Point(Common.toMapCoord(loc1)),
            });
            viaPoint.collection = collection;
            viaPoint.loc = loc1;
            this.source.addFeature(viaPoint);
            collection.features.push(viaPoint);
        }
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't' + collection.type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            var feature = this.cache[cacheIndex];
            callback(feature, feature.distance);
            this.source.addFeature(feature);
            return viaPoint;
        }
        $.getJSON("proxy/route.json?type=" + collection.type + "&loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], function (data) {
            var route = new ol.format.Polyline({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature({
                geometry: route
            });
            feature.distance = data.distance;
            feature.collection = collection;
            feature.locs = [loc1, loc2];
            _this.source.addFeature(feature);
            _this.cache[cacheIndex] = feature;
            callback(feature, data.distance);
        });
        return viaPoint;
    };
    RouteLayer.styleFunction = function (feature, res) {
        var collection = feature.collection;
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: collection == App.haCollections.collection ? [153, 0, 0, collection.online ? 1 : 0.5] : [0, 93, 154, collection.online ? 1 : 0.5],
                    width: 5
                }), image: new ol.style.Icon({
                    src: HaTags.viaPointMarker(collection.viaPointLocalOrdering(feature.geo))
                })
            })
        ];
    };
    RouteLayer.prototype.removeFeatures = function (features) {
        var existingFeatures = this.source.getFeatures();
        var newFeatures = [];
        for (var _i = 0, existingFeatures_1 = existingFeatures; _i < existingFeatures_1.length; _i++) {
            var feature = existingFeatures_1[_i];
            if (features.indexOf(feature) == -1)
                newFeatures.push(feature);
        }
        this.source.clear();
        this.source.addFeatures(newFeatures);
    };
    RouteLayer.prototype.redraw = function () {
        var existingFeatures = this.source.getFeatures();
        this.source.clear();
        this.source.addFeatures(existingFeatures);
    };
    RouteLayer.prototype.moveEvent = function (event) {
        this.oldDragCoordinate = null;
    };
    RouteLayer.prototype.dragEvent = function (event, collection, feature) {
        var _this = this;
        if (!(collection == App.haCollections.collection))
            return;
        if (!App.haUsers.user.canEditCollection(collection))
            return;
        var first = false;
        if (!this.oldDragCoordinate) {
            first = true;
            this.oldDragCoordinate = event.coordinate;
        }
        if (feature.locs && first) {
            var locs = feature.locs;
            var geos = [];
            for (var _i = 0, _a = collection.geos; _i < _a.length; _i++) {
                var geo = _a[_i];
                for (var i = 0; i < 2; i++)
                    if (geo.icon.coord4326[0] == locs[i][0] && geo.icon.coord4326[1] == locs[i][1])
                        geos[i] = geo;
            }
            var index = Math.min(collection.geos.indexOf(geos[0]), collection.geos.indexOf(geos[1]));
            this.removeFeatures([feature]);
            collection.features.splice(collection.features.indexOf(feature), 1);
            var coord = Common.fromMapCoord(event.coordinate);
            var geo = new HaGeo({ id: 0, lng: coord[0], lat: coord[1] }, false, false);
            geo.isPartOfCurrentCollection = true;
            App.haCollections.splice('collection.geos', index + 1, 0, geo);
        }
        if (feature.loc) {
            var deltaX = event.coordinate[0] - this.oldDragCoordinate[0];
            var deltaY = event.coordinate[1] - this.oldDragCoordinate[1];
            feature.geo.icon.translateCoord(deltaX, deltaY);
            feature.getGeometry().translate(deltaX, deltaY);
            this.oldDragCoordinate = event.coordinate;
            if (!this.viaPointDragDirty) {
                setTimeout(function () {
                    if (_this.viaPointDragDirty) {
                        App.haCollections.drawRoute(collection, false);
                        _this.viaPointDragDirty = false;
                    }
                }, 1000);
                this.viaPointDragDirty = true;
            }
        }
        App.map.preventDrag(event);
    };
    return RouteLayer;
}(ol.layer.Vector));
