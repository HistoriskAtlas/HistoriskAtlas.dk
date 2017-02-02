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
var WindowGeoByLine = (function (_super) {
    __extends(WindowGeoByLine, _super);
    function WindowGeoByLine() {
        _super.apply(this, arguments);
    }
    WindowGeoByLine.prototype.show1001User = function (institution) {
        return institution.id == 731;
    };
    WindowGeoByLine.prototype.showUser = function (institutions) {
        return institutions.length == 0;
    };
    WindowGeoByLine.prototype.institutionTap = function (e) {
        Common.dom.append(WindowInstitution.create(e.model.item));
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowGeoByLine.prototype, "institutions", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAUser)
    ], WindowGeoByLine.prototype, "user", void 0);
    WindowGeoByLine = __decorate([
        component("window-geo-by-line"), 
        __metadata('design:paramtypes', [])
    ], WindowGeoByLine);
    return WindowGeoByLine;
}(polymer.Base));
WindowGeoByLine.register();
