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
var MitAtlasButton = (function (_super) {
    __extends(MitAtlasButton, _super);
    function MitAtlasButton() {
        _super.apply(this, arguments);
    }
    MitAtlasButton.prototype.ready = function () {
        this.isDevOrBeta = Common.isDevOrBeta;
    };
    MitAtlasButton.prototype.buttonTap = function () {
        //if (!App.isDev) {
        //    App.toast.show('Vi oplever i øjeblikket problemer med at logge ind. Kom tilbage igen lidt senere!');
        //    return;
        //}
        if (App.haUsers.user.isDefault)
            Common.dom.append(WindowLogin.create());
    };
    MitAtlasButton.prototype.buttonPaperDropdownOpen = function () {
        //this.$.menu.selected = null;
        if (App.haUsers.user.isDefault)
            this.$.button.close();
    };
    MitAtlasButton.prototype.newGeoTap = function () {
        if (!App.haUsers.user.isActive) {
            App.toast.show('Du kan ikke oprette en fortælling, før brugeren er aktiveret. Se mail sendt til ' + App.haUsers.user.email + '.');
            return;
        }
        App.haGeos.newGeo();
    };
    MitAtlasButton.prototype.newRouteTap = function () {
        App.haCollections.newRoute();
    };
    MitAtlasButton.prototype.profileTap = function () {
        $(this).append(WindowProfile.create());
    };
    MitAtlasButton.prototype.newsTap = function () {
        $(this).append(WindowUserNews.create());
    };
    MitAtlasButton.prototype.adminTap = function () {
        $(this).append(WindowAdmin.create());
    };
    MitAtlasButton.prototype.editorialTap = function () {
        $(this).append(WindowEditorial.create());
    };
    MitAtlasButton.prototype.logOutTap = function () {
        Services.get('exit', {}, function (result) {
            if (result.data.status.code == 2)
                App.haUsers.set('user', HAUser.default);
            //else
            //    error logging out
        });
    };
    MitAtlasButton.prototype.noAnimations = function (user) {
        return user.isDefault;
    };
    MitAtlasButton.prototype.text = function (user) {
        return user.isDefault ? 'Log ind på' : user.firstname;
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAUser)
    ], MitAtlasButton.prototype, "user", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], MitAtlasButton.prototype, "isDevOrBeta", void 0);
    __decorate([
        listen("button.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MitAtlasButton.prototype, "buttonTap", null);
    __decorate([
        listen("button.paper-dropdown-open"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MitAtlasButton.prototype, "buttonPaperDropdownOpen", null);
    MitAtlasButton = __decorate([
        component("mit-atlas-button"), 
        __metadata('design:paramtypes', [])
    ], MitAtlasButton);
    return MitAtlasButton;
}(polymer.Base));
MitAtlasButton.register();
//# sourceMappingURL=mit-atlas-button.js.map