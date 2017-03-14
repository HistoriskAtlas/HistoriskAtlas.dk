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
var PanelEditorialNotes = (function (_super) {
    __extends(PanelEditorialNotes, _super);
    function PanelEditorialNotes() {
        _super.apply(this, arguments);
    }
    PanelEditorialNotes.prototype.sort = function (a, b) {
        return a.created > b.created ? -1 : 1;
    };
    PanelEditorialNotes.prototype.createdTime = function (created) {
        return Common.shortTime(created);
    };
    PanelEditorialNotes.prototype.createdDate = function (created) {
        return Common.shortDate(created);
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaContent)
    ], PanelEditorialNotes.prototype, "content", void 0);
    PanelEditorialNotes = __decorate([
        component("panel-editorial-notes"), 
        __metadata('design:paramtypes', [])
    ], PanelEditorialNotes);
    return PanelEditorialNotes;
}(polymer.Base));
PanelEditorialNotes.register();
//# sourceMappingURL=panel-editorial-notes.js.map