@component("time-warp-closed")
class TimeWarpClosed extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    buttonTap(e) {
        this.timeWarpActive = true;
    }

    buttonTrack(e) {
        e.preventDefault();
        App.map.timeWarp.trackOpen(e);
        this.timeWarpActive = true;
    }

    public show() {
        $(this).css('display', '');
    }

    public hide() {
        $(this).css('display', 'none');
    }
}

TimeWarpClosed.register();