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
var ConfirmInput = (function (_super) {
    __extends(ConfirmInput, _super);
    function ConfirmInput() {
        _super.apply(this, arguments);
    }
    ConfirmInput.prototype.iconTap = function () {
        this.disabled = !this.disabled;
        if (!this.disabled)
            this.$$('#paperInput').focus();
        else
            this.value = this.immediateValue;
    };
    ConfirmInput.prototype.valueChanged = function () {
        this.immediateValue = this.value;
    };
    ConfirmInput.prototype.disabledChanged = function () {
        var input = this.$$('#paperInput');
        if (input)
            input.updateStyles();
    };
    ConfirmInput.prototype.icon = function (disabled) {
        return disabled ? 'create' : 'check';
    };
    ConfirmInput.prototype.paperInputFocusout = function (e) {
        if (this.contains(e.relatedTarget))
            return;
        this.disabled = true;
        if (this.value != this.immediateValue)
            $(this).append(DialogConfirm.create('save-changes', 'Vil du gemme ændringerne i feltet "' + this.label + '"?'));
    };
    ConfirmInput.prototype.saveChangesConfirmed = function (e) {
        this.value = this.immediateValue;
    };
    ConfirmInput.prototype.saveChangesDismissed = function (e) {
        this.immediateValue = this.value;
    };
    __decorate([
        property({ type: String, notify: true }), 
        __metadata('design:type', String)
    ], ConfirmInput.prototype, "value", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ConfirmInput.prototype, "immediateValue", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ConfirmInput.prototype, "label", void 0);
    __decorate([
        property({ type: Boolean, value: true }), 
        __metadata('design:type', Boolean)
    ], ConfirmInput.prototype, "disabled", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], ConfirmInput.prototype, "multiline", void 0);
    __decorate([
        observe('value'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], ConfirmInput.prototype, "valueChanged", null);
    __decorate([
        observe('disabled'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], ConfirmInput.prototype, "disabledChanged", null);
    __decorate([
        listen('save-changes-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ConfirmInput.prototype, "saveChangesConfirmed", null);
    __decorate([
        listen('save-changes-dismissed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ConfirmInput.prototype, "saveChangesDismissed", null);
    ConfirmInput = __decorate([
        component("confirm-input"), 
        __metadata('design:paramtypes', [])
    ], ConfirmInput);
    return ConfirmInput;
}(polymer.Base));
ConfirmInput.register();
