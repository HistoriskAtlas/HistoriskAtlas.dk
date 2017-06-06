@component("map-about")
class MapAbout extends polymer.Base implements polymer.Element {

    @property({ type: Object})
    public map: HaMap;

    @property({ type: Number })
    public timeWarpMode: TimeWarpModes;

    hide(tagline: string, timeWarpMode: number) {
        return !tagline || (!(timeWarpMode == TimeWarpModes.SPLIT));
    }

    //@observe('timeWarpMode') 
    //timeWarpModeChanged() {
    //    alert(this.timeWarpMode)
    //}
}

MapAbout.register();