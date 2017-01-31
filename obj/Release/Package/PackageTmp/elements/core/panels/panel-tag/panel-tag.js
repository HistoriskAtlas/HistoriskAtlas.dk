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
var PanelTag = (function (_super) {
    __extends(PanelTag, _super);
    function PanelTag() {
        _super.apply(this, arguments);
    }
    PanelTag.prototype.includeTag = function (tag) {
        return tag.isTop && tag.category == this.tagCategory;
    };
    PanelTag.prototype.sortFunction = function (tagCategory) {
        return tagCategory == 9 ? 'sortByPlurName' : 'sortByYear';
    };
    PanelTag.prototype.hideArrow = function (tag) {
        return tag.hasChildren ? '' : 'visibility:hidden';
    };
    PanelTag.prototype.sortByPlurName = function (tag1, tag2) {
        return tag1.plurName.localeCompare(tag2.plurName);
    };
    PanelTag.prototype.sortByYear = function (tag1, tag2) {
        return tag1.yearStart - tag2.yearStart;
    };
    PanelTag.prototype.tagTap = function (e) {
        if (this._tagTap(e.model.tag))
            return;
        e.model.set('tag.selected', !e.model.tag.selected);
    };
    PanelTag.prototype.subTagTap = function (e) {
        if (this._tagTap(e.model.subTag))
            return;
        e.model.set('subTag.selected', !e.model.subTag.selected);
    };
    PanelTag.prototype._tagTap = function (tag) {
        if (this.haGeoServiceAwaitingTagSelect) {
            if (this.haGeoServiceAwaitingTagSelect.addTag(tag, true, true))
                this.haGeoServiceAwaitingTagSelect = null;
            else
                App.toast.show('"' + tag.plurName + '" er allerede tilføjet. Vælg en anden.');
            return true;
        }
        return false;
    };
    PanelTag.prototype.cancel = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
    };
    PanelTag.prototype.buttonAllTap = function () {
        this.toggle(true);
    };
    PanelTag.prototype.buttonNoneTap = function () {
        this.toggle(false);
    };
    PanelTag.prototype.toggle = function (selected) {
        IconLayer.updateDisabled = true;
        //App.haTags.tags.forEach((tag: HaTag) => {
        //    if (tag.isTop)
        //        if (tag.category == this.tagCategory)
        //            tag.selected = selected;
        //});
        HaTags.tagTop[this.tagCategory].selected = selected;
        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], PanelTag.prototype, "tags", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PanelTag.prototype, "tagCategory", void 0);
    __decorate([
        listen("buttonAll.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTag.prototype, "buttonAllTap", null);
    __decorate([
        listen("buttonNone.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTag.prototype, "buttonNoneTap", null);
    PanelTag = __decorate([
        component("panel-tag"), 
        __metadata('design:paramtypes', [])
    ], PanelTag);
    return PanelTag;
}(polymer.Base));
PanelTag.register();
//# sourceMappingURL=panel-tag.js.map