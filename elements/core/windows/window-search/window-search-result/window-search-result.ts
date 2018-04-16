@component("window-search-result")
class WindowSearchResult extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public result: GoogleResult;

    @property({ type: String })
    public defaultMarker: string;

    constructor(search: string) {
        super();
        this.defaultMarker = Icon.defaultMarker;

        this.$.title.innerHTML = this.result.title;
        this.$.snippet.innerHTML = this.result.snippet;
    }

    resultTap(e: any) {
        Common.geoClick(this.result.geoid);
        var geo = App.haGeos.geos[this.result.geoid];
        if (geo)
            App.map.centerAnim(geo.coord, 1000, true)
    }

}

WindowSearchResult.register();