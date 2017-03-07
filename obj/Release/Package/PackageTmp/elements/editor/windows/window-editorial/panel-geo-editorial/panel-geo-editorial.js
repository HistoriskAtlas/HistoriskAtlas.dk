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
var PanelGeoEditorial = (function (_super) {
    __extends(PanelGeoEditorial, _super);
    function PanelGeoEditorial() {
        _super.apply(this, arguments);
    }
    PanelGeoEditorial.prototype.selectedChanged = function () {
        if (this.selected && !this.geos) {
            this.geos = [];
            this.sortOnTitle();
            this.fetchGeos();
        }
    };
    PanelGeoEditorial.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchGeos();
    };
    PanelGeoEditorial.prototype.fetchGeos = function () {
        var _this = this;
        Services.get('geo', {
            'schema': JSON.stringify({
                geo: {
                    fields: [
                        'id',
                        'title',
                        'online',
                        'created',
                        {
                            user: [
                                'firstname',
                                'lastname'
                            ]
                        },
                        {
                            tag_geos: [
                                'empty',
                                {
                                    collapse: 'tagid'
                                }
                            ]
                        }
                    ],
                    filters: {
                        user: [
                            {
                                userhierarkis1: [
                                    {
                                        parentid: App.haUsers.user.id
                                    }
                                ]
                            }
                        ],
                        title: {
                            like: this.filter
                        }
                    }
                }
            }),
            'count': 'all'
        }, function (result) {
            _this.updateGeos(result.data);
        });
    };
    PanelGeoEditorial.prototype.updateGeos = function (newList) {
        if (newList === void 0) { newList = null; }
        this.$.selector.sort(null, newList);
    };
    PanelGeoEditorial.prototype.formatDate = function (date) {
        return Common.formatDate(date);
    };
    PanelGeoEditorial.prototype.statusClass = function (online, tag_geos) {
        if (tag_geos.indexOf(730) > -1)
            return 'publish-request';
        return online ? 'online' : 'offline';
    };
    PanelGeoEditorial.prototype.itemTap = function (e) {
        Common.geoClick(e.model.item.id);
    };
    PanelGeoEditorial.prototype.sortOnTitle = function () {
        this.$.selector.sort(this.compareTitle);
    };
    PanelGeoEditorial.prototype.compareTitle = function (a, b) {
        return a.title.localeCompare(b.title);
    };
    PanelGeoEditorial.prototype.sortOnUser = function () {
        this.$.selector.sort(this.compareUser);
    };
    PanelGeoEditorial.prototype.compareUser = function (a, b) {
        return (a.user.firstname + a.user.lastname).localeCompare(b.user.firstname + b.user.lastname);
    };
    PanelGeoEditorial.prototype.sortOnDate = function () {
        this.$.selector.sort(this.compareDate);
    };
    PanelGeoEditorial.prototype.compareDate = function (a, b) {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
    };
    PanelGeoEditorial.prototype.sortOnStatus = function () {
        this.$.selector.sort(this.compareStatus);
    };
    PanelGeoEditorial.prototype.compareStatus = function (a, b) {
        var valA = a.tag_geos.indexOf(730) > 0 ? 1 : (a.online ? 2 : 0);
        var valB = b.tag_geos.indexOf(730) > 0 ? 1 : (b.online ? 2 : 0);
        return valA - valB;
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelGeoEditorial.prototype, "geos", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelGeoEditorial.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelGeoEditorial.prototype, "selected", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelGeoEditorial.prototype, "selectedChanged", null);
    PanelGeoEditorial = __decorate([
        component("panel-geo-editorial"), 
        __metadata('design:paramtypes', [])
    ], PanelGeoEditorial);
    return PanelGeoEditorial;
}(polymer.Base));
PanelGeoEditorial.register();
