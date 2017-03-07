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
var HaDigDag = (function (_super) {
    __extends(HaDigDag, _super);
    function HaDigDag() {
        _super.apply(this, arguments);
    }
    HaDigDag.prototype.ready = function () {
        this.$.ajax.url = Common.api + 'regiontypecategory.json?v=1&count=all&parentid=0&schema={regiontypecategory:[id,name,{regiontypes:[regiontypeid,name,periodstart,periodend]}]}';
    };
    HaDigDag.prototype.getData = function () {
        var digdagJSON = LocalStorage.get('ha-digdag', 7 * 24);
        if (digdagJSON) {
            var data = JSON.parse(digdagJSON);
            if (data instanceof Array) {
                this.handleData(data);
                return;
            }
        }
        this.$.ajax.generateRequest();
    };
    HaDigDag.prototype.handleResponse = function () {
        LocalStorage.set('ha-digdag', JSON.stringify(this.$.ajax.lastResponse.data), true);
        this.handleData(this.$.ajax.lastResponse.data);
    };
    HaDigDag.prototype.handleData = function (data) {
        var result = [];
        data.forEach(function (data) {
            var regionTypeCategory = new HARegionTypeCategory(data);
            result.push(regionTypeCategory);
        });
        this.digdags = result;
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaDigDag.prototype, "digdags", void 0);
    HaDigDag = __decorate([
        component("ha-digdag"), 
        __metadata('design:paramtypes', [])
    ], HaDigDag);
    return HaDigDag;
}(polymer.Base));
HaDigDag.register();
//# sourceMappingURL=ha-digdag.js.map