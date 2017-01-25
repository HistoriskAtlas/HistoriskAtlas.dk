var HaContent = (function () {
    function HaContent(data) {
        this.texts = [];
        this.biblios = [];
        this.externals = [];
        this._id = data.id;
        this._geoid = data.geoid;
        this._contenttypeid = data.contenttypeid;
        this._ordering = data.ordering;
        if (data.texts)
            for (var _i = 0, _a = data.texts; _i < _a.length; _i++) {
                var text = _a[_i];
                this.texts.push(new HaSubContentText(text, this));
            }
        if (data.biblios)
            for (var _b = 0, _c = data.biblios; _b < _c.length; _b++) {
                var biblio = _c[_b];
                this.biblios.push(new HaSubContentBiblio(biblio, this));
            }
        if (data.externalcontent)
            for (var _d = 0, _e = data.externalcontent; _d < _e.length; _d++) {
                var external = _e[_d];
                this.externals.push(new HaSubContentExternal(external, this));
            }
    }
    Object.defineProperty(HaContent.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "ordering", {
        get: function () {
            return this._ordering;
        },
        set: function (value) {
            this._ordering = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "headline", {
        get: function () {
            switch (this._contenttypeid) {
                case 0:
                    if (this.texts.length > 0)
                        return this.texts[0].headline;
                    break;
                case 1: return 'Litteratur';
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "isText", {
        get: function () {
            return this._contenttypeid == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "isBiblio", {
        get: function () {
            return this._contenttypeid == 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "isExternal", {
        get: function () {
            return this._contenttypeid == 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "isEditorial", {
        get: function () {
            return this._contenttypeid == 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaContent.prototype, "showAsTab", {
        get: function () {
            return this.isText || this.isBiblio;
        },
        enumerable: true,
        configurable: true
    });
    HaContent.prototype.insert = function () {
        var _this = this;
        var data = {
            geoid: this._geoid,
            ordering: this._ordering,
            userid: App.haUsers.user.id,
            contenttypeid: this._contenttypeid
        };
        Services.insert('content', data, function (result) {
            _this._id = result.data[0].id;
            for (var _i = 0, _a = _this.texts; _i < _a.length; _i++) {
                var text = _a[_i];
                text.insert(null);
            }
            for (var _b = 0, _c = _this.biblios; _b < _c.length; _b++) {
                var biblio = _c[_b];
                biblio.insert();
            }
            for (var _d = 0, _e = _this.externals; _d < _e.length; _d++) {
                var external = _e[_d];
                external.insert();
            }
        });
    };
    HaContent.prototype.update = function (property) {
        switch (property) {
            case 'ordering':
                Services.update('content', { id: this._id, ordering: this._ordering }, function (result) { });
                break;
        }
    };
    HaContent.prototype.delete = function () {
        Services.delete('content', { id: this._id, deletemode: 'permanent' }, function (result) { });
        for (var _i = 0, _a = this.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            text.delete();
        }
        for (var _b = 0, _c = this.biblios; _b < _c.length; _b++) {
            var biblio = _c[_b];
            biblio.delete();
        }
        for (var _d = 0, _e = this.externals; _d < _e.length; _d++) {
            var external = _e[_d];
            external.delete();
        }
    };
    HaContent.prototype.sort = function (otherContent) {
        return this._ordering - otherContent.ordering;
    };
    return HaContent;
}());
