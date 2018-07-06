@component("map-controls")
class MapControls extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public lift: boolean;

    @property({ type: Number })
    public mapRotation: number;

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    @property({ type: String })
    public hideClass: string;

    ready() {
        this.hideClass = Common.embed ? '' : 'hide-when-narrow';
    }

    @observe("lift")
    liftChanged(newVal: boolean) {
        $(this).css('margin-bottom', newVal ? '79px' : '15px'); /*64 + 15*/
    }

    //@observe("mapRotation")
    //mapRotationChanged(newVal: number) {
    //    $(this.$.compass).css('display', Math.abs(newVal) < 0.05 ? 'none' : 'initial');
    //}
    hideCompass(rotation: number): boolean {
        return Math.abs(rotation) < 0.05;
    }

    @listen("compass.tap")
    compassTap() {
        App.map.toggleRotation();
    }

    @listen("myLocation.tap")
    myLocationTap() {
        this.timeWarpActive = false;
        App.map.iconLayerNonClustered.toggleYouAreHere();
    }

    @listen("zoomIn.tap")
    zoomInTap() {
        App.map.zoomAnim(0.5);
    }
    @listen("zoomOut.tap")
    zoomOutTap() {
        App.map.zoomAnim(2);
    }
}

MapControls.register();