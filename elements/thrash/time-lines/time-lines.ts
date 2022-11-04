@component("time-lines")
class TimeLines extends polymer.Base implements polymer.Element {
    @property({ type: Boolean })
    public active: boolean;

    @property({ type: Boolean })
    public timeWarpActive: boolean;

    @property({ type: Boolean })
    public nudge: boolean;

    @property({ type: Number, notify: true })
    public year: number;

    @property({ type: Number, notify: true })
    public timeWarpYear: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    private intervalHandle: number;

    @observe("active")
    activeChanged(newVal: boolean) {
        $(this).css('bottom', newVal ? '0px' : '-64px');
    }

    @observe("nudge")
    nudgeChanged(newVal: boolean) {
        if (newVal)
            $(this).addClass('responsive-nudge-timelines')
        else
            $(this).removeClass('responsive-nudge-timelines')

        if (this.intervalHandle || !this.active)
            return;

        this.intervalHandle = setInterval(() => this.domChanged(), 1000 / 60)
        $(this).one('webkitTransitionEnd transitionend', () => {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        })
    }

    @listen("domChanged")
    domChanged() {
        this.$.mainTimeLine.updateSize();
        //if (this.timeWarpActive)
        //    this.$$('#timeWarpTimeLine').updateSize();
    }
}

TimeLines.register();