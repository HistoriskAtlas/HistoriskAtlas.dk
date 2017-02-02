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
var PanelLogin = (function (_super) {
    __extends(PanelLogin, _super);
    function PanelLogin() {
        _super.apply(this, arguments);
    }
    PanelLogin.prototype.keyup = function (e) {
        if (e.keyCode == 13)
            this.login();
    };
    PanelLogin.prototype.login = function () {
        var _this = this;
        if (!(this.$.username.validate() && this.$.password.validate()))
            return;
        Services.get('login', { provider: "ha", uname: this.$.username.value, password: $.md5(this.$.password.value) }, function (result) { return _this.getLoginCallback(result); });
    };
    PanelLogin.prototype.loginFB = function () {
        var _this = this;
        FB.login(function (fbToken) {
            FB.api('/me', function (fbUser) {
                Services.get('login', { provider: "facebook", utoken: JSON.stringify(fbUser) }, function (result) { return _this.getLoginCallback(result); });
            });
        }, { scope: 'public_profile, email' });
    };
    PanelLogin.prototype.loginG = function () {
        var _this = this;
        var params = {
            client_id: "364350662015-nssk0tgtoh9d7d0r7brt78mr0utvoi0d.apps.googleusercontent.com",
            immediate: false,
            response_type: "token",
            scope: "https://www.googleapis.com/auth/plus.login"
        };
        gapi.auth.authorize(params, function (UToken) {
            gapi.client.load('plus', 'v1', function () {
                var object = { path: '/plus/v1/people/me' };
                var request = gapi.client.request(object);
                request.then(function (googleToken) {
                    var gplink = 'https://plus.google.com/' + googleToken.result.id;
                    var token = { id: googleToken.result.id, name: googleToken.result.displayName, photo: googleToken.result.image.url, email: googleToken.result.emails[0].value, link: gplink };
                    Services.get('login', { provider: "google-plus", utoken: JSON.stringify(token) }, function (result) { return _this.getLoginCallback(result); });
                }, function (fail) { });
            });
        });
    };
    PanelLogin.prototype.getLoginCallback = function (result) {
        if (result.data.status.code == 1) {
            if (this.remember)
                localStorage.setItem("sessionID", document.sid);
            this.domHost.$.windowbasic.close();
            App.haUsers.login(result.data.user);
            return;
        }
        App.toast.show('Forkert brugernavn eller adgangskode');
    };
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PanelLogin.prototype, "remember", void 0);
    __decorate([
        listen("username.keyup"),
        listen("password.keyup"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], PanelLogin.prototype, "keyup", null);
    __decorate([
        listen("login.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelLogin.prototype, "login", null);
    __decorate([
        listen("loginFB.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelLogin.prototype, "loginFB", null);
    __decorate([
        listen("loginG.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelLogin.prototype, "loginG", null);
    PanelLogin = __decorate([
        component("panel-login"), 
        __metadata('design:paramtypes', [])
    ], PanelLogin);
    return PanelLogin;
}(polymer.Base));
PanelLogin.register();
