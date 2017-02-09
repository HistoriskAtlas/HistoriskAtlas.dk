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
var PanelRoute = (function (_super) {
    __extends(PanelRoute, _super);
    function PanelRoute() {
        _super.call(this);
        this.showingUserRouteTopLevel = false;
        this.topLevels = [
            { name: 'Køreruter', shown: false, selected: false, filter: function (collection) { return collection.type == 0; } },
            { name: 'Cykelruter', shown: false, selected: false, filter: function (collection) { return collection.type == 1; } },
            { name: 'Til fods', shown: false, selected: false, filter: function (collection) { return collection.type == 2; } },
            { name: 'spacer', shown: false, selected: false, filter: null },
            { name: 'Under 10 km', shown: false, selected: false, filter: function (collection) { return collection.distance < 10000; } },
            { name: 'Over 10 km', shown: false, selected: false, filter: function (collection) { return collection.distance >= 10000; } }
        ];
    }
    PanelRoute.prototype.showChanged = function () {
        if (this.show)
            App.haCollections.getPublishedCollections();
    };
    PanelRoute.prototype.userChanged = function () {
        if (!this.user.isDefault && !this.showingUserRouteTopLevel) {
            this.unshift('topLevels', { name: 'spacer', shown: false, selected: false, filter: null });
            this.unshift('topLevels', { name: 'Mine ruter', shown: false, selected: false, filter: function (collection) { return collection.userid == App.haUsers.user.id; } });
            this.showingUserRouteTopLevel = true;
        }
        if (this.user.isDefault && this.showingUserRouteTopLevel) {
            this.shift('topLevels');
            this.shift('topLevels');
            this.showingUserRouteTopLevel = false;
        }
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], PanelRoute.prototype, "drawerOpen", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], PanelRoute.prototype, "collections", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], PanelRoute.prototype, "collection", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelRoute.prototype, "topLevels", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelRoute.prototype, "show", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAUser)
    ], PanelRoute.prototype, "user", void 0);
    __decorate([
        observe('show'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelRoute.prototype, "showChanged", null);
    __decorate([
        observe('user'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelRoute.prototype, "userChanged", null);
    PanelRoute = __decorate([
        component("panel-route"), 
        __metadata('design:paramtypes', [])
    ], PanelRoute);
    return PanelRoute;
}(polymer.Base));
PanelRoute.register();
