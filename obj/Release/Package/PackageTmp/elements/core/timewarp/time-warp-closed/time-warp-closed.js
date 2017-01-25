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
var TimeWarpClosed = (function (_super) {
    __extends(TimeWarpClosed, _super);
    function TimeWarpClosed() {
        _super.apply(this, arguments);
    }
    TimeWarpClosed.prototype.buttonTap = function (e) {
        this.timeWarpActive = true;
    };
    TimeWarpClosed.prototype.buttonTrack = function (e) {
        e.preventDefault();
        App.map.timeWarp.trackOpen(e);
        this.timeWarpActive = true;
    };
    TimeWarpClosed.prototype.show = function () {
        $(this).css('display', '');
    };
    TimeWarpClosed.prototype.hide = function () {
        $(this).css('display', 'none');
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], TimeWarpClosed.prototype, "timeWarpActive", void 0);
    TimeWarpClosed = __decorate([
        component("time-warp-closed"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpClosed);
    return TimeWarpClosed;
}(polymer.Base));
TimeWarpClosed.register();
