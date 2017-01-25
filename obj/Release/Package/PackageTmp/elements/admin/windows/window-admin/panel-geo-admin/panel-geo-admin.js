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
var PanelGeoAdmin = (function (_super) {
    __extends(PanelGeoAdmin, _super);
    function PanelGeoAdmin() {
        _super.apply(this, arguments);
    }
    PanelGeoAdmin.prototype.selectedChanged = function () {
        if (this.selected && !this.geos) {
            this.geos = [];
            this.sortOnTitle();
            this.fetchGeos();
        }
    };
    PanelGeoAdmin.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchGeos();
    };
    PanelGeoAdmin.prototype.fetchGeos = function () {
        var _this = this;
        Services.get('geo', {
            'schema': '{geo:{' + (this.filter ? 'filters:{title:{like:' + this.filter + '}},' : '') + 'fields:[id,title,created,{tag_geos:[{tag:[plurname,{category:3}]}]},{user:[login,firstname,lastname]}]}}',
            'count': '100'
        }, function (result) {
            _this.updateGeos(result.data);
        });
    };
    PanelGeoAdmin.prototype.updateGeos = function (newList) {
        this.$.admin.sort(null, newList);
    };
    PanelGeoAdmin.prototype.itemTap = function (e) {
        this.$.admin.select(e.model.item);
    };
    PanelGeoAdmin.prototype.getGeo = function () {
        var _this = this;
        if (!this.geo)
            return;
        Services.get('geo', {
            'schema': '{geo:[title,intro,online]}',
            'id': this.geo.id
        }, function (result) {
            for (var attr in result.data[0])
                _this.set('geo.' + attr, result.data[0][attr]);
        });
    };
    PanelGeoAdmin.prototype.onlineClass = function (online) {
        if (online == null)
            return '';
        return online ? 'online' : 'offline';
    };
    PanelGeoAdmin.prototype.formatDate = function (date) {
        return Common.formatDate(date);
    };
    PanelGeoAdmin.prototype.formatInstitutions = function (tag_geos) {
        var institutions = [];
        for (var _i = 0, tag_geos_1 = tag_geos; _i < tag_geos_1.length; _i++) {
            var tag_geo = tag_geos_1[_i];
            if (tag_geo.tag.category == 3)
                institutions.push(tag_geo.tag.plurname);
        }
        return institutions.join(', ');
    };
    PanelGeoAdmin.prototype.isInstitutionCaetgory = function (category) {
        return category == 3;
    };
    PanelGeoAdmin.prototype.titleTap = function () {
        Common.geoClick(this.geo.id);
    };
    PanelGeoAdmin.prototype.sortOnId = function () {
        this.$.admin.sort(this.compareId);
    };
    PanelGeoAdmin.prototype.compareId = function (a, b) {
        return a.id - b.id;
    };
    PanelGeoAdmin.prototype.sortOnTitle = function () {
        this.$.admin.sort(this.compareTitle);
    };
    PanelGeoAdmin.prototype.compareTitle = function (a, b) {
        return a.title.localeCompare(b.title);
    };
    PanelGeoAdmin.prototype.sortOnUser = function () {
        this.$.admin.sort(this.compareUser);
    };
    PanelGeoAdmin.prototype.compareUser = function (a, b) {
        return (a.user.firstname + a.user.lastname).localeCompare(b.user.firstname + b.user.lastname);
    };
    PanelGeoAdmin.prototype.sortOnDate = function () {
        this.$.admin.sort(this.compareDate);
    };
    PanelGeoAdmin.prototype.compareDate = function (a, b) {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
    };
    PanelGeoAdmin.prototype.sortOnInstitution = function () {
        this.$.admin.sort(this.compareInstitution);
    };
    PanelGeoAdmin.prototype.compareInstitution = function (a, b) {
        var objA = a.tag_geos.find(function (obj) { return obj.tag.category == 3; });
        var objB = b.tag_geos.find(function (obj) { return obj.tag.category == 3; });
        var aName = objA ? objA.tag.plurname : '';
        var bName = objB ? objB.tag.plurname : '';
        return aName.localeCompare(bName);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelGeoAdmin.prototype, "geos", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], PanelGeoAdmin.prototype, "geo", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelGeoAdmin.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelGeoAdmin.prototype, "selected", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelGeoAdmin.prototype, "selectedChanged", null);
    __decorate([
        observe('geo'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelGeoAdmin.prototype, "getGeo", null);
    PanelGeoAdmin = __decorate([
        component("panel-geo-admin"), 
        __metadata('design:paramtypes', [])
    ], PanelGeoAdmin);
    return PanelGeoAdmin;
}(polymer.Base));
PanelGeoAdmin.register();
