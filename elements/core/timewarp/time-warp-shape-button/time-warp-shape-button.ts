@component("time-warp-shape-button")
class TimeWarpShapeButton extends polymer.Base implements polymer.Element {

    @property({ type: Number })
    public mode: TimeWarpModes & number;

    //private dom: JQuery;

    @listen("button.tap")
    buttonTap() {
        App.map.timeWarp.toggleMode();
    }

    constructor() {
        super();
        //this.dom = $(this);
        this.update();
    }

    private icon(mode: TimeWarpModes): string {
        return mode == TimeWarpModes.SPLIT ? 'radio-button-unchecked' : 'check-box-outline-blank';
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

TimeWarpShapeButton.register();