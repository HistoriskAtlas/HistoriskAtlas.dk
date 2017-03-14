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
var WindowAdmin = (function (_super) {
    __extends(WindowAdmin, _super);
    function WindowAdmin() {
        _super.apply(this, arguments);
    }
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], WindowAdmin.prototype, "selectedTab", void 0);
    WindowAdmin = __decorate([
        component("window-admin"), 
        __metadata('design:paramtypes', [])
    ], WindowAdmin);
    return WindowAdmin;
}(polymer.Base));
WindowAdmin.register();
//# sourceMappingURL=window-admin.js.map