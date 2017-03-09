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
var RedRibbon = (function (_super) {
    __extends(RedRibbon, _super);
    function RedRibbon() {
        _super.apply(this, arguments);
    }
    RedRibbon.prototype.ready = function () {
        var _this = this;
        this.panel = $('#leftPanel:first');
        this.panel.css('-webkit-filter', 'blur(10px)');
        this.panel.css('transition', '-webkit-filter 3s 1s');
        $(document).one('keydown', function () {
            $(_this.$.curtain).css('top', (-$(window).height()) + 'px');
            $(document).one('keydown', function () {
                $(_this.$.scissorsOpen1).css('display', 'none');
                $(_this.$.scissorsOpen2).css('display', 'none');
                $(_this.$.scissorsClosed).css('display', 'inline');
                $(_this).css('opacity', 0);
                _this.panel.css('-webkit-filter', 'none');
                $(_this.$.ribbon1).css('transform', 'rotate(90deg)');
                $(_this.$.ribbon1).css('left', '-100px');
                $(_this.$.ribbon2).css('transform', 'rotate(-90deg)');
                $(_this.$.ribbon2).css('right', '-100px');
                setTimeout(function () {
                    _this.show = false;
                }, 4000);
            });
        });
        $(window).resize(function () {
            _this.updateClip();
        });
        this.updateClip();
    };
    RedRibbon.prototype.updateClip = function () {
        $(this.$.ribbon1).css('clip', 'rect(0px,' + ($(window).width() / 2) + 'px,135px,0px)');
        $(this.$.ribbon2).css('clip', 'rect(0px,10000px,135px,' + ($(window).width() / 2) + 'px)');
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], RedRibbon.prototype, "show", void 0);
    RedRibbon = __decorate([
        component("red-ribbon"), 
        __metadata('design:paramtypes', [])
    ], RedRibbon);
    return RedRibbon;
}(polymer.Base));
RedRibbon.register();
