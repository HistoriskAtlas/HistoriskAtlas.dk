var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DigDagLayer = (function (_super) {
    __extends(DigDagLayer, _super);
    function DigDagLayer(type, year) {
        var _this = this;
        var source = new ol.source.XYZ({ url: DigDagLayer.getUrl(type, year), crossOrigin: 'Anonymous' });
        source.setCanvasTileClass();
        _super.call(this, { source: source });
        this.source = source;
        this._type = type;
        this._year = year;
        if (!DigDagLayer.borderRegion)
            DigDagLayer.borderRegion = new HaRegion();
        this.quadTree = 0;
        DigDagLayer.instanceDigDagLayer = this;
        this.on('postcompose', function (event) {
            if (_this.helper.active)
                event.context.drawImage(_this.helper.context.canvas, 0, 0);
        });
        this.helper = new DigDagHelperLayer(type, year);
        App.map.getLayers().insertAt(0, this.helper);
    }
    Object.defineProperty(DigDagLayer.prototype, "year", {
        set: function (newYear) {
            if (newYear == this._year)
                return;
            this._year = newYear;
            this.quadTree = 0;
            this.source.setUrl(this.url);
            this.helper.year = newYear;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DigDagLayer.prototype, "type", {
        set: function (newType) {
            if (newType == this._type)
                return;
            this._type = newType;
            this.quadTree = 0;
            this.source.setUrl(this.url);
            this.helper.type = newType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DigDagLayer.prototype, "url", {
        get: function () {
            return DigDagLayer.getUrl(this._type, this._year);
        },
        enumerable: true,
        configurable: true
    });
    DigDagLayer.getUrl = function (type, year) {
        return location.protocol + '//tile.historiskatlas.dk/tile/digdag/' + type + '/' + year + '/{z}/{x}/{y}.png';
    };
    DigDagLayer.prototype.show = function (type) {
        this.type = type;
        this.setVisible(true);
        this.helper.setVisible(true);
    };
    DigDagLayer.prototype.hide = function () {
        this.helper.setVisible(false);
        this.setVisible(false);
        this.quadTree = 0;
        this._type = null;
        this.helper.update(0);
    };
    Object.defineProperty(DigDagLayer.prototype, "isVisible", {
        get: function () {
            return this.getVisible();
        },
        enumerable: true,
        configurable: true
    });
    DigDagLayer.prototype.change = function () {
        if (this._type)
            this.helper.setDirty();
    };
    DigDagLayer.prototype.getRegion = function (coord) {
        if (coord == null)
            return null;
        var regionID = this.getRegionID(this.quadTree, [coord[0], -coord[1]], -20037508.34, 20037508.34, -20037508.34, 20037508.34);
        if (regionID == 0) {
            this.helper.update(0);
            return null;
        }
        if (regionID == 1) {
            this.helper.update(1);
            return DigDagLayer.borderRegion;
        }
        this.helper.update(regionID);
        return App.haRegions.regions[regionID];
    };
    DigDagLayer.prototype.getRegionID = function (qt, coord, minX, maxX, minY, maxY) {
        if (typeof (qt) == 'number')
            return qt == 16777215 ? 0 : qt;
        var xs = coord[0] < (maxX + minX) / 2 ? 0 : 1;
        var ys = coord[1] < (maxY + minY) / 2 ? 0 : 1;
        var i = xs + (ys << 1);
        if (xs == 0)
            maxX -= (maxX - minX) / 2;
        else
            minX += (maxX - minX) / 2;
        if (ys == 0)
            maxY -= (maxY - minY) / 2;
        else
            minY += (maxY - minY) / 2;
        return this.getRegionID(qt[i], coord, minX, maxX, minY, maxY);
    };
    DigDagLayer.modifyImage = function (image, tileCoord) {
        return this.instanceDigDagLayer.modifyImage(image, tileCoord);
    };
    DigDagLayer.prototype.modifyImage = function (image, tileCoord) {
        this.tileCoord = tileCoord;
        var canvas = document.createElement('canvas');
        canvas.width = DigDagLayer.tileSize;
        canvas.height = DigDagLayer.tileSize;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, DigDagLayer.tileSize, DigDagLayer.tileSize);
        this.data = imageData.data;
        this.quadTree = this.createQuadTree(this.quadTree, 0);
        context.putImageData(imageData, 0, 0);
        this.data = null;
        return context.canvas;
    };
    DigDagLayer.prototype.createQuadTree = function (qt, z) {
        var xs = (1 << (this.tileCoord[0] - z - 1) & this.tileCoord[1]) ? 1 : 0;
        var ys = (1 << (this.tileCoord[0] - z - 1) & (-this.tileCoord[2] - 1)) ? 1 : 0;
        var i = xs + (ys << 1);
        var nqt;
        if (z < this.tileCoord[0]) {
            nqt = typeof (qt) == 'number' ? [qt, qt, qt, qt] : [qt[0], qt[1], qt[2], qt[3]];
            nqt[i] = this.createQuadTree(nqt[i], z + 1);
        }
        else
            nqt = this.getQuadTree(qt, 0, 0, 0);
        return nqt;
    };
    DigDagLayer.prototype.getQuadTree = function (qt, z, x, y) {
        var nqt;
        if (z < 8) {
            var nx = x << 1;
            var ny = y << 1;
            var nz = z + 1;
            if (typeof (qt) == 'number') {
                nqt = [this.getQuadTree(qt, nz, nx, ny),
                    this.getQuadTree(qt, nz, nx + 1, ny),
                    this.getQuadTree(qt, nz, nx, ny + 1),
                    this.getQuadTree(qt, nz, nx + 1, ny + 1)];
            }
            else {
                nqt = [this.getQuadTree(qt[0], nz, nx, ny),
                    this.getQuadTree(qt[1], nz, nx + 1, ny),
                    this.getQuadTree(qt[2], nz, nx, ny + 1),
                    this.getQuadTree(qt[3], nz, nx + 1, ny + 1)];
            }
            nqt = this.cleanQuad(nqt);
        }
        else {
            var i = (x + (y << 8)) << 2;
            var data = this.data;
            nqt = data[i] + (data[i + 1] << 8) + (data[i + 2] << 16);
            if (nqt) {
                if (nqt == 1) {
                    data[i + 3] = 120;
                    return 1;
                }
                data[i + 3] = 0;
            }
            else {
                data[i + 3] = 40;
                return 1;
            }
        }
        return nqt;
    };
    DigDagLayer.prototype.cleanQuad = function (qt) {
        if (qt[0] == qt[1])
            if (qt[1] == qt[2])
                if (qt[2] == qt[3])
                    return qt[0];
        return qt;
    };
    DigDagLayer.tileSize = 256;
    return DigDagLayer;
}(ol.layer.Tile));
