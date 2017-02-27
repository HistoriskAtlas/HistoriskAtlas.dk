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
var PanelAdmin = (function (_super) {
    __extends(PanelAdmin, _super);
    function PanelAdmin() {
        _super.apply(this, arguments);
        this.compareDir = 1;
    }
    PanelAdmin.prototype.select = function (item) {
        this.$.selector.select(item);
    };
    PanelAdmin.prototype.deselect = function (item) {
        this.$.selector.deselect(item);
    };
    PanelAdmin.prototype.sort = function (func, newItems) {
        if (func === void 0) { func = null; }
        if (newItems === void 0) { newItems = null; }
        this.$.selector.sort(func, newItems);
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], PanelAdmin.prototype, "items", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], PanelAdmin.prototype, "item", void 0);
    PanelAdmin = __decorate([
        component("panel-admin"), 
        __metadata('design:paramtypes', [])
    ], PanelAdmin);
    return PanelAdmin;
}(polymer.Base));
PanelAdmin.register();
//# sourceMappingURL=panel-admin.js.map