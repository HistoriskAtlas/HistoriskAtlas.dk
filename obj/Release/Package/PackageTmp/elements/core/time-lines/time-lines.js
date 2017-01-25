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
var TimeLines = (function (_super) {
    __extends(TimeLines, _super);
    function TimeLines() {
        _super.apply(this, arguments);
    }
    TimeLines.prototype.activeChanged = function (newVal) {
        $(this).css('bottom', newVal ? '0px' : '-64px');
    };
    TimeLines.prototype.nudgeChanged = function (newVal) {
        var _this = this;
        if (newVal)
            $(this).addClass('responsive-nudge-timelines');
        else
            $(this).removeClass('responsive-nudge-timelines');
        if (this.intervalHandle || !this.active)
            return;
        this.intervalHandle = setInterval(function () { return _this.domChanged(); }, 1000 / 60);
        $(this).one('webkitTransitionEnd transitionend', function () {
            clearInterval(_this.intervalHandle);
            _this.intervalHandle = null;
        });
    };
    TimeLines.prototype.domChanged = function () {
        this.$.mainTimeLine.updateSize();
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLines.prototype, "active", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLines.prototype, "timeWarpActive", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLines.prototype, "nudge", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], TimeLines.prototype, "year", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], TimeLines.prototype, "timeWarpYear", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLines.prototype, "touchDevice", void 0);
    __decorate([
        observe("active"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean]), 
        __metadata('design:returntype', void 0)
    ], TimeLines.prototype, "activeChanged", null);
    __decorate([
        observe("nudge"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean]), 
        __metadata('design:returntype', void 0)
    ], TimeLines.prototype, "nudgeChanged", null);
    __decorate([
        listen("domChanged"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeLines.prototype, "domChanged", null);
    TimeLines = __decorate([
        component("time-lines"), 
        __metadata('design:paramtypes', [])
    ], TimeLines);
    return TimeLines;
}(polymer.Base));
TimeLines.register();
