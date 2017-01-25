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
var WindowProfile = (function (_super) {
    __extends(WindowProfile, _super);
    function WindowProfile() {
        _super.call(this);
        this.user = App.haUsers.user;
    }
    WindowProfile.prototype.userPropsChanged = function (e) {
        App.haUsers.notifyPath(e.path, e.value);
    };
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], WindowProfile.prototype, "selectedTab", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowProfile.prototype, "user", void 0);
    __decorate([
        observe('user.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowProfile.prototype, "userPropsChanged", null);
    WindowProfile = __decorate([
        component("window-profile"), 
        __metadata('design:paramtypes', [])
    ], WindowProfile);
    return WindowProfile;
}(polymer.Base));
WindowProfile.register();
