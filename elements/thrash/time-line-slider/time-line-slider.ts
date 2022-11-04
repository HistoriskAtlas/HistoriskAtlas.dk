@component("time-line-slider")
class TimeLineSlider extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 10, notify: true })
    public value: number;

    ready() {
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
        }

    }

}

TimeLineSlider.register();