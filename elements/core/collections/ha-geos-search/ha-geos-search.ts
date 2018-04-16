@component("ha-geos-search")
class HaGeoSearch extends polymer.Base implements polymer.Element {
    @property({ type: String })
    public search: string;

    @property({ type: Object })
    public tag: HaTag;

    @property({ type: Array, notify: true })
    public geos: Array<HaGeo>;

    @property({ type: Object })
    public params: Object;

    ready() {
        this.$.ajax.url = Common.api + 'geo.json';
    }

    @observe("search")
    searchChanged() {
        this.doSearch();
    }

    @observe("tag")
    tagChanged() {
        this.doSearch();
    }

    private doSearch() {
        var params: any = {
            'v': 1,
            'count': 'all',
            'schema': '{geo:{fields:[id,title],filters:[{tag_geo:{tagid:530}}]}}'
        };

        if (this.search)
            params.title = '{like:' + this.search + '}';

        if (this.tag)
            params.tag_geo = '{tagid:' + this.tag.id + '}';

        this.set('params', params);
        this.$.ajax.generateRequest();
    }

    public handleResponse() {
        var result: Array<HaGeo> = [];
        for (var data of this.$.ajax.lastResponse.data) {
            var geo = App.haGeos.geos[data.id];
            if (!geo)
                continue;
            geo.title = data.title;
            result.push(geo)
        }
        this.geos = result;
    }
}

HaGeoSearch.register();