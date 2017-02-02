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
var HaLicenses = (function (_super) {
    __extends(HaLicenses, _super);
    function HaLicenses() {
        _super.apply(this, arguments);
    }
    HaLicenses.prototype.ready = function () {
        this.licenses = [];
        this.byTagID = [];
        this.add(new HaLicens(80, 'Copyright', 'https://www.retsinformation.dk/Forms/R0710.aspx?id=164796'));
        this.add(new HaLicens(271, 'Navngivelse-IkkeKommerciel-IngenBearbejdelse', 'http://creativecommons.org/licenses/by-nc-nd/2.5/dk/'));
        this.add(new HaLicens(270, 'Navngivelse-IkkeKommerciel–DelPåSammeVilkår', 'http://creativecommons.org/licenses/by-nc-sa/2.5/dk/'));
        this.add(new HaLicens(268, 'Navngivelse-IngenBearbejdelse', 'http://creativecommons.org/licenses/by-nd/2.5/dk/'));
        this.add(new HaLicens(269, 'Navngivelse-IkkeKommerciel', 'http://creativecommons.org/licenses/by-nc/2.5/dk/'));
        this.add(new HaLicens(267, 'Navngivelse-DelPåSammeVilkår', 'http://creativecommons.org/licenses/by-sa/2.5/dk/'));
        this.add(new HaLicens(63, 'Navngivelse', 'http://creativecommons.org/licenses/by/2.5/dk/'));
        this.add(new HaLicens(79, 'Public domain', 'https://creativecommons.org/about/pdm'));
    };
    HaLicenses.prototype.add = function (licens) {
        this.licenses.push(licens);
        this.byTagID[licens.tagID] = licens;
    };
    __decorate([
        property({ type: Object, value: null, notify: true }), 
        __metadata('design:type', Array)
    ], HaLicenses.prototype, "licenses", void 0);
    HaLicenses = __decorate([
        component("ha-licenses"), 
        __metadata('design:paramtypes', [])
    ], HaLicenses);
    return HaLicenses;
}(polymer.Base));
HaLicenses.register();
