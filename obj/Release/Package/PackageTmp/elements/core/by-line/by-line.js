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
var ByLine = (function (_super) {
    __extends(ByLine, _super);
    function ByLine() {
        _super.apply(this, arguments);
    }
    ByLine.prototype.show1001User = function (institution) {
        return institution.id == 731; //1001 institution
    };
    ByLine.prototype.showUser = function (institutions, user) {
        return institutions.length == 0 && user != null;
    };
    ByLine.prototype.institutionTap = function (e) {
        Common.dom.append(WindowInstitution.create(e.model.item));
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], ByLine.prototype, "institutions", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAUser)
    ], ByLine.prototype, "user", void 0);
    ByLine = __decorate([
        component("by-line"), 
        __metadata('design:paramtypes', [])
    ], ByLine);
    return ByLine;
}(polymer.Base));
ByLine.register();
//# sourceMappingURL=by-line.js.map