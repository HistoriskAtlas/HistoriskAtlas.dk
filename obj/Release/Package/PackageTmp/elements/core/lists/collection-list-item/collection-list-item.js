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
var CollectionListItem = (function (_super) {
    __extends(CollectionListItem, _super);
    function CollectionListItem() {
        _super.apply(this, arguments);
    }
    //@property({ type: Boolean })
    //public dragable: boolean;
    //closeTap(e: any) {
    //    this.fire('close', this.tag);
    //}
    CollectionListItem.prototype.formatDistance = function (distance) {
        return HaCollection.formatDistance(distance);
    };
    CollectionListItem.prototype.checkboxTap = function (e) {
        this.set('collection.selected', !this.collection.selected);
        e.cancelBubble = true;
        e.stopPropagation();
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaTag)
    ], CollectionListItem.prototype, "collection", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], CollectionListItem.prototype, "open", void 0);
    CollectionListItem = __decorate([
        component("collection-list-item"), 
        __metadata('design:paramtypes', [])
    ], CollectionListItem);
    return CollectionListItem;
}(polymer.Base));
CollectionListItem.register();
//# sourceMappingURL=collection-list-item.js.map