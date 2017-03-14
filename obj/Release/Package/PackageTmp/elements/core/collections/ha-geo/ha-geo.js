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
var HaGeoService = (function (_super) {
    __extends(HaGeoService, _super);
    function HaGeoService() {
        _super.apply(this, arguments);
        this.ignoreChanges = true;
    }
    //@property({ type: Number, notify: true })
    //public noMissingTags: number;
    HaGeoService.prototype.ready = function () {
        this.$.ajax.url = Common.api + 'geo.json';
    };
    HaGeoService.prototype.geoChanged = function (newVal, oldVal) {
        this.initTags('geo' /*, this.geo.id*/);
        if (!this.geo.id)
            return;
        this.ignoreChanges = true;
        var schema = 'geoid,title,intro,primarytagstatic,freetags,yearstart,yearend,latitude,longitude,online,views,deleted,{user:[id,firstname,lastname,{user_institutions:[{institution:[id,tagid]}]}]},{geo_image:[empty,ordering,{image:[imageid,text,year,yearisapprox,photographer,licensee,userid,{tag_images:[' + (typeof App == 'undefined' ? Common.apiSchemaTags : '{collapse:id}') + ']}]}]}';
        if (this.geo.tags.length == 0)
            schema += ',{tag_geos:[' + Common.apiSchemaTags + ']}'; //TODO: only needed to get ids when in app mode.............................
        //schema += ',{tag_geos:[empty,{collapse:tagid}]}'
        this.set('params', {
            'v': 1,
            'sid': document.sid,
            'geoid': this.geo.id,
            'schema': '{geo:[' + schema + ']}'
        });
        this.$.ajax.generateRequest();
    };
    HaGeoService.prototype.titleChanged = function (newVal) {
        this.notifyPath('geo.link', this.geo.link);
        if (newVal && !this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, title: this.geo.title }, function () {
            });
    };
    HaGeoService.prototype.introChanged = function (newVal) {
        if (newVal && !this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, intro: this.geo.intro }, function () {
                //App.toast.show('Introtekst gemt');
            });
    };
    HaGeoService.prototype.onlineChanged = function () {
        var _this = this;
        if (!this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, online: this.geo.online }, function () {
                _this.geo.icon.updateStyle();
                App.toast.show('Fortællingen er nu ' + (_this.geo.online ? '' : 'af') + 'publiceret');
            });
    };
    HaGeoService.prototype.imagesArrayChanged = function (change) {
        if (this.ignoreChanges || !change)
            return;
        for (var _i = 0, _a = change.indexSplices; _i < _a.length; _i++) {
            var indexSplice = _a[_i];
            //for (var image of indexSplice.removed)
            //    Services.delete('geo_image', { imageid: image.id, geoid: this.geo.id });
            for (var i = 0; i < indexSplice.addedCount; i++)
                Services.insert('geo_image', { imageid: this.geo.images[indexSplice.index + i].id, geoid: this.geo.id, ordering: 0 }); //TODO: ordering?§!
        }
    };
    HaGeoService.prototype.tagsArrayChanged = function (change) {
        if (this.ignoreChanges || !change)
            return;
        var primaryTagRemoved = false;
        if (change.indexSplices[0].removed.length > 0)
            if (change.indexSplices[0].removed[0] == this.geo.primaryTag) {
                this.set('geo.primaryTagStatic', false);
                primaryTagRemoved = true;
            }
        if (!this.geo.primaryTagStatic || primaryTagRemoved) {
            var oldPrimaryTag = this.geo.primaryTag;
            var newPrimaryTag = this.geo.getNewPrimaryTag;
            if (oldPrimaryTag != newPrimaryTag)
                this.set('geo.primaryTag', newPrimaryTag);
        }
        //this.geo.primaryTag = this.geo.getNewPrimaryTag;
        //if (oldPrimaryTag != this.geo.primaryTag) {
        //    this.geo.icon.updateStyle();
        //    if (this.geo.primaryTag) //TODO: Fix bug on API... how to set value to NULL?.......................................
        //        Services.update('geo', { primarytagid: this.geo.primaryTag.id, geoid: this.geo.id });
        //}
    };
    HaGeoService.prototype.setPrimaryTag = function (tag) {
        this.set('geo.primaryTag', tag);
        if (!this.geo.primaryTagStatic) {
            this.set('geo.primaryTagStatic', true);
        }
    };
    HaGeoService.prototype.primaryTagChanged = function () {
        if (this.ignoreChanges)
            return;
        this.geo.icon.updateStyle();
        Services.update('geo', { primarytagid: this.geo.primaryTag ? this.geo.primaryTag.id : '\0', geoid: this.geo.id });
    };
    HaGeoService.prototype.primaryTagStaticChanged = function () {
        if (this.ignoreChanges)
            return;
        Services.update('geo', { primarytagstatic: this.geo.primaryTagStatic, geoid: this.geo.id });
    };
    HaGeoService.prototype.handleResponse = function () {
        this.ignoreChanges = true;
        var data = this.$.ajax.lastResponse.data[0];
        if (typeof App == 'undefined')
            this.set('geo.shown', true);
        //TODO: check if already sat?
        this.set('geo.title', data.title);
        this.set('geo.intro', data.intro);
        this.set('geo.user', new HAUser(data.user));
        this.set('geo.primaryTagStatic', data.primarytagstatic);
        if (data.tag_geos)
            for (var _i = 0, _a = data.tag_geos; _i < _a.length; _i++) {
                var tag_geo = _a[_i];
                this.addTag(typeof App == 'undefined' ? new HaTag(tag_geo.tag) : App.haTags.byId[tag_geo.tag.tagid], true, false);
            }
        //this.addTagById(tagID, true, false);
        var images = [];
        for (var i = 0; i < data.geo_image.length; i++)
            images.push(new HAImage(data.geo_image[i].image));
        this.set('geo.images', images); //data.geo_images.length == 0 ? [113798] : [data.geo_images[0].id]
        this.ignoreChanges = false; //!this.editing;
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], HaGeoService.prototype, "geo", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaGeoService.prototype, "params", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HaGeoService.prototype, "editing", void 0);
    __decorate([
        observe("geo"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number, Number]), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "geoChanged", null);
    __decorate([
        observe("geo.title"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String]), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "titleChanged", null);
    __decorate([
        observe("geo.intro"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String]), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "introChanged", null);
    __decorate([
        observe("geo.online"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "onlineChanged", null);
    __decorate([
        observe("geo.images.splices"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [ChangeRecord]), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "imagesArrayChanged", null);
    __decorate([
        observe("geo.tags.splices"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [ChangeRecord]), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "tagsArrayChanged", null);
    __decorate([
        observe("geo.primaryTag"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "primaryTagChanged", null);
    __decorate([
        observe("geo.primaryTagStatic"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeoService.prototype, "primaryTagStaticChanged", null);
    HaGeoService = __decorate([
        component("ha-geo"), 
        __metadata('design:paramtypes', [])
    ], HaGeoService);
    return HaGeoService;
}(Tags));
HaGeoService.register();
//# sourceMappingURL=ha-geo.js.map