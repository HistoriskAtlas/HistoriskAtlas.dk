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
var DialogTagSelection = (function (_super) {
    __extends(DialogTagSelection, _super);
    function DialogTagSelection(title, tags, callback) {
        _super.call(this);
        this.title = title;
        this.tags = tags;
        this.callback = callback;
    }
    DialogTagSelection.prototype.tagTap = function (e) {
        this.callback(e.model.item);
    };
    DialogTagSelection.prototype.close = function () {
        $(this).remove();
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogTagSelection.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', Array)
    ], DialogTagSelection.prototype, "tags", void 0);
    __decorate([
        listen('dialog.iron-activate'),
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DialogTagSelection.prototype, "close", null);
    DialogTagSelection = __decorate([
        component("dialog-tag-selection"), 
        __metadata('design:paramtypes', [Object, Array, Function])
    ], DialogTagSelection);
    return DialogTagSelection;
}(polymer.Base));
DialogTagSelection.register();
