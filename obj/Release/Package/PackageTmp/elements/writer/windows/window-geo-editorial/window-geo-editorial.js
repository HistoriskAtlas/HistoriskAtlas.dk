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
var WindowGeoEditorial = (function (_super) {
    __extends(WindowGeoEditorial, _super);
    function WindowGeoEditorial() {
        _super.apply(this, arguments);
    }
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], WindowGeoEditorial.prototype, "selectedTab", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaGeo)
    ], WindowGeoEditorial.prototype, "geo", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaContent)
    ], WindowGeoEditorial.prototype, "content", void 0);
    WindowGeoEditorial = __decorate([
        component("window-geo-editorial"), 
        __metadata('design:paramtypes', [])
    ], WindowGeoEditorial);
    return WindowGeoEditorial;
}(polymer.Base));
WindowGeoEditorial.register();
