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
var TimeWarpOpacityButton = (function (_super) {
    __extends(TimeWarpOpacityButton, _super);
    function TimeWarpOpacityButton() {
        var _this = this;
        _super.call(this);
        this.closedHeight = '40px';
        this.openHeight = '195px';
        this.dom = $(this);
        this.update();
        this.dom.css('height', this.closedHeight);
        $(this.$.slider).blur(function () {
            _this.dom.css('height', _this.closedHeight);
        });
        this.$.slider._trackX = function (e) {
            var slider = this;
            if (!slider.dragging) {
                slider._trackStart(e);
            }
            var dx = Math.min(slider._maxx, Math.max(slider._minx, (-1 * e.detail.dy)));
            slider._x = slider._startx + dx;
            var immediateValue = slider._calcStep(slider._calcKnobPosition(slider._x / slider._w));
            slider._setImmediateValue(immediateValue);
            var translateY = ((slider._calcRatio(immediateValue) * slider._w) - slider._knobstartx);
            slider.translate3d(translateY + 'px', 0, 0, slider.$.sliderKnob);
        };
        this.$.slider._bardown = function (event) {
            var slider = this;
            slider._w = slider.$.sliderBar.offsetWidth;
            var rect = slider.$.sliderBar.getBoundingClientRect();
            var ratio = ((rect.bottom - event.detail.y) / slider._w);
            var prevRatio = slider.ratio;
            slider._setTransiting(true);
            slider._positionKnob(ratio);
            slider.debounce('expandKnob', slider._expandKnob, 60);
            if (prevRatio === slider.ratio) {
                slider._setTransiting(false);
            }
            slider.async(function () {
                slider.fire('change');
            });
            event.preventDefault();
        };
    }
    TimeWarpOpacityButton.prototype.buttonOnlyTap = function () {
        var _this = this;
        if (this.dom.css('height') == this.closedHeight) {
            this.dom.css('height', this.openHeight);
            setTimeout(function () { return $(_this.$.slider).focus(); }, 400);
        }
    };
    TimeWarpOpacityButton.prototype.valueChanged = function () {
        App.map.timeWarp.setOpacity(this.value);
    };
    TimeWarpOpacityButton.prototype.update = function () {
        this.mode = App.map.timeWarp.mode;
        this.$.button.update();
    };
    TimeWarpOpacityButton.prototype.show = function () {
        this.$.button.show();
    };
    TimeWarpOpacityButton.prototype.hide = function () {
        this.$.button.hide();
    };
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Object)
    ], TimeWarpOpacityButton.prototype, "mode", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], TimeWarpOpacityButton.prototype, "value", void 0);
    __decorate([
        listen("button.buttonOnlyTap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeWarpOpacityButton.prototype, "buttonOnlyTap", null);
    __decorate([
        observe("value"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeWarpOpacityButton.prototype, "valueChanged", null);
    TimeWarpOpacityButton = __decorate([
        component("time-warp-opacity-button"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpOpacityButton);
    return TimeWarpOpacityButton;
}(polymer.Base));
TimeWarpOpacityButton.register();
