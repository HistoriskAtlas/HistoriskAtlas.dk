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
var MapMenu = (function (_super) {
    __extends(MapMenu, _super);
    function MapMenu() {
        _super.apply(this, arguments);
    }
    MapMenu.prototype.buttonTap = function () {
        if (this.drawerOpen && App.mainMenu.showMenuMaps) {
            this.drawerOpen = false;
            return;
        }
        this.drawerOpen = true;
        App.mainMenu.set('showMenuMaps', true);
        this.showMainMenu = false;
    };
    MapMenu.prototype.cssClass = function (lift, drawerOpen) {
        return 'primary ' + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '');
    };
    MapMenu.prototype.year = function (startYear, endYear) {
        return Common.years(startYear, endYear);
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], MapMenu.prototype, "map", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MapMenu.prototype, "lift", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MapMenu.prototype, "drawerOpen", void 0);
    __decorate([
        property({ type: Boolean, value: true, notify: true }), 
        __metadata('design:type', Boolean)
    ], MapMenu.prototype, "showMainMenu", void 0);
    __decorate([
        property({ type: Boolean, value: true }), 
        __metadata('design:type', Boolean)
    ], MapMenu.prototype, "raised", void 0);
    __decorate([
        listen("button.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MapMenu.prototype, "buttonTap", null);
    MapMenu = __decorate([
        component("map-menu"), 
        __metadata('design:paramtypes', [])
    ], MapMenu);
    return MapMenu;
}(polymer.Base));
MapMenu.register();
