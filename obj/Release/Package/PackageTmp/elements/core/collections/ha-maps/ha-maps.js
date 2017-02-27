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
var HaMaps = (function (_super) {
    __extends(HaMaps, _super);
    function HaMaps() {
        _super.apply(this, arguments);
    }
    HaMaps.prototype.ready = function () {
        this.maps = [];
        this.byId = [];
        this.$.ajax.url = Common.api + 'map.json?ispublic=true&sort={orgproductionendyear:asc}&count=all&v=1&schema={map:[id,name,orgproductionstartyear,orgproductionendyear,ispublic,minlat,maxlat,minlon,maxlon,minz,maxz,iconcoords]}';
    };
    HaMaps.prototype.handleResponse = function () {
        var _this = this;
        var newMaps = [];
        var newMap;
        this.$.ajax.lastResponse.data.forEach(function (data) {
            newMap = new HaMap(data);
            //if (newMap.id == Global.defaultTheme.mapid)
            //    HaMaps.defaultMap = newMap;
            //if (newMap.id == App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid)
            //    this.mainMap = newMap;
            //if (newMap.id == HaMaps.initTimeWarpMapId)
            //    this.timeWarpMap = newMap;
            newMaps.push(newMap);
            _this.byId[newMap.id] = newMap;
        });
        HaMaps.defaultMap = this.byId[Global.defaultTheme.mapid];
        this.mainMap = this.byId[App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid];
        this.timeWarpMap = this.byId[HaMaps.initTimeWarpMapId];
        if (App.isDev) {
            //newMaps.push(new HaMap({ id: 42000, name: 'Mapquest OSM', orgproductionendyear: 2016}))
            newMaps.push(new HaMap({ id: 42001, name: 'Stamen Watercolor', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42002, name: 'CartoDB Light', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42003, name: 'CartoDB Dark', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42004, name: 'HOT style', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42005, name: 'HERE standard', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42006, name: 'HERE fleet', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42007, name: 'HERE flame', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42008, name: 'HERE mini', orgproductionendyear: 2016 }));
            newMaps.push(new HaMap({ id: 42009, name: 'HERE aerial', orgproductionendyear: 2016 }));
        }
        this.maps = newMaps;
    };
    HaMaps.prototype.updateInView = function (extent, param) {
        var _this = this;
        if (param === void 0) { param = '.inView'; }
        //var zoom2 = App.map.getView().getZoom();
        var res = App.map.getView().getResolution();
        var w = (20037508.34 * 2) / 256;
        var zoom = Math.log(w / res) / Math.LN2;
        this.maps.forEach(function (map) {
            var prop = 'maps.' + _this.maps.indexOf(map) + param;
            if (!(extent[0] < map.maxLon && extent[1] < map.maxLat && extent[2] > map.minLon && extent[3] > map.minLat))
                _this.set(prop, false);
            else
                _this.set(prop, zoom < map.maxZ && zoom > map.minZ);
        });
    };
    //public static initMainMapId: number = 161; //Was 51
    HaMaps.initTimeWarpMapId = 80;
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaMaps.prototype, "maps", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], HaMaps.prototype, "mainMap", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], HaMaps.prototype, "timeWarpMap", void 0);
    HaMaps = __decorate([
        component("ha-maps"), 
        __metadata('design:paramtypes', [])
    ], HaMaps);
    return HaMaps;
}(polymer.Base));
HaMaps.register();
//# sourceMappingURL=ha-maps.js.map