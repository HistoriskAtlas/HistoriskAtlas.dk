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
var HorizontalTagList = (function (_super) {
    __extends(HorizontalTagList, _super);
    function HorizontalTagList() {
        _super.apply(this, arguments);
    }
    HorizontalTagList.prototype.addTagTap = function () {
        this.addingTag = !this.addingTag;
        if (!this.addingTag) {
            App.mainMenu['panel' + this.menu].tagsServiceAwaitingTagSelect = null;
            return;
        }
        App.mainMenu.drawerOpen = true;
        App.mainMenu['showMenu' + this.menu + 's'] = true;
        App.mainMenu['panel' + this.menu].tagsServiceAwaitingTagSelect = this.tagsService;
        App.toast.show('Vælg fra listen');
    };
    HorizontalTagList.prototype.removeTagTap = function (e) {
        this.tagsService.removeTag(this.$.tagRepeater.itemForElement(e.target));
    };
    HorizontalTagList.prototype.togglePrimaryTagTap = function (e) {
        var tag = this.$.tagRepeater.itemForElement(e.target);
        tag = this.primary(tag) ? null : tag;
        this.tagsService.setPrimaryTag(tag);
        this.set('localPrimaryTag', tag);
    };
    HorizontalTagList.prototype.showSetPrimaryTag = function () {
        return this.tagsService instanceof HaGeoService;
    };
    HorizontalTagList.prototype.primary = function (tag) {
        if (!(this.tagsService instanceof HaGeoService))
            return false;
        if (!this.tagsService.geo.primaryTagStatic)
            return false;
        return this.tagsService.geo.primaryTag == tag;
    };
    HorizontalTagList.prototype.togglePrimaryText = function (tag) {
        return (this.primary(tag) ? 'Frav' : 'V') + 'ælg som primær';
    };
    HorizontalTagList.prototype.tagsLengthChanged = function () {
        this.addingTag = false;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], HorizontalTagList.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], HorizontalTagList.prototype, "menu", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], HorizontalTagList.prototype, "tags", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HorizontalTagList.prototype, "editing", void 0);
    __decorate([
        property({ type: Object, value: {} }), 
        __metadata('design:type', HaTag)
    ], HorizontalTagList.prototype, "localPrimaryTag", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], HorizontalTagList.prototype, "addingTag", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HorizontalTagList.prototype, "tagsService", void 0);
    __decorate([
        observe('tags.length'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HorizontalTagList.prototype, "tagsLengthChanged", null);
    HorizontalTagList = __decorate([
        component("horizontal-tag-list"), 
        __metadata('design:paramtypes', [])
    ], HorizontalTagList);
    return HorizontalTagList;
}(polymer.Base));
HorizontalTagList.register();
//# sourceMappingURL=horizontal-tag-list.js.map