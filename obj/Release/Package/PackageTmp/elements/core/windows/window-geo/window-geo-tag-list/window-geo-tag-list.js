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
var WindowGeoTagList = (function (_super) {
    __extends(WindowGeoTagList, _super);
    function WindowGeoTagList() {
        _super.apply(this, arguments);
    }
    WindowGeoTagList.prototype.addTagTap = function () {
        this.addingTag = !this.addingTag;
        if (!this.addingTag) {
            App.mainMenu['panel' + this.menu].haGeoServiceAwaitingTagSelect = null;
            return;
        }
        App.mainMenu.drawerOpen = true;
        App.mainMenu['showMenu' + this.menu + 's'] = true;
        App.mainMenu['panel' + this.menu].haGeoServiceAwaitingTagSelect = this.domHost.$.haGeoService;
        App.toast.show('Vælg fra listen');
    };
    WindowGeoTagList.prototype.removeTagTap = function (e) {
        this.domHost.$.haGeoService.removeTag(e.model.dataHost.dataHost.tag);
    };
    WindowGeoTagList.prototype.tagsLengthChanged = function () {
        this.addingTag = false;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], WindowGeoTagList.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], WindowGeoTagList.prototype, "menu", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowGeoTagList.prototype, "tags", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeoTagList.prototype, "editing", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowGeoTagList.prototype, "addingTag", void 0);
    __decorate([
        observe('tags.length'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeoTagList.prototype, "tagsLengthChanged", null);
    WindowGeoTagList = __decorate([
        component("window-geo-tag-list"), 
        __metadata('design:paramtypes', [])
    ], WindowGeoTagList);
    return WindowGeoTagList;
}(polymer.Base));
WindowGeoTagList.register();
//# sourceMappingURL=window-geo-tag-list.js.map