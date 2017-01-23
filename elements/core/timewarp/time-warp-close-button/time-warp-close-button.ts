@component("time-warp-close-button")
class TimeWarpCloseButton extends polymer.Base implements polymer.Element {

    @property({ type: Number })
    public mode: TimeWarpModes & number;

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    @listen("button.tap")
    buttonTap() {
        this.timeWarpActive = false;
    }

    constructor() {
        super();
        this.update();
    }

    public update() {
        this.mode = App.map.timeWarp.mode;
        (<TimeWarpButton>this.$.button).update();
    }

    public show() {
        (<TimeWarpButton>this.$.button).show();
    }

    public hide() {
        (<TimeWarpButton>this.$.button).hide();
    }
}

TimeWarpCloseButton.register();