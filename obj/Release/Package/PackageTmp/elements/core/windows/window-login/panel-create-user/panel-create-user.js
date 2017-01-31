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
var PanelCreateUser = (function (_super) {
    __extends(PanelCreateUser, _super);
    function PanelCreateUser() {
        _super.apply(this, arguments);
        this.exisitingLogins = [];
    }
    PanelCreateUser.prototype.validatePassword = function (newValue, oldValue) {
        if (oldValue == undefined)
            return false;
        if (!this.$.inputPassword1.validate() || !this.$.inputPassword2.validate())
            return false;
        if (this.password1 != this.password2) {
            this.$.inputPassword2.invalid = true;
            return false;
        }
        return true;
    };
    PanelCreateUser.prototype.passwordErrorMessage = function (password) {
        if (password.length == 0)
            return 'Adgangskoden skal udfyldes';
        if (password.length < 6)
            return 'Minimumslængde på 6 tegn';
        return 'Adgangskoderne er ikke ens';
    };
    PanelCreateUser.prototype.validateLogin = function (newValue, oldValue) {
        if (oldValue == undefined)
            return false;
        if (!this.$.inputLogin.validate())
            return false;
        if (this.exisitingLogins.indexOf(newValue) > -1) {
            this.$.inputLogin.invalid = true;
            return false;
        }
        return true;
    };
    PanelCreateUser.prototype.loginErrorMessage = function (login) {
        if (login.length == 0)
            return 'Brugernavn skal udfyldes';
        return 'Brugernavnet findes allerede';
    };
    PanelCreateUser.prototype.createUser = function () {
        var _this = this;
        if (!(this.validateLogin(this.login, this.login) && this.$.inputFirstname.validate() && this.$.inputLastname.validate() && this.$.inputEmail.validate() && this.validatePassword('new', 'old'))) {
            App.toast.show('Ikke alle felter er udfyldt korrekt');
            return;
        }
        if (!this.accepted) {
            App.toast.show('Du skal acceptere betingelser for anvendelse for at fortsætte');
            return;
        }
        Services.get('login', {
            provider: "ha", utoken: JSON.stringify({
                login: this.login,
                pass: $.md5(this.password1),
                email: this.email,
                firstname: this.firstname,
                lastname: this.lastname,
                role: 2 //Has no effect(?)
            })
        }, function (result) {
            if (result.data.status.code == 1) {
                App.haUsers.login(result.data.user);
                _this.$.confirmationDialog.open();
            }
            else {
                App.toast.show("Brugernavnet findes allerede. Vælg et andet.");
                _this.exisitingLogins.push(_this.login);
                _this.validateLogin(_this.login, _this.login);
            }
        });
    };
    PanelCreateUser.prototype.termsOfUseTap = function () {
        Common.dom.append(WindowTermsOfUse.create());
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "login", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "firstname", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "lastname", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "email", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "password1", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PanelCreateUser.prototype, "password2", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelCreateUser.prototype, "accepted", void 0);
    __decorate([
        observe('password1'),
        observe('password2'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String, String]), 
        __metadata('design:returntype', Boolean)
    ], PanelCreateUser.prototype, "validatePassword", null);
    __decorate([
        observe('login'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String, String]), 
        __metadata('design:returntype', Boolean)
    ], PanelCreateUser.prototype, "validateLogin", null);
    PanelCreateUser = __decorate([
        component("panel-create-user"), 
        __metadata('design:paramtypes', [])
    ], PanelCreateUser);
    return PanelCreateUser;
}(polymer.Base));
PanelCreateUser.register();
//# sourceMappingURL=panel-create-user.js.map