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
var HaImageService = (function (_super) {
    __extends(HaImageService, _super);
    function HaImageService() {
        _super.apply(this, arguments);
    }
    //ready() {
    //    this.$.ajax.url = Common.api + 'geo.json';
    //}
    HaImageService.prototype.imageChanged = function () {
        this.initTags('image' /*, this.image.id*/);
    };
    HaImageService.prototype.textChanged = function () {
        Services.update('image', { id: this.image.id, text: this.image.text });
    };
    HaImageService.prototype.yearChanged = function () {
        Services.update('image', { id: this.image.id, year: this.image.year });
    };
    HaImageService.prototype.licenseeChanged = function () {
        Services.update('image', { id: this.image.id, licensee: this.image.licensee });
    };
    HaImageService.prototype.photographerChanged = function () {
        Services.update('image', { id: this.image.id, photographer: this.image.photographer });
    };
    HaImageService.prototype.deleteImage = function () {
        var _this = this;
        Services.delete('image', { id: this.image.id }, function (result) {
            App.toast.show('Billedet blev slettet.');
            _this.parentNode.windowGeo.splice('geo.images', _this.geo.images.indexOf(_this.image), 1); //TODO: might be easier to stop spawning windom-image dynamically
        }, function (result) {
            App.toast.show('Billedet blev IKKE slettet. Muligvis pga. manglende rettigheder.');
        });
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HAImage)
    ], HaImageService.prototype, "image", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaImageService.prototype, "geo", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HaImageService.prototype, "editing", void 0);
    __decorate([
        observe("image"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaImageService.prototype, "imageChanged", null);
    __decorate([
        observe("image.text"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaImageService.prototype, "textChanged", null);
    __decorate([
        observe("image.year"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaImageService.prototype, "yearChanged", null);
    __decorate([
        observe("image.licensee"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaImageService.prototype, "licenseeChanged", null);
    __decorate([
        observe("image.photographer"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaImageService.prototype, "photographerChanged", null);
    HaImageService = __decorate([
        component("ha-image"), 
        __metadata('design:paramtypes', [])
    ], HaImageService);
    return HaImageService;
}(Tags));
HaImageService.register();
//# sourceMappingURL=ha-image.js.map