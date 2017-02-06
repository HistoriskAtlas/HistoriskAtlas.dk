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
var CollectionList = (function (_super) {
    __extends(CollectionList, _super);
    function CollectionList() {
        _super.apply(this, arguments);
    }
    CollectionList.prototype.toggleShown = function (e) {
        var topLevel = e.model.topLevel;
        this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.shown', !topLevel.shown);
    };
    CollectionList.prototype.isSpacer = function (topLevel) {
        return topLevel.name == 'spacer';
    };
    CollectionList.prototype.collectionTap = function (e) {
        App.haCollections.select(e.model.collection);
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], CollectionList.prototype, "topLevels", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], CollectionList.prototype, "collections", void 0);
    CollectionList = __decorate([
        component("collection-list"), 
        __metadata('design:paramtypes', [])
    ], CollectionList);
    return CollectionList;
}(polymer.Base));
CollectionList.register();
