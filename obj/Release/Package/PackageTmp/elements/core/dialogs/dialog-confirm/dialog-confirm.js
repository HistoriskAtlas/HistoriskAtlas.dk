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
var DialogConfirm = (function (_super) {
    __extends(DialogConfirm, _super);
    function DialogConfirm(eventPrefix, question, detail) {
        if (detail === void 0) { detail = null; }
        _super.call(this);
        this.eventPrefix = eventPrefix;
        this.question = question;
        this.detail = detail;
    }
    DialogConfirm.prototype.dialogClosed = function (e) {
        this.fire(this.eventPrefix + (e.detail.confirmed ? '-confirmed' : '-dismissed'), this.detail);
        $(this).remove();
        //this.closeDialog(e.detail.confirmed);
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogConfirm.prototype, "question", void 0);
    __decorate([
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DialogConfirm.prototype, "dialogClosed", null);
    DialogConfirm = __decorate([
        component("dialog-confirm"), 
        __metadata('design:paramtypes', [String, String, Object])
    ], DialogConfirm);
    return DialogConfirm;
}(polymer.Base));
DialogConfirm.register();
//# sourceMappingURL=dialog-confirm.js.map