var HaGeo = (function () {
    function HaGeo(data, show, userLayer) {
        this._id = data.id;
        //this._lat = data.lat;
        //this._lng = data.lng;
        this._title = data.title;
        this._yearStart = data.yearstart;
        this._yearEnd = data.yearend;
        this._ugc = data.ugc;
        this.online = data.online == null ? true : data.online;
        this.userLayer = userLayer;
        //this.selectedTagsCount = 0;
        this.inYear = this._inYear;
        this.tags = [];
        //if (data.tagids) { //TODO: this "if" needed?
        //    (<number[]>(data.tagids)).forEach((id: number, i: number, array: number[]) => {
        //        var tag: HaTag = App.haTags.byId[id];
        //        if (!tag) //Not all tags loaded yet
        //            return;
        //        if (tag.selected)
        //            this.selectedTagsCount++;
        //        this.tags2.push(tag);
        //        tag.geos.push(this);
        //    });
        //}
        this._isMoving = false;
        if (data.user) {
            if (data.user.id) {
                //TODO: look for user in users collection instead... not present yet?
                if (data.user.id == App.haUsers.user.id) {
                    //this.isMoving = true;
                    this.user = App.haUsers.user;
                }
            }
            else
                this.user = new HAUser(data.user);
        }
        if (data.ptid)
            this._primaryTag = App.haTags.byId[data.ptid];
        //if (data.tag_geos) 
        //    for (var tagID of data.tag_geos)
        //        this._addTag(App.haTags.byId[tagID])
        this.icon = new Icon(this, [data.lng, data.lat]);
        if (show)
            this.show();
        //if (this.selectedTagsCount && this.inYear)
        //    if (this.showByCreatorType || this.isByCurrentUser)
        //        this.show();
        if (this.isByCurrentUser)
            this.isMoving = true;
    }
    HaGeo.prototype.show = function () {
        //if (!App.isDev) 
        //if (this.tags.indexOf(App.haTags.byId[530]) == -1) //Dont show non ready locations... NOT TESTED
        //    return;
        //if (this.icon.small) //TODO: NOT TESTED
        //    return;
        IconLayer.iconsShown.push(this.icon);
        this.shown = true;
    };
    HaGeo.prototype.hide = function () {
        IconLayer.iconsShown.splice(IconLayer.iconsShown.indexOf(this.icon), 1);
        this.shown = false;
    };
    HaGeo.prototype.addTag = function (tag, updateMap) {
        if (updateMap === void 0) { updateMap = false; }
        this._addTag(tag);
        //if (!this.shown)
        //    if ((this.selectedTagsCount > 0 && this.inYear && this.showByCreatorType) || this.tags.indexOf(HaTags.tagUserLayer) > -1) { 
        //        this.show();
        //        if (updateMap)
        //            IconLayer.updateShown();
        //    }
    };
    HaGeo.prototype._addTag = function (tag) {
        //if (tag.selected)
        //    this.selectedTagsCount++;
        this.tags.push(tag);
        tag.geos.push(this);
    };
    //public tagSelectedChanged(selected: boolean): boolean {
    //    var iconsChanged: boolean = false;
    //    if (selected) {
    //        if (!this.shown)
    //            if (this.selectedTagsCount == 0 && this.inYear && this.showByCreatorType) { //TODO: && ready location?
    //                this.show();
    //                iconsChanged = true;
    //            }
    //        this.selectedTagsCount++;
    //    } else {
    //        this.selectedTagsCount--;
    //        if (this.shown)
    //            if (this.selectedTagsCount == 0)
    //                if (this.tags.indexOf(HaTags.tagUserLayer) == -1)
    //                {
    //                    this.hide();
    //                    iconsChanged = true;
    //                }
    //    }
    //    return iconsChanged;
    //}
    HaGeo.prototype.yearChanged = function () {
        //var oldInYear = this.inYear;
        //this.inYear = this._inYear;
        //if (this.inYear == oldInYear)
        //    return false;
        //if (this.shown) {
        //    if (!this.inYear)
        //        if (this.tags2.indexOf(HaTags.tagUserLayer) == -1)
        //        {
        //            this.hide();
        //            return true;
        //        }
        //} else {
        //    if (this.inYear && this.selectedTagsCount > 0 && this.showByCreatorType) {
        //        this.show();
        //        return true;
        //    }
        //}
        return false;
    };
    Object.defineProperty(HaGeo.prototype, "_inYear", {
        //public creatorTypesChanged() {
        //    if (this.showByCreatorType) {
        //        if (!this.shown)
        //            if (this.inYear && this.selectedTagsCount > 0)
        //                this.show();
        //    } else {
        //        if (this.shown)
        //            if (this.tags.indexOf(HaTags.tagUserLayer) == -1)
        //                this.hide();
        //    }        
        //}    
        //private get showByCreatorType(): boolean {
        //    return this.isUGC ? App.global.userCreators : App.global.profCreators;
        //}
        get: function () {
            //if (typeof App == 'undefined')
            //    return true;
            //if (!App.global.timeLineActive)
            //    return true;
            //var year: number;
            //if (App.global.timeWarpActive)
            //    year = App.map.timeWarp.inside(this.coord3857) ? App.global.timeWarpYear : App.global.year //this.coord3857 WAS: Common.toMapCoord([this.lng, this.lat])
            //else
            //    year = App.global.year
            //return year >= this.yearStart && year <= this.yearEnd;
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "link", {
        get: function () {
            //var id = this.online ? this._id : TODO: ????? secret key;
            var id = this._id;
            return 'http://historiskatlas.dk/' + (this._title ? this._title.replace(new RegExp(' ', 'g'), '_') : '') + '_(' + id + ')';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "institutionTags", {
        get: function () {
            //TODO: do as internal kept array instead? create a class for that.... use in ha-tags as well
            var result = [];
            for (var _i = 0, _a = this.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.isInstitution)
                    result.push(tag);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "isUGC", {
        //public get creator(): string {
        //    var institutionTags = this.institutionTags;
        //    if (institutionTags.length > 0) {
        //        var institutionNames: Array<string> = [];
        //        for (var institutionTag of institutionTags) {
        //            if (institutionTag.id == 731) {//1001 institution
        //                if (this.user) {
        //                    if (this.user.isMemberOf(institutionTag.id)) {
        //                        institutionNames.push((<HaTag>institutionTag).plurName + ' / ' + this.user.fullname);
        //                        continue;
        //                    }
        //                }
        //            }
        //            institutionNames.push((<HaTag>institutionTag).plurName);
        //        }
        //        return institutionNames.join(', ');
        //    }
        //    if (this.user)
        //        return this.user.fullname;
        //    return '';
        //}
        //public get licens(): HaLicens {
        //    for (var tag of this.tags) //TODO: when real tags class is available, use that instead..
        //        if (tag.category == 4) //Licens
        //            return (<HaLicenses>document.querySelector('ha-licenses')).byTagID[tag.id];
        //    return null;
        //}
        get: function () {
            //for (var tag of this.tags)
            //    if ((<HaTag>tag).isInstitution)
            //        return false;
            //return true;
            return this._ugc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "isByCurrentUser", {
        get: function () {
            if (Common.standalone)
                return false;
            return this.user == App.haUsers.user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "isMoving", {
        get: function () {
            return this._isMoving;
        },
        set: function (val) {
            var beforeBelongs = this.belongsOnNonClusteredLayer;
            this._isMoving = val;
            if (beforeBelongs != this.belongsOnNonClusteredLayer)
                this.moveToLayer(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "isPartOfCurrentCollection", {
        get: function () {
            return this._isPartOfCurrentCollection;
        },
        set: function (val) {
            var beforeBelongs = this.belongsOnNonClusteredLayer;
            this._isPartOfCurrentCollection = val;
            if (this.id)
                if (beforeBelongs != this.belongsOnNonClusteredLayer)
                    this.moveToLayer(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "belongsOnNonClusteredLayer", {
        get: function () {
            return this._isMoving || this._isPartOfCurrentCollection;
        },
        enumerable: true,
        configurable: true
    });
    HaGeo.prototype.moveToLayer = function (val) {
        if (val) {
            if (IconLayer.source.getFeatures().indexOf(this.icon) > -1)
                IconLayer.source.removeFeature(this.icon);
            this.icon.updateStyle();
            App.map.iconLayerNonClustered.addIcon(this.icon);
        }
        else {
            App.map.iconLayerNonClustered.removeIcon(this.icon);
            this.icon.updateStyle();
            IconLayer.source.addFeature(this.icon);
        }
    };
    HaGeo.prototype.connectUser = function () {
        this.user = App.haUsers.user; //TOOD: needed?
        //if (this.tags.indexOf(HaTags.tagUserLayer) == -1)
        //    this.addTag(HaTags.tagUserLayer);
        App.haUsers.user.geos.push(this);
    };
    HaGeo.prototype.translateCoord = function (deltaX, deltaY) {
        this.icon.translateCoord(deltaX, deltaY);
        if (!this.isMoving)
            this.isMoving = true;
        if (App.haGeos.firstGeoTour)
            App.haGeos.updateFirstGeoTour();
    };
    Object.defineProperty(HaGeo.prototype, "coord", {
        //get tags(): Tags {
        //    return this._tags;
        //}
        //set setIntro(newIntro: string) {
        //    this.intro = newIntro;
        //}
        get: function () {
            return this.icon.coord3857;
        },
        set: function (coord) {
            this.icon.coord3857 = coord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "primaryTag", {
        get: function () {
            return this._primaryTag;
        },
        set: function (value) {
            this._primaryTag = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "primaryTagStatic", {
        get: function () {
            return this._primaryTagStatic;
        },
        set: function (value) {
            this._primaryTagStatic = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "yearStart", {
        get: function () {
            return this._yearStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "yearEnd", {
        get: function () {
            return this._yearEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value;
            //Services.update('geo', { id: this._id, title: this._title });
            //App.haGeos.notifyPath('geos...')  TODO: either this OR move WindowGeo to main-app.html to make global binding work........ if polymer still dont support dynamic binding OR......
            // maybe use: https://github.com/ESTOS/estos-databinding-behavior or https://github.com/Juicy/dom-bind-notifier
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "intro", {
        get: function () {
            return this._intro;
        },
        set: function (value) {
            this._intro = value;
        },
        enumerable: true,
        configurable: true
    });
    HaGeo.prototype.save = function () {
        var _this = this;
        var data = {
            title: this._title,
            intro: this._intro,
            freetags: this.freeTags,
            latitude: this.icon.coord4326[1],
            longitude: this.icon.coord4326[0],
            userid: this.user.id,
            online: this.online,
            ugc: this._ugc,
            views: this.views,
            deleted: false //TODO: shouldnt be a required field...
        };
        //if (this._id) {
        //    data.geoid = this._id;
        //    Services.update('geo', data, () => { })
        //} else
        Services.insert('geo', data, function (result) {
            _this._id = result.data[0].geoid;
            for (var _i = 0, _a = _this.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                //if (tag != HaTags.tagUserLayer) //tag != HaTags.tagUGC && 
                Services.insert('tag_geo', { tagid: tag.id, geoid: _this._id }, function (result) {
                });
            }
        });
    };
    HaGeo.prototype.saveCoords = function () {
        this.isMoving = false;
        Services.update('geo', {
            id: this._id,
            latitude: this.icon.coord4326[1],
            longitude: this.icon.coord4326[0]
        }, function () { });
        if (App.haGeos.firstGeoTour) {
            App.haGeos.firstGeoTour.title = 'Så er den placeret!';
            App.haGeos.firstGeoTour.text = 'Tryk nu på fortællingen, for at åbne den og lægge indhold i den.';
            setTimeout(function () { return App.haGeos.updateFirstGeoTour(); }, 2100);
        }
    };
    HaGeo.prototype.revertCoords = function () {
        var _this = this;
        this.isMoving = false;
        Services.get('geo', {
            id: this._id,
            schema: '{geo:[latitude,longitude]}'
        }, function (result) {
            _this.icon.coord4326 = [result.data[0].longitude, result.data[0].latitude];
        });
    };
    HaGeo.prototype.delete = function () {
        //this.hide();
        Services.delete('geo', { geoid: this._id }, function (result) {
            App.toast.show('Fortællingen er slettet.');
        });
    };
    HaGeo.prototype.zoomUntilUnclustered = function () {
        this.icon.updateMinDist();
        var res = App.map.getView().constrainResolution(this.icon.minDist / (50 * 1.5));
        if (res < App.map.getView().getResolution())
            App.map.centerAnim(this.coord, res, true, false);
    };
    Object.defineProperty(HaGeo.prototype, "getNewPrimaryTag", {
        get: function () {
            var hasChildrenTag;
            for (var _i = 0, _a = this.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.marker) {
                    if (!tag.hasChildren)
                        return tag;
                    hasChildrenTag = tag;
                }
            }
            if (hasChildrenTag)
                return hasChildrenTag;
            return null;
        },
        enumerable: true,
        configurable: true
    });
    HaGeo.prototype.showToolTip = function () {
        var _this = this;
        if (this._title)
            App.mapTooltip.setText(this._title);
        else if (this._title != '') {
            App.mapTooltip.setText('');
            Services.get('geo', {
                schema: JSON.stringify({
                    geo: {
                        fields: ['title'],
                        filters: [{
                                geoid: this._id
                            }]
                    }
                })
            }, function (result) {
                _this._title = result.data[0].title;
                App.mapTooltip.setText(_this._title, true);
            });
        }
    };
    return HaGeo;
}());
//# sourceMappingURL=hageo.js.map