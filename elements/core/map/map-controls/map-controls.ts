@component("map-controls")
class MapControls extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public lift: boolean;

    @property({ type: Number })
    public mapRotation: number;

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    @observe("lift")
    liftChanged(newVal: boolean) {
        $(this).css('margin-bottom', newVal ? '79px' : '15px'); /*64 + 15*/
    }

    @observe("mapRotation")
    mapRotationChanged(newVal: number) {
        $(this.$.compass).css('display', Math.abs(newVal) < 0.05 ? 'none' : 'initial');
    }

    @listen("compass.tap")
    compassTap() {
        App.map.toggleRotation();
    }

    @listen("myLocation.tap")
    myLocationTap() {
        App.toast.show("Finder din position...");
        navigator.geolocation.getCurrentPosition((pos) => {
            App.toast.show("Din position blev fundet.");
            App.map.centerAnim([pos.coords.longitude, pos.coords.latitude], Math.max(pos.coords.accuracy, 200));
            this.timeWarpActive = false;
        }, (error) => {
            App.toast.show("Din position blev IKKE fundet. Har du husket at give tilladelse til, at vi må bruge din position?");
        });
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