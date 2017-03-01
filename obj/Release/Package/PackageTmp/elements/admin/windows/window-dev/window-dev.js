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
var WindowDev = (function (_super) {
    __extends(WindowDev, _super);
    function WindowDev() {
        _super.apply(this, arguments);
        this.pageSize = 500;
    }
    WindowDev.prototype.updatePrimaryTagsAndUGCs = function () {
        if (!confirm("WARNING! This will reset all primary tags and UGC on all geos. Any manually set tags will be reset! Continue?"))
            return;
        this.curPage = 0;
        this.getPage();
    };
    WindowDev.prototype.insertHADestinations = function () {
        var _this = this;
        var geoIDsWidthDestination;
        Services.get('geo', {
            count: '*',
            tag_geos: JSON.stringify([{ tagid: 427 }]),
            schema: JSON.stringify({
                geo: {
                    fields: [{ collapse: 'id' }],
                    filters: [{
                            created: { min: '2016-06-30' }
                        }]
                }
            })
        }, function (data) {
            geoIDsWidthDestination = data.data;
            Services.get('geo', {
                count: '*',
                schema: JSON.stringify({
                    geo: {
                        fields: [{ collapse: 'id' }],
                        filters: [{
                                created: { min: '2016-06-30' }
                            }]
                    }
                })
            }, function (data) {
                _this.insertHADestination(data.data, geoIDsWidthDestination);
            });
        });
    };
    WindowDev.prototype.insertHADestination = function (geoIds, geoIDsWidthDestination) {
        var _this = this;
        var geoid = geoIds.pop();
        if (geoIDsWidthDestination.indexOf(geoid) == -1) {
            Services.insert('tag_geo', { tagid: 427, geoid: geoid, userid: 5 }, function (data) {
                if (geoIds.length > 0)
                    _this.insertHADestination(geoIds, geoIDsWidthDestination);
            });
        }
        else if (geoIds.length > 0)
            this.insertHADestination(geoIds, geoIDsWidthDestination);
    };
    WindowDev.prototype.getPage = function () {
        var _this = this;
        Services.get('geo', {
            count: this.pageSize,
            offset: this.curPage * this.pageSize,
            sort: '{id:asc}',
            schema: JSON.stringify({
                geo: {
                    fields: ['id', 'title', 'lat', 'lng', 'ptid', 'online',
                        {
                            tag_geos: ['empty', { "collapse": "tagid" }]
                        }
                    ]
                }
            })
        }, function (data) {
            _this.updatePrimaryTagAndUGC(data.data, data.data.length == _this.pageSize);
        });
    };
    WindowDev.prototype.updatePrimaryTagAndUGC = function (geos, moreToCome) {
        var _this = this;
        if (geos.length == 0) {
            if (moreToCome) {
                this.curPage++;
                this.getPage();
                return;
            }
            alert('done!');
            return;
        }
        var data = geos.pop();
        var geo = new HaGeo(data, false, false);
        if (data.tag_geos)
            for (var _i = 0, _a = data.tag_geos; _i < _a.length; _i++) {
                var tagID = _a[_i];
                geo.addTag(App.haTags.byId[tagID]);
            }
        var primTag = geo.getNewPrimaryTag;
        Services.update('geo', { primarytagid: primTag ? primTag.id : null, ugc: geo.institutionTags.length == 0, geoid: geo.id }, function () {
            _this.updatePrimaryTagAndUGC(geos, moreToCome);
        });
    };
    WindowDev = __decorate([
        component("window-dev"), 
        __metadata('design:paramtypes', [])
    ], WindowDev);
    return WindowDev;
}(polymer.Base));
WindowDev.register();
