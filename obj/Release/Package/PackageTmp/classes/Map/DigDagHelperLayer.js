var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DigDagHelperLayer = (function (_super) {
    __extends(DigDagHelperLayer, _super);
    function DigDagHelperLayer(type, year) {
        var _this = this;
        var source = new ol.source.XYZ({ url: DigDagLayer.getUrl(type, year), crossOrigin: 'Anonymous' });
        _super.call(this, { source: source });
        this._type = type;
        this._year = year;
        this._active = false;
        this._dirty = true;
        this.loaded = 0;
        this.loading = 0;
        this.source = source;
        this.setVisible(false);
        this.context = document.createElement('canvas').getContext('2d');
        this.source.on('tileloadstart', function () { return _this.loading++; });
        this.source.on('tileloadend', function () { return _this.loaded++; });
        this.source.on('tileloaderror', function () { return _this.loaded++; });
        this.on('postcompose', function (event) {
            if (_this.loaded != _this.oldLoaded || _this.redrawCount == 0) {
                _this.context.canvas.width = event.context.canvas.width;
                _this.context.canvas.height = event.context.canvas.height;
                var imageData = event.context.getImageData(0, 0, _this.context.canvas.width, _this.context.canvas.height); //TODO: Create instead?
                _this.data32 = new Uint32Array(imageData.data.buffer);
                _this.generateContext();
            }
            //console.debug('loaded: ' + this.loaded + ' | loading: ' + this.loading + ' | redrawCount: ' + this.redrawCount);
            if (_this.loaded == _this.loading && _this.redrawCount > 2)
                _this.setVisible(false);
            else
                _this.redrawCount++;
            _this.oldLoaded = _this.loaded;
        });
    }
    Object.defineProperty(DigDagHelperLayer.prototype, "active", {
        get: function () {
            return this._active || !!this.data32PrevYear;
        },
        enumerable: true,
        configurable: true
    });
    DigDagHelperLayer.prototype.setDirty = function () {
        this._dirty = true;
        this._active = false;
        if (this.data32PrevYear) {
            clearTimeout(this.yearChangedTimeout);
            this.data32PrevYear = null;
            App.map.digDagLayer.setOpacity(1);
        }
        this.setVisible(false);
    };
    Object.defineProperty(DigDagHelperLayer.prototype, "year", {
        set: function (newYear) {
            var _this = this;
            if (newYear == this._year)
                return;
            this._year = newYear;
            this.setDirty();
            this.data32PrevYear = this.data32; //TODO: This only works if the helper layer is currently active.... need to redraw first if not....
            this.source.setUrl(this.url);
            App.map.digDagLayer.setOpacity(0);
            this.update(null);
            this.yearChangedTimeout = setTimeout(function () {
                _this.data32PrevYear = null;
                _this._active = false;
                App.map.digDagLayer.setOpacity(1);
                _this.update(null);
            }, 10000); //Was 3000
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DigDagHelperLayer.prototype, "type", {
        set: function (newType) {
            if (newType == this._type)
                return;
            this._type = newType;
            this.setDirty();
            this.source.setUrl(this.url);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DigDagHelperLayer.prototype, "url", {
        get: function () {
            return DigDagLayer.getUrl(this._type, this._year);
        },
        enumerable: true,
        configurable: true
    });
    DigDagHelperLayer.prototype.update = function (id) {
        if (App.map.moving)
            return;
        if (this.regionID == id && this._active)
            return;
        if (id == 0) {
            this._active = false;
            this.regionID = 0;
            App.map.render(); //Needed?
            return;
        }
        if (id == 1)
            return;
        if (id)
            this.regionID = id;
        this._active = true;
        if (this._dirty) {
            this.redrawCount = 0;
            this.setVisible(true);
            App.map.render(); //TODO: needed?
            this._dirty = false;
        }
        else {
            this.generateContext();
        }
    };
    //private generateContext() {
    //    //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    //    //var staticImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
    //    var staticImageData = this.context.createImageData(this.context.canvas.width, this.context.canvas.height) //Better performance? mem use problem?
    //    var shadowOffset = staticImageData.width * 16 + 16;
    //    for (var i: number = 0; i < staticImageData.data.length; i += 4) {
    //        if (this.imageData.data[i] + (this.imageData.data[i + 1] << 8) + (this.imageData.data[i + 2] << 16) == this.regionID) {
    //            var j = i + shadowOffset;
    //            //staticImageData.data[j] = 0;
    //            //staticImageData.data[j + 1] = 0;
    //            //staticImageData.data[j + 2] = 0;
    //            staticImageData.data[j + 3] = 100;
    //            staticImageData.data[i] = 255;
    //            staticImageData.data[i + 1] = 255;
    //            staticImageData.data[i + 2] = 255;
    //            staticImageData.data[i + 3] = 180;
    //        }
    //    }
    //    this.context.putImageData(staticImageData, 0, 0);
    //    App.map.render();
    //}
    DigDagHelperLayer.prototype.generateContext = function () {
        //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        //var staticImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
        var staticImageData = this.context.createImageData(this.context.canvas.width, this.context.canvas.height); //Better performance? mem use problem?
        var shadowOffset = staticImageData.width * 4 + 4;
        var bufStatic = new ArrayBuffer(staticImageData.data.length);
        var bufStatic8 = new Uint8ClampedArray(bufStatic);
        var dataStatic32 = new Uint32Array(bufStatic);
        var white = 255 | (255 << 8) | (255 << 16) | (180 << 24);
        var red0 = 255 | (127 << 24);
        var red1 = 255 | (255 << 24);
        //var green: number = (200 << 8) | (255 << 24);
        var shadow = 100 << 24;
        var black0 = 40 << 24;
        var black1 = 120 << 24;
        var black0unmasked = (0 | (255 << 24)) >>> 0;
        var black1unmasked = (1 | (255 << 24)) >>> 0;
        //var mask = 255 | (255 << 8) | (255 << 16);
        var regionIDunmasked = this.regionID == 0 ? 42 : (this.regionID | (255 << 24)) >>> 0;
        for (var i = 0; i < dataStatic32.length; i++) {
            if (this.data32PrevYear) {
                if (this.data32[i]) {
                    if (this.data32PrevYear[i] > black1unmasked) {
                        if (this.data32[i] == black0unmasked) {
                            dataStatic32[i] = red0;
                            continue;
                        }
                        if (this.data32[i] == black1unmasked) {
                            dataStatic32[i] = red1;
                            continue;
                        }
                    }
                }
                if (this.data32PrevYear[i] == black0unmasked) {
                    dataStatic32[i] = black0;
                    continue;
                }
                if (this.data32PrevYear[i] == black1unmasked) {
                    dataStatic32[i] = black1;
                    continue;
                }
            }
            if (this.data32[i] == regionIDunmasked) {
                dataStatic32[i + shadowOffset] = shadow;
                dataStatic32[i] = white;
                continue;
            }
        }
        staticImageData.data.set(bufStatic8);
        this.context.putImageData(staticImageData, 0, 0);
        App.map.render();
    };
    return DigDagHelperLayer;
}(ol.layer.Tile));
//# sourceMappingURL=DigDagHelperLayer.js.map