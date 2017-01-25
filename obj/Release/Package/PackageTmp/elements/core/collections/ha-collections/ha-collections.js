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
var HaCollections = (function (_super) {
    __extends(HaCollections, _super);
    function HaCollections() {
        _super.apply(this, arguments);
        this.collections = [];
    }
    HaCollections.prototype.getCollectionsFromUser = function () {
        var _this = this;
        Services.get('collection', { count: 'all', schema: '{collection:[collectionid,title,{userid:' + App.haUsers.user.id + '}]}' }, function (result) {
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                _this.push('collections', new HaCollection(data));
            }
        });
    };
    HaCollections.prototype.select = function (collection, addGeo) {
        this.$.selector.select(collection);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }
    };
    HaCollections.prototype.deselect = function (collection) {
        this.$.selector.deselect(collection);
    };
    HaCollections.prototype.newRoute = function (geo) {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv titel på rute', function (title) { return _this.newCollection(title, geo); }));
    };
    HaCollections.prototype.newCollection = function (title, geo) {
        var _this = this;
        var collection = new HaCollection({ title: title });
        this.push('collections', collection);
        this.select(collection);
        collection.save(function () {
            if (geo) {
                _this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
        return collection;
    };
    HaCollections.prototype.collectionChanged = function () {
        var _this = this;
        if (!this.collection)
            return;
        if (this.collection.geos.length > 0 || !this.collection.id)
            return;
        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this.collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, function (result) {
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                var geo = App.haGeos.geos[data.geoid];
                if (!geo)
                    continue;
                geo.title = data.title;
                _this.push('collection.geos', geo);
            }
        });
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaCollections.prototype, "collections", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], HaCollections.prototype, "collection", void 0);
    __decorate([
        observe('collection'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "collectionChanged", null);
    HaCollections = __decorate([
        component("ha-collections"), 
        __metadata('design:paramtypes', [])
    ], HaCollections);
    return HaCollections;
}(polymer.Base));
HaCollections.register();
