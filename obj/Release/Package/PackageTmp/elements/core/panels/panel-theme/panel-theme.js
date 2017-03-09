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
var PanelTheme = (function (_super) {
    __extends(PanelTheme, _super);
    function PanelTheme() {
        _super.apply(this, arguments);
    }
    PanelTheme.prototype.ready = function () {
        var _this = this;
        HaTags.loadedCallbacks.push(function () { return _this.themeChanged(); });
        Services.get('theme', {
            count: '*',
            schema: '{theme:[name]}',
            order: 'name'
        }, function (result) {
            if (_this.theme.id != 'default') {
                _this.showThemeMenu = false;
                for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                    var theme = _a[_i];
                    if (_this.active(theme, _this.theme)) {
                        result.data[result.data.indexOf(theme)] = _this.theme;
                        break;
                    }
                }
            }
            _this.themes = result.data;
        });
    };
    PanelTheme.prototype.active = function (item, theme) {
        return item.name == theme.name;
    };
    PanelTheme.prototype.getThemeByName = function (name) {
        for (var _i = 0, _a = this.themes; _i < _a.length; _i++) {
            var theme = _a[_i];
            if (theme.name == name)
                return theme;
        }
        return null;
    };
    PanelTheme.prototype.showThemeMenuChanged = function (newVal, oldVal) {
        if (newVal && oldVal !== undefined)
            this.theme = Global.defaultTheme;
    };
    PanelTheme.prototype.shown = function (e) {
        var _this = this;
        var theme = this.$.themeRepeater.modelForElement(e.srcElement).item;
        if (!theme.id) {
            Services.get('theme', {
                name: theme.name,
                schema: '{theme:[id,name,mapid,maplatitude,maplongitude,mapzoom,tagid,' + ContentViewer.contentSchema + ']}',
            }, function (result) {
                _this.theme = result.data[0];
                _this.set('themes.' + _this.themes.indexOf(theme), _this.theme);
            });
        }
        else
            this.theme = theme;
    };
    PanelTheme.prototype.themeChanged = function () {
        if (!App.haTags.tagsLoaded)
            return;
        var routeTopLevels = [];
        if (this.theme.tagid && this.theme != Global.defaultTheme) {
            App.haCollections.getCollectionsByTagId(this.theme.tagid);
            for (var _i = 0, _a = App.haTags.byId[this.theme.tagid].children; _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.isPublicationDestination)
                    routeTopLevels.push((function (tagId) { return { name: tag.singName, shown: false, selected: false, filter: function (collection) { return collection.tags.indexOf(App.haTags.byId[tagId]) > -1; } }; })(tag.id));
            }
        }
        this.set('routeTopLevels', routeTopLevels);
    };
    PanelTheme.prototype.newHaContent = function (content) {
        if (!content)
            return null;
        return new HaContent(content);
    };
    PanelTheme.prototype.hideHeadline = function (theme) {
        return this.isHoD2017(theme);
    };
    PanelTheme.prototype.isHoD2017 = function (theme) {
        return theme.id == 'hod2017';
    };
    PanelTheme.prototype.aboutHoD2017Tap = function () {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[736]));
    };
    PanelTheme.prototype.is1001 = function (theme) {
        return theme.id == '1001';
    };
    PanelTheme.prototype.about1001Tap = function () {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[731]));
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelTheme.prototype, "showThemeMenu", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], PanelTheme.prototype, "theme", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelTheme.prototype, "themes", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], PanelTheme.prototype, "collections", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], PanelTheme.prototype, "collection", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelTheme.prototype, "routeTopLevels", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelTheme.prototype, "show", void 0);
    __decorate([
        observe('showThemeMenu'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean, Boolean]), 
        __metadata('design:returntype', void 0)
    ], PanelTheme.prototype, "showThemeMenuChanged", null);
    __decorate([
        listen('shown'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelTheme.prototype, "shown", null);
    __decorate([
        observe('theme'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTheme.prototype, "themeChanged", null);
    PanelTheme = __decorate([
        component("panel-theme"), 
        __metadata('design:paramtypes', [])
    ], PanelTheme);
    return PanelTheme;
}(polymer.Base));
PanelTheme.register();
