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
var PanelMap = (function (_super) {
    __extends(PanelMap, _super);
    function PanelMap() {
        _super.apply(this, arguments);
    }
    //mapClass(main: boolean): string {
    //    return 'map' + (main ? ' HAPrimColor' : ' HASecColor');
    //}
    //imageWrapperClass(itemMap: HaMap, map: HaMap): string {
    //    return itemMap == map ? 'selectedImage' : '';
    //}
    PanelMap.prototype.hillshadeChanged = function () {
        if (App.map)
            App.map.hillshade.update(this.hillshade);
    };
    //@observe('extent')
    //extentChanged() {
    //    alert(this.extent[0])
    //}
    PanelMap.prototype.hillshadeTextTap = function () {
        this.$.hillshadeSlider.value = this.hillshade ? 0.0 : 0.3;
    };
    PanelMap.prototype.years = function (start, end) {
        return (start ? start + ' - ' : '') + end;
    };
    //public mapTapped(e: CustomEvent) {
    //    var map = <HaMap>this.$.templateMaps.itemForElement(e.target);
    //    this.set('map', map);
    //}
    //primary(main: boolean): string {
    //    return main ? 'primary' : '';
    //}
    PanelMap.prototype.backgroundStyle = function (url) {
        return "background-image: linear-gradient(to right, rgba(255,255,255,1.0), rgba(255,255,255,0.0)), url('" + url + "')"; /*rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.0))*/
    };
    PanelMap.prototype.active = function (item, map) {
        return item == map;
    };
    PanelMap.prototype.visible = function (inView, filter) {
        return filter ? inView : true;
    };
    PanelMap.prototype.itemTap = function (e) {
        var map = e.model.item;
        this.set('map', map);
    };
    PanelMap.prototype.timeWarpItemTap = function (e) {
        var map = e.model.item;
        e.cancelBubble = true;
        this.set('timeWarpMap', map);
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], PanelMap.prototype, "map", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], PanelMap.prototype, "timeWarpMap", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelMap.prototype, "maps", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], PanelMap.prototype, "year", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], PanelMap.prototype, "timeWarpYear", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PanelMap.prototype, "hillshade", void 0);
    __decorate([
        property({ type: Boolean, value: true }), 
        __metadata('design:type', Boolean)
    ], PanelMap.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelMap.prototype, "timeWarpActive", void 0);
    __decorate([
        observe('hillshade'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelMap.prototype, "hillshadeChanged", null);
    __decorate([
        listen('hillshadeText.tap'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelMap.prototype, "hillshadeTextTap", null);
    PanelMap = __decorate([
        component("panel-map"), 
        __metadata('design:paramtypes', [])
    ], PanelMap);
    return PanelMap;
}(polymer.Base));
PanelMap.register();
//# sourceMappingURL=panel-map.js.map