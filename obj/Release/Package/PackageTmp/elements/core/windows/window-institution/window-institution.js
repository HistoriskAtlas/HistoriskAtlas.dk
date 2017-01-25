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
var WindowInstitution = (function (_super) {
    __extends(WindowInstitution, _super);
    function WindowInstitution(tag) {
        var _this = this;
        _super.call(this);
        this.institution = new HAInstitution({ tagid: tag.id });
        Services.get('institution', {
            schema: '{institution:[id,url,type,tagid,' + ContentViewer.contentSchema + ']}',
            tagid: tag.id
        }, function (data) {
            _this.institution = new HAInstitution(data.data[0]);
        });
    }
    WindowInstitution.prototype.formatUrl = function (url) {
        if (!url)
            return null;
        if (url.indexOf('http') != 0)
            return 'http://' + url;
        return url;
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAInstitution)
    ], WindowInstitution.prototype, "institution", void 0);
    WindowInstitution = __decorate([
        component("window-institution"), 
        __metadata('design:paramtypes', [HaTag])
    ], WindowInstitution);
    return WindowInstitution;
}(polymer.Base));
WindowInstitution.register();
