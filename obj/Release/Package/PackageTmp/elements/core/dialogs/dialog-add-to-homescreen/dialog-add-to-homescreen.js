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
var DialogAddToHomescreen = (function (_super) {
    __extends(DialogAddToHomescreen, _super);
    function DialogAddToHomescreen(os) {
        _super.call(this);
        this.os = os;
    }
    DialogAddToHomescreen.prototype.dismissTap = function () {
        LocalStorage.set('dismissedAddAsApp', 'true');
    };
    DialogAddToHomescreen.prototype.isAndroid = function (os) {
        return os == 'android';
    };
    DialogAddToHomescreen.prototype.isIOS = function (os) {
        return os == 'ios';
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogAddToHomescreen.prototype, "os", void 0);
    DialogAddToHomescreen = __decorate([
        component("dialog-add-to-homescreen"), 
        __metadata('design:paramtypes', [String])
    ], DialogAddToHomescreen);
    return DialogAddToHomescreen;
}(polymer.Base));
DialogAddToHomescreen.register();
