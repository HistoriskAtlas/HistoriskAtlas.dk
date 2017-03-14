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
var TagListItem = (function (_super) {
    __extends(TagListItem, _super);
    function TagListItem() {
        _super.apply(this, arguments);
    }
    //@property({ type: Boolean })
    //public dragable: boolean;
    TagListItem.prototype.closeTap = function (e) {
        this.fire('close', this.tag);
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaTag)
    ], TagListItem.prototype, "tag", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TagListItem.prototype, "closeable", void 0);
    TagListItem = __decorate([
        component("tag-list-item"), 
        __metadata('design:paramtypes', [])
    ], TagListItem);
    return TagListItem;
}(polymer.Base));
TagListItem.register();
//# sourceMappingURL=tag-list-item.js.map