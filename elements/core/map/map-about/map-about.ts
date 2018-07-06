@component("map-about")
class MapAbout extends polymer.Base implements polymer.Element {

    @property({ type: Object})
    public map: HaMap;

    @property({ type: Number })
    public timeWarpMode: TimeWarpModes;

    @property({ type: Boolean })
    public embed: boolean;

    ready() {
        this.embed = Common.embed;
    }

    hide(tagline: string, timeWarpMode: number) {
        return !tagline || (!(timeWarpMode == TimeWarpModes.SPLIT)) || this.embed;
    }

    year(startYear: number, endYear: number): string {
        return Common.years(startYear, endYear)
    }

    //@observe('timeWarpMode') 
    //timeWarpModeChanged() {
    //    alert(this.timeWarpMode)
    //}
}

MapAbout.register();