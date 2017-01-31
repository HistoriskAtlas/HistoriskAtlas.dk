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
var DialogRouteSelection = (function (_super) {
    __extends(DialogRouteSelection, _super);
    function DialogRouteSelection(title, geo) {
        _super.call(this);
        this.title = title;
        this.geo = geo;
        this.collections = App.haCollections.collections;
    }
    DialogRouteSelection.prototype.newRouteTap = function () {
        App.haCollections.newRoute(this.geo);
    };
    DialogRouteSelection.prototype.existingRouteTap = function (e) {
        var route = e.model.collection;
        App.haCollections.select(e.model.collection, this.geo);
    };
    DialogRouteSelection.prototype.close = function () {
        $(this).remove();
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogRouteSelection.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', Array)
    ], DialogRouteSelection.prototype, "collections", void 0);
    __decorate([
        listen('dialog.iron-activate'),
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DialogRouteSelection.prototype, "close", null);
    DialogRouteSelection = __decorate([
        component("dialog-route-selection"), 
        __metadata('design:paramtypes', [Object, HaGeo])
    ], DialogRouteSelection);
    return DialogRouteSelection;
}(polymer.Base));
DialogRouteSelection.register();
//# sourceMappingURL=dialog-route-selection.js.map