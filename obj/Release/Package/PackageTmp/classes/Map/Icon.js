var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Icon = (function (_super) {
    __extends(Icon, _super);
    function Icon(geo, coord4326) {
        var point = new ol.geom.Point(Common.toMapCoord(coord4326));
        _super.call(this, {
            geometry: point,
            name: geo.title
        });
        this.point = point;
        this.geo = geo;
        geo.icon = this;
        this.setId(this.geo.id);
        this.updateStyle();
    }
    Icon.prototype.translateCoord = function (deltaX, deltaY) {
        this.point.translate(deltaX, deltaY);
    };
    Object.defineProperty(Icon.prototype, "coord3857", {
        get: function () {
            return this.point.getCoordinates();
        },
        set: function (coord) {
            this.point.setCoordinates(coord);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "coord4326", {
        get: function () {
            return Common.fromMapCoord(this.coord3857);
        },
        set: function (coord) {
            this.coord3857 = Common.toMapCoord(coord);
        },
        enumerable: true,
        configurable: true
    });
    Icon.prototype.updateStyle = function () {
        var style = new ol.style.Style({
            image: this.iconStyle = new ol.style.Icon({
                anchor: [0.5, 1.0],
                src: this.marker,
                opacity: this.geo.online || this.geo.isMoving ? 1.0 : 0.5
            })
        });
        if (!this.geo.isMoving) {
            this.setStyle(style);
            return;
        }
        var styles = [];
        styles.push(style);
        styles.push(new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.75],
                src: '../../images/markers/move-marker.png'
            })
        }));
        this.setStyle(styles);
    };
    Icon.prototype.updateMinDist = function () {
        var _this = this;
        var minDistSquared = Number.MAX_VALUE;
        IconLayer.iconsShown.forEach(function (icon) {
            if (icon != _this) {
                var distSquared = Math.pow(icon.coord3857[0] - _this.coord3857[0], 2) + Math.pow(icon.coord3857[1] - _this.coord3857[1], 2);
                if (distSquared < minDistSquared)
                    minDistSquared = distSquared;
            }
        });
        this.minDist = Math.sqrt(minDistSquared);
    };
    Object.defineProperty(Icon.prototype, "marker", {
        get: function () {
            if (this.geo.isPartOfCurrentCollection)
                return this.geo.id ? HaTags.numberMarker(App.haCollections.collection.geoOrdering(this.geo) + 1) : HaTags.viaPointMarker(App.haCollections.collection.viaPointLocalOrdering(this.geo));
            if (this.geo.primaryTag)
                if (this.geo.primaryTag.marker)
                    return this.geo.isUGC ? this.geo.primaryTag.invertedMarker : this.geo.primaryTag.marker;
            return this.geo.isUGC ? Icon.invertedDefaultMarker : Icon.defaultMarker;
        },
        enumerable: true,
        configurable: true
    });
    return Icon;
}(ol.Feature));
