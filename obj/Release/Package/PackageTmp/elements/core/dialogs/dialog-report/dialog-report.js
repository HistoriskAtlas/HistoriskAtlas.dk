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
var DialogReport = (function (_super) {
    __extends(DialogReport, _super);
    function DialogReport() {
        _super.apply(this, arguments);
    }
    DialogReport.prototype.open = function () {
        this.$.dialog.open();
    };
    DialogReport.prototype.reportLicensViolation = function () {
        this.report(723);
    };
    DialogReport.prototype.reportFalseInformation = function () {
        this.report(724);
    };
    DialogReport.prototype.reportOffensiveContent = function () {
        this.report(725);
    };
    DialogReport.prototype.report = function (tagID) {
        this.push('geo.tags2', App.haTags.byId[tagID]);
        this.$.dialogDone.open();
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaGeo)
    ], DialogReport.prototype, "geo", void 0);
    DialogReport = __decorate([
        component("dialog-report"), 
        __metadata('design:paramtypes', [])
    ], DialogReport);
    return DialogReport;
}(polymer.Base));
DialogReport.register();
//# sourceMappingURL=dialog-report.js.map