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
var TimeLineSlider = (function (_super) {
    __extends(TimeLineSlider, _super);
    function TimeLineSlider() {
        _super.apply(this, arguments);
    }
    TimeLineSlider.prototype.ready = function () {
        this.$.slider._trackX = function (e) {
            var slider = this;
            if (!slider.dragging) {
                slider._trackStart(e);
            }
            var dx = Math.min(slider._maxx, Math.max(slider._minx, (-1 * e.detail.dy)));
            slider._x = slider._startx + dx;
            var immediateValue = slider._calcStep(slider._calcKnobPosition(slider._x / slider._w));
            slider._setImmediateValue(immediateValue);
            // update knob's position
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
            // if the ratio doesn't change, sliderKnob's animation won't start
            // and `_knobTransitionEnd` won't be called
            // Therefore, we need to manually update the `transiting` state
            if (prevRatio === slider.ratio) {
                slider._setTransiting(false);
            }
            slider.async(function () {
                slider.fire('change');
            });
            // cancel selection
            event.preventDefault();
        };
    };
    __decorate([
        property({ type: Number, value: 10, notify: true }), 
        __metadata('design:type', Number)
    ], TimeLineSlider.prototype, "value", void 0);
    TimeLineSlider = __decorate([
        component("time-line-slider"), 
        __metadata('design:paramtypes', [])
    ], TimeLineSlider);
    return TimeLineSlider;
}(polymer.Base));
TimeLineSlider.register();
//# sourceMappingURL=time-line-slider.js.map