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
    CollectionList.prototype.ready = function () {
        CollectionList.collectionLists.push(this); //TODO: remove again?
    };
    CollectionList.prototype.toggleShown = function (e) {
        var topLevel = e.model.topLevel;
        this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.shown', !topLevel.shown);
    };
    CollectionList.prototype.isSpacer = function (topLevel) {
        return topLevel.name == 'spacer';
    };
    CollectionList.prototype.isOpen = function (openCollection, collection) {
        return openCollection == collection;
    };
    CollectionList.prototype.collectionTap = function (e) {
        App.haCollections.select(e.model.item);
    };
    CollectionList.prototype.checkboxTap = function (e) {
        var topLevel = e.model.topLevel;
        //this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.selected', !topLevel.selected);
        CollectionList.ignoreCollectionChanges = true;
        for (var _i = 0, _a = this.collections; _i < _a.length; _i++) {
            var collection = _a[_i];
            if (topLevel.filter(collection))
                this.set('collections.' + this.collections.indexOf(collection) + '.selected', !topLevel.selected);
        }
        CollectionList.ignoreCollectionChanges = false;
        for (var _b = 0, _c = CollectionList.collectionLists; _b < _c.length; _b++) {
            var list = _c[_b];
            list.updateTopLevelSelections();
        }
        e.cancelBubble = true;
        e.stopPropagation();
    };
    CollectionList.prototype.collectionsChanged = function (changeRecord) {
        if (CollectionList.ignoreCollectionChanges)
            return;
        var path = changeRecord.path.split('.');
        if (path.length != 3)
            return;
        if (path[2] != 'selected')
            return;
        this.updateTopLevelSelections();
    };
    CollectionList.prototype.collectionsSplices = function () {
        if (this.collections.length > 0)
            this.updateTopLevelSelections();
    };
    CollectionList.prototype.updateTopLevelSelections = function () {
        var topLevels = [];
        for (var _i = 0, _a = this.topLevels; _i < _a.length; _i++) {
            var topLevel = _a[_i];
            if (topLevel.filter) {
                topLevels.push(topLevel);
                topLevel.countSelected = 0;
                topLevel.countTotal = 0;
            }
        }
        for (var _b = 0, _c = this.collections; _b < _c.length; _b++) {
            var collection = _c[_b];
            for (var _d = 0, topLevels_1 = topLevels; _d < topLevels_1.length; _d++) {
                var topLevel = topLevels_1[_d];
                if (topLevel.filter(collection)) {
                    topLevel.countTotal++;
                    if (collection.selected)
                        topLevel.countSelected++;
                }
            }
        }
        for (var _e = 0, topLevels_2 = topLevels; _e < topLevels_2.length; _e++) {
            var topLevel = topLevels_2[_e];
            this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.selected', topLevel.countTotal == 0 ? false : topLevel.countSelected == topLevel.countTotal);
        }
    };
    CollectionList.ignoreCollectionChanges = false;
    CollectionList.collectionLists = [];
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], CollectionList.prototype, "topLevels", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], CollectionList.prototype, "collections", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], CollectionList.prototype, "collection", void 0);
    __decorate([
        observe('collections.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CollectionList.prototype, "collectionsChanged", null);
    __decorate([
        observe('collections.splices'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], CollectionList.prototype, "collectionsSplices", null);
    CollectionList = __decorate([
        component("collection-list"), 
        __metadata('design:paramtypes', [])
    ], CollectionList);
    return CollectionList;
}(polymer.Base));
CollectionList.register();
//# sourceMappingURL=collection-list.js.map