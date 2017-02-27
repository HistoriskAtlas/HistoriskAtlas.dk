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
var WindowSearch = (function (_super) {
    __extends(WindowSearch, _super);
    function WindowSearch(search) {
        _super.call(this);
        this.search = search;
        this.doSearch();
    }
    WindowSearch.prototype.doSearch = function () {
        var _this = this;
        this.addresses = [];
        $.getJSON("http://nominatim.openstreetmap.org/search?q=" + this.search + "&format=json&addressdetails=1&countrycodes=dk&email=it@historiskatlas.dk", function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var place = data_1[_i];
                if (place.address) {
                    var address = new Address();
                    address.lat = parseFloat(place.lat);
                    address.lng = parseFloat(place.lon);
                    address.title = '';
                    if (place.address.road) {
                        address.title += place.address.road;
                        if (place.address.house_number)
                            address.title += ' ' + place.address.house_number;
                    }
                    var types = [];
                    for (var _a = 0, _b = ['hamlet', 'village', 'town', 'city']; _a < _b.length; _a++) {
                        var type = _b[_a];
                        if (place.address[type])
                            types.push(place.address[type]);
                    }
                    if (types.length > 0)
                        address.title += (address.title.length > 0 ? ', ' : '') + types.join(', ');
                    for (var _c = 0, _d = _this.addresses; _c < _d.length; _c++) {
                        var otherAddress = _d[_c];
                        if (otherAddress.title == address.title) {
                            address.title = '';
                            break;
                        }
                    }
                    if (address.title.length == 0)
                        continue;
                    _this.push('addresses', address);
                }
            }
        });
    };
    WindowSearch.prototype.geoTap = function (e) {
        var geo = e.model.geo;
        Common.dom.append(WindowGeo.create(geo));
        App.map.centerAnim(geo.coord, 1000, true);
    };
    WindowSearch.prototype.addressTap = function (e) {
        var address = e.model.address;
        App.map.centerAnim([address.lng, address.lat], 1000);
        this.$.windowbasic.close();
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], WindowSearch.prototype, "search", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowSearch.prototype, "addresses", void 0);
    WindowSearch = __decorate([
        component("window-search"), 
        __metadata('design:paramtypes', [String])
    ], WindowSearch);
    return WindowSearch;
}(polymer.Base));
var Address = (function () {
    function Address() {
    }
    return Address;
}());
WindowSearch.register();
//# sourceMappingURL=window-search.js.map