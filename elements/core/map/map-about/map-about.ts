@component("map-about")
class MapAbout extends polymer.Base implements polymer.Element {

    @property({ type: Object})
    public map: HaMap;

    @property({ type: Boolean })
    public timeWarpActive: boolean;

    hide(tagline: string) {
        return !tagline;
    }
}

MapAbout.register();