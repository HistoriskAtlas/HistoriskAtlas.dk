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
var PanelPublication = (function (_super) {
    __extends(PanelPublication, _super);
    function PanelPublication() {
        _super.apply(this, arguments);
    }
    PanelPublication.prototype.addTap = function () {
        var _this = this;
        var existingTagIds = [];
        for (var _i = 0, _a = this.destinations; _i < _a.length; _i++) {
            var destination = _a[_i];
            existingTagIds.push(destination.id);
        }
        Services.get('tag', { schema: JSON.stringify({ tag: { fields: [{ collapse: 'id' }], filters: [{ parents: [{ id: App.haUsers.user.currentInstitution.tagid }] }] } }), categori: 8, count: 'all' }, function (result) {
            var tags = [];
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var tagid = _a[_i];
                if (existingTagIds.indexOf(tagid) == -1)
                    tags.push(App.haTags.byId[tagid]);
            }
            Common.dom.append(DialogTagSelection.create('Tilføj publiceringsdestionation', tags, function (tag) {
                _this.tagsService.addTag(tag, true, true);
            }));
        });
    };
    PanelPublication.prototype.removeTag = function (e) {
        this.tagsService.removeTag(e.detail);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelPublication.prototype, "destinations", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Tags)
    ], PanelPublication.prototype, "tagsService", void 0);
    __decorate([
        listen('close'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelPublication.prototype, "removeTag", null);
    PanelPublication = __decorate([
        component("panel-publication"), 
        __metadata('design:paramtypes', [])
    ], PanelPublication);
    return PanelPublication;
}(polymer.Base));
PanelPublication.register();
//# sourceMappingURL=panel-publication.js.map