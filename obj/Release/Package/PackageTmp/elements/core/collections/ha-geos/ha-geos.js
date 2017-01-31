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
var HaGeos = (function (_super) {
    __extends(HaGeos, _super);
    function HaGeos() {
        _super.apply(this, arguments);
    }
    HaGeos.prototype.ready = function () {
        this.geos = [];
        this.requests = [];
        this.responses = [];
        //this.lastGeoIdsLoaded = [];
        this.isLoading = false;
        //this.tagsIsLoaded = false;
        this.$.ajax.url = Common.api + "geo.json";
    };
    HaGeos.prototype.tagsLoaded = function () {
        this.updateAllGeosFromAPI(false);
        if (localStorage.getItem("sessionID"))
            Services.get('login', {}, function (result) {
                if (result.data.user.isvalid)
                    App.haUsers.login(result.data.user);
            });
    };
    HaGeos.prototype.login = function () {
        this.processRequest({ themeTagID: this.theme.tagid, ugc: false, removeAlso: false, userLayer: true });
    };
    HaGeos.prototype.logout = function () {
        this.geos.forEach(function (geo) {
            geo.userLayer = false;
        });
        this.updateAllGeosFromAPI(true);
    };
    HaGeos.prototype.themeChanged = function (newVal, oldVal) {
        if (oldVal === undefined)
            return;
        this.updateAllGeosFromAPI(true);
    };
    HaGeos.prototype.userCreatorsChanged = function (newVal, oldVal) {
        this.creatorTypeChanged(newVal, oldVal, true);
    };
    HaGeos.prototype.profCreatorsChanged = function (newVal, oldVal) {
        this.creatorTypeChanged(newVal, oldVal, false);
    };
    HaGeos.prototype.creatorTypeChanged = function (newVal, oldVal, ugc) {
        if (oldVal === undefined)
            return;
        if (newVal) {
            this.processRequest({ themeTagID: this.theme.tagid, ugc: ugc, removeAlso: false, userLayer: false });
            if (!App.haUsers.user.isDefault)
                this.processRequest({ themeTagID: this.theme.tagid, ugc: ugc, removeAlso: false, userLayer: false });
        }
        else
            this.removeByCreatorType(ugc);
    };
    HaGeos.prototype.removeByCreatorType = function (ugc) {
        IconLayer.updateDisabled = true;
        var removeArray = [];
        this.geos.forEach(function (geo) {
            if (geo.isUGC == ugc && !geo.userLayer)
                removeArray.push(geo);
        });
        for (var _i = 0, removeArray_1 = removeArray; _i < removeArray_1.length; _i++) {
            var geo = removeArray_1[_i];
            this.removeGeo(geo);
        }
        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    };
    HaGeos.prototype.updateAllGeosFromAPI = function (removeAlso) {
        var themeTagID = this.theme ? this.theme.tagid : App.passed.theme.tagid;
        if (this.profCreators)
            this.processRequest({ themeTagID: themeTagID, ugc: false, removeAlso: removeAlso, userLayer: false });
        if (this.userCreators)
            this.processRequest({ themeTagID: themeTagID, ugc: true, removeAlso: removeAlso, userLayer: false });
        //if (!App.haUsers.user.isDefault) {
        //    this.processRequest({ themeTagID: themeTagID, ugc: false, removeAlso: removeAlso, userLayer: true });
        //    this.processRequest({ themeTagID: themeTagID, ugc: true, removeAlso: removeAlso, userLayer: true });
        //}
    };
    HaGeos.prototype.processRequest = function (request) {
        var _this = this;
        if (this.isLoading) {
            this.requests.unshift(request);
            return;
        }
        this.isLoading = true;
        App.loading.show(HaGeos.loadingText);
        this.curRequest = request;
        if (!this.curRequest.removeAlso)
            this.getGeos();
        else {
            //var send: any = {
            //    count: '*',
            //    //TODO: also include theme filter? (old theme id)
            //    schema: JSON.stringify({
            //        tag: {
            //            fields: [
            //                {
            //                    tag_geos: [{ collapse: "geoid" }]
            //                }
            //            ],
            //            filters: [
            //                {
            //                    tagid: this.curRequest.themeTagID
            //                }
            //            ]
            //        }
            //    })
            //}
            var send = {
                count: '*',
                schema: JSON.stringify({
                    geo: {
                        fields: [{ collapse: "geoid" }],
                        filters: [
                            {
                                tag_geos: [{ tagid: this.curRequest.themeTagID }]
                            }
                        ]
                    }
                })
            };
            if (App.haUsers.user.isDefault)
                send.online = true;
            Services.get('geo', send, function (result) {
                IconLayer.updateDisabled = true;
                //var newGeoIds = <Array<number>>result.data[0].tag_geos;
                var newGeoIds = result.data;
                var removeArray = [];
                _this.geos.forEach(function (geo) {
                    if (newGeoIds.indexOf(geo.id) == -1 && !geo.userLayer)
                        removeArray.push(geo);
                });
                for (var _i = 0, removeArray_2 = removeArray; _i < removeArray_2.length; _i++) {
                    var geo = removeArray_2[_i];
                    _this.removeGeo(geo);
                }
                IconLayer.updateDisabled = false;
                //IconLayer.updateShown();
                _this.getGeos();
            });
        }
    };
    HaGeos.prototype.getGeos = function () {
        var selectedTagIds = [];
        for (var _i = 0, _a = App.haTags.tags; _i < _a.length; _i++) {
            var tag = _a[_i];
            if (tag.selected)
                selectedTagIds.push(tag.id);
        }
        this.params = {
            v: 1,
            count: '*',
            ugc: this.curRequest.ugc,
            tag_geos: JSON.stringify([
                { tagid: this.curRequest.themeTagID }
            ]),
            schema: JSON.stringify({
                geo: {
                    fields: [
                        'id',
                        //'title',
                        'lat',
                        'lng',
                        'ptid'
                    ],
                    filters: !this.curRequest.userLayer ? [] : [
                        {
                            user: [{ userhierarkis1: [{ parentid: App.haUsers.user.id /*is editor for owner*/ }] }]
                        },
                        {
                            user: [{ id: App.haUsers.user.id /*is owner*/ }]
                        },
                        (!App.haUsers.user.institutions ? null : (App.haUsers.user.institutions.length == 0 ? null : {
                            tag_geos: [
                                {
                                    tag: [
                                        {
                                            institutions: [
                                                {
                                                    id: App.haUsers.user.institutions[0].id /*is same institution TODO: cur inst not only [0]*/
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }))
                    ]
                }
            })
        };
        if (this.curRequest.userLayer)
            this.params.sid = document.sid;
        else
            this.params.online = true;
        this.$.ajax.generateRequest();
    };
    HaGeos.prototype.handleResponse = function () {
        var response = this.$.ajax.lastResponse;
        this.addGeosFromResponse(response);
    };
    HaGeos.prototype.addGeosFromResponse = function (response) {
        var tempGeos = this.geos.slice();
        //this.lastGeoIdsLoaded = [];
        for (var _i = 0, _a = response.data; _i < _a.length; _i++) {
            var data = _a[_i];
            if (this.geos[data.id]) {
                if (this.curRequest.userLayer)
                    this.geos[data.id].userLayer = true;
                continue;
            }
            //this.lastGeoIdsLoaded.push(data.id);
            data.ugc = this.curRequest.ugc;
            data.online = !this.curRequest.userLayer;
            var geo = new HaGeo(data, !this.curRequest.removeAlso || HaTags.tagTop[9].selected ? true : this.curRequest.userLayer, this.curRequest.userLayer);
            //if (!geo.online)
            //    geo.addTag(HaTags.tagUserLayer);
            //if (geo.isUGC)
            //    geo.addTag(HaTags.tagUGC);
            tempGeos[geo.id] = geo;
            if (HaGeos.usersGeoIDs.length > 0)
                if (HaGeos.usersGeoIDs.indexOf(geo.id) > -1)
                    geo.connectUser();
        }
        this.geos = tempGeos;
        App.loading.hide(HaGeos.loadingText);
        //if (!App.useClustering)
        //    IconLayer.updateMinDist();
        //IconLayer.updateShown();
        this.updateShownGeos(null, null, this.curRequest.themeTagID, this.userCreators, this.profCreators); //WAS true, true
    };
    HaGeos.prototype.updateShownGeos = function (idsChanged, changedTo, themeTagID, userCreators, profCreators) {
        var _this = this;
        if (themeTagID === void 0) { themeTagID = null; }
        if (userCreators === void 0) { userCreators = null; }
        if (profCreators === void 0) { profCreators = null; }
        App.loading.show(HaGeos.showingText);
        if ((this.curRequest.userLayer && !idsChanged) || (HaTags.tagTop[9].selected && !idsChanged)) {
            this.updateShownGeosFinally(idsChanged);
            return;
        }
        if (!themeTagID)
            themeTagID = this.theme.tagid;
        if (userCreators === null)
            userCreators = this.userCreators;
        if (profCreators === null)
            profCreators = this.profCreators;
        var selectedTagIds = [];
        if (idsChanged && changedTo) {
            if (idsChanged.indexOf(HaTags.tagTop[9].id) > -1) {
                App.haGeos.geos.forEach(function (geo) {
                    if (!geo.shown)
                        geo.show();
                });
                this.updateShownGeosFinally(idsChanged);
                return;
            }
            selectedTagIds = idsChanged;
        }
        else
            for (var _i = 0, _a = App.haTags.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.selected)
                    selectedTagIds.push(tag.id);
            }
        if (selectedTagIds.length == 0) {
            this.hideAll(idsChanged);
            return;
        }
        var send = {
            count: '*',
            ugc: userCreators == profCreators ? '' : userCreators,
            //sid: (<any>document).sid,
            tag_geos: JSON.stringify([
                { tagid: themeTagID }
            ]),
            schema: JSON.stringify({ geo: { fields: [{ "collapse": "id" }], filters: [{ tag_geos: [{ tagid: selectedTagIds }] }] } })
        };
        if (!userCreators && idsChanged && App.haUsers.user.isDefault)
            send.online = true;
        Services.get('geo', send, function (data) {
            if (data.data.length == 0) {
                _this.hideAll(idsChanged);
                return;
            }
            if (idsChanged && changedTo) {
                for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                    var geoid = _a[_i];
                    var geo = App.haGeos.geos[geoid];
                    if (geo)
                        if (!geo.shown)
                            geo.show();
                }
            }
            else
                App.haGeos.geos.forEach(function (geo) {
                    if (data.data.indexOf(geo.id) > -1) {
                        if (!geo.shown)
                            geo.show();
                    }
                    else {
                        if (geo.shown)
                            geo.hide();
                    }
                });
            _this.updateShownGeosFinally(idsChanged);
        });
    };
    HaGeos.prototype.hideAll = function (idsChanged) {
        App.haGeos.geos.forEach(function (geo) {
            if (geo.shown)
                geo.hide();
        });
        this.updateShownGeosFinally(idsChanged);
    };
    HaGeos.prototype.updateShownGeosFinally = function (idsChanged) {
        IconLayer.updateShown();
        App.loading.hide(HaGeos.showingText);
        if (idsChanged)
            return;
        this.isLoading = false;
        if (this.requests.length > 0)
            this.processRequest(this.requests.pop());
    };
    HaGeos.prototype.newGeo = function () {
        var size = App.map.getSize();
        var coord = Common.fromMapCoord(App.map.getCoordinateFromPixel([size[0] - 150, 150]));
        var geo = new HaGeo({ lat: coord[1], lng: coord[0], title: '', user: { id: App.haUsers.user.id }, online: false, ugc: !App.haUsers.user.isPro }, true, true); //530 = Ready for HA5...
        geo.addTag(App.haTags.byId[530]); // ready for v.5
        geo.addTag(App.haTags.byId[427]); // HA destination
        if (App.haUsers.user.isPro)
            geo.addTag(App.haTags.byId[App.haUsers.user.currentInstitution.tag.id]);
        geo.views = 0;
        geo.intro = '';
        geo.freeTags = '';
        geo.images = [];
        App.haUsers.user.geos.push(geo); //TODO: let HaUsers handle it, so change notification kicks in?
        //geo.user = App.haUsers.user;
        this.push('geos', geo);
        IconLayer.updateShown();
        geo.save();
        if (App.haUsers.firstLogInTour) {
            App.haUsers.firstLogInTour.close();
            App.haUsers.firstLogInTour = null;
            LocalStorage.set('firstLogInTourDone', 'true');
            if (!LocalStorage.get('firstGeoTourDone')) {
                Common.dom.append(App.haGeos.firstGeoTour = DialogTour.create('Flyt den på plads!', 'Træk fortællingen hen hvor den hører hjemme. Bekræft ved at trykke på det grønne flueben.', 0, null, 0, null, null, -15, 6, null, true, 'firstGeoTourDone'));
                this.firstGeoTour.geo = geo;
                this.updateFirstGeoTour();
            }
        }
    };
    HaGeos.prototype.deleteGeo = function (geo) {
        geo.delete();
        this.removeGeo(geo);
    };
    HaGeos.prototype.removeGeo = function (geo) {
        if (geo.shown) {
            geo.hide();
            IconLayer.updateShown();
        }
        for (var _i = 0, _a = geo.tags; _i < _a.length; _i++) {
            var tag = _a[_i];
            tag.geos.splice(tag.geos.indexOf(geo), 1);
        }
        //this.splice('geos', this.geos.indexOf(geo), 1); NO GO... messes the index = id up.
        //this.arrayDelete('geos', geo); //seems to splice also, so no go
        delete this.geos[this.geos.indexOf(geo)]; //TODO: need to notify polymer also?
        if (App.haUsers.user.geos)
            if (App.haUsers.user.geos.indexOf(geo) > -1)
                App.haUsers.user.geos.splice(App.haUsers.user.geos.indexOf(geo), 1); //TODO: let HaUsers handle it, so change notification kicks in?
    };
    HaGeos.prototype.updateFirstGeoTour = function () {
        var pixel = App.map.getPixelFromCoordinate(this.firstGeoTour.geo.coord);
        this.firstGeoTour.left = pixel[0] - 420;
        this.firstGeoTour.top = pixel[1] - 6;
    };
    HaGeos.prototype.yearChanged = function () {
        this.updateYears();
    };
    HaGeos.prototype.timeWarpYearChanged = function () {
        this.updateYears();
    };
    HaGeos.prototype.timeLineActiveChanged = function () {
        this.updateYears(true);
    };
    HaGeos.prototype.updateYears = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (!this.geos)
            return false;
        if (!this.timeLineActive && !forceUpdate)
            return false;
        var change = false;
        this.geos.forEach(function (geo) {
            if (geo.yearChanged())
                change = true;
        });
        if (change) {
            IconLayer.updateShown();
            return true;
        }
        else
            return false;
    };
    //private lastGeoIdsLoaded: Array<number>;
    //private tagsIsLoaded: boolean;
    HaGeos.pageSize = 100000; //was 500
    //private curPage: number;
    HaGeos.usersGeoIDs = [];
    HaGeos.loadingText = 'Henter fortællinger';
    HaGeos.showingText = 'Viser fortællinger';
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaGeos.prototype, "geos", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaGeos.prototype, "params", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], HaGeos.prototype, "year", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], HaGeos.prototype, "timeWarpYear", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HaGeos.prototype, "timeLineActive", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HaGeos.prototype, "userCreators", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], HaGeos.prototype, "profCreators", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaGeos.prototype, "theme", void 0);
    __decorate([
        observe('theme'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "themeChanged", null);
    __decorate([
        observe('userCreators'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean, Boolean]), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "userCreatorsChanged", null);
    __decorate([
        observe('profCreators'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean, Boolean]), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "profCreatorsChanged", null);
    __decorate([
        observe('year'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "yearChanged", null);
    __decorate([
        observe('timeWarpYear'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "timeWarpYearChanged", null);
    __decorate([
        observe('timeLineActive'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeos.prototype, "timeLineActiveChanged", null);
    HaGeos = __decorate([
        component("ha-geos"), 
        __metadata('design:paramtypes', [])
    ], HaGeos);
    return HaGeos;
}(polymer.Base));
HaGeos.register();
//# sourceMappingURL=ha-geos.js.map