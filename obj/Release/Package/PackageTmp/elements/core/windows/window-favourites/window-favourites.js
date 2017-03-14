var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WindowFavourites = (function (_super) {
    __extends(WindowFavourites, _super);
    function WindowFavourites() {
        var _this = this;
        _super.call(this);
        this.geos = App.haUsers.user.favourites.geos;
        App.haUsers.addEventListener('userFavouritesGeosChanged', function () { return _this.$.templateGeos.render(); });
    }
    WindowFavourites.prototype.windowBasicClosed = function () {
        App.windowFavourites = null;
    };
    WindowFavourites.prototype.geoTap = function (e) {
        Common.dom.append(WindowGeo.create(e.model.geo));
    };
    WindowFavourites.prototype.geoTapRemove = function (e) {
        e.cancelBubble = true;
        this.splice('geos', this.geos.indexOf(e.model.geo), 1);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowFavourites.prototype, "geos", void 0);
    __decorate([
        listen('windowbasic.closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowFavourites.prototype, "windowBasicClosed", null);
    WindowFavourites = __decorate([
        component("window-favourites"), 
        __metadata('design:paramtypes', [])
    ], WindowFavourites);
    return WindowFavourites;
}(polymer.Base));
WindowFavourites.register();
//# sourceMappingURL=window-favourites.js.map