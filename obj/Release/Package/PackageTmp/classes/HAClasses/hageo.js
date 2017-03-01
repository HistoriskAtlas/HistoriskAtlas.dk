var HaGeo = (function () {
    function HaGeo(data, show, userLayer) {
        this._id = data.id;
        this._title = data.title;
        this._yearStart = data.yearstart;
        this._yearEnd = data.yearend;
        this._ugc = data.ugc;
        this.online = data.online == null ? true : data.online;
        this.userLayer = userLayer;
        this.inYear = this._inYear;
        this.tags = [];
        this._isMoving = false;
        if (data.user) {
            if (data.user.id) {
                if (data.user.id == App.haUsers.user.id) {
                    this.user = App.haUsers.user;
                }
            }
            else
                this.user = new HAUser(data.user);
        }
        if (data.ptid)
            this._primaryTag = App.haTags.byId[data.ptid];
        this.icon = new Icon(this, [data.lng, data.lat]);
        if (show)
            this.show();
        if (this.isByCurrentUser)
            this.isMoving = true;
    }
    HaGeo.prototype.show = function () {
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
    };
    HaGeo.prototype._addTag = function (tag) {
        this.tags.push(tag);
        tag.geos.push(this);
    };
    HaGeo.prototype.yearChanged = function () {
        return false;
    };
    Object.defineProperty(HaGeo.prototype, "_inYear", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "link", {
        get: function () {
            var id = this._id;
            return 'http://historiskatlas.dk/' + (this._title ? this._title.replace(new RegExp(' ', 'g'), '_') : '') + '_(' + id + ')';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeo.prototype, "institutionTags", {
        get: function () {
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
        get: function () {
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
        this.user = App.haUsers.user;
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
            deleted: false
        };
        Services.insert('geo', data, function (result) {
            _this._id = result.data[0].geoid;
            for (var _i = 0, _a = _this.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
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
