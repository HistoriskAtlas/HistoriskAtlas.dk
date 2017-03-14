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
    //@property({ type: Number, value: 0 })
    //public mode: TimeWarpModes & number;
    //private cssClassButton: string = this.main ? 'HAPrimColor' : 'HASecColor';
    //private cssClassSpacer: string = 'spacer' + (this.main ? ' HAInvertedPrimColor' : ' HAInvertedSecColor');
    //private cssClassWrapper: string = 'wrapper ' + (this.main ? 'wrapperLeft HAPrimColor' : 'wrapperRight HASecColor');
    //ready() {
    //    //this.raised = !this.main;
    //    this.raised = true;
    //}
    //@listen("button.mouseover")
    //buttonMouseover() {
    //    if (this.main)
    //        this.raised = true;
    //}
    //@listen("button.mouseout")
    //buttonMouseout() {
    //    if (this.main)
    //        this.raised = false;
    //}
    //@listen("button.tap")
    //tap() {
    //    //$('body').append(WindowMap.create(this));
    //}
    //@listen("buttonSubject.tap")
    //tapSubject() {
    //    $('body').append(WindowSubject.create(this));
    //}
    //@observe("active")
    //activeChanged(newVal: boolean) {
    //    this.selected = newVal ? '3' : null;
    //}
    MapMenu.prototype.buttonTap = function () {
        //this.selected = this.active ? (this.main ? 2 : 3) : null;
        //this.selected = this.active ? 0 : null;
        if (this.drawerOpen && App.mainMenu.showMenuMaps) {
            this.drawerOpen = false;
            return;
        }
        this.drawerOpen = true;
        App.mainMenu.showMenuMaps = true;
    };
    //@observe("selected")
    //selectedChanged(newVal: boolean) {
    //    //this.active = this.selected == (this.main ? 2 : 3);
    //    this.active = this.selected == 0;
    //}
    MapMenu.prototype.cssClass = function (lift, drawerOpen) {
        //return (main ? 'primary HAPrimColor' : 'HASecColor') + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '') + (!main && mode == TimeWarpModes.SPLIT ? ' fix' : '');
        return 'primary ' + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '');
    };
    //public setMap(haMap: HaMap) {
    //    this.set('map', haMap);
    //}
    MapMenu.prototype.year = function (startYear, endYear) {
        return Common.years(startYear, endYear);
        //return (startYear ? startYear + ' - ' : '') + endYear;
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
//# sourceMappingURL=map-menu.js.map