@component("main-search")
class MainSearch extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true, value: false })
    public open: boolean;

    ready() {
        if (App.passed.search)
            this.doSearch(App.passed.search);
    }

    searchIconTap() {
        if (!this.open) {
            this.open = true;
            $(this.$.searchInput).focus();
        } else
            this.doSearch(this.$.searchInput.value);
    }

    containerClass(open: boolean): string {
        return open ? 'expanded' : ''; 
    }

    searchCloseTap() {
        this.doSearch(null);
    }

    @listen("searchInput.keyup")
    searchInputKeyup(e: KeyboardEvent) {
        if (e.keyCode == 13) {
            $(this.$.searchInput).blur();
            this.doSearch(this.$.searchInput.value);
        }
    }

    @observe('open')
    openChanged() {
        if (this.open)
            $(this).addClass('expanded');
        else
            $(this).removeClass('expanded');
    }

    private doSearch(value: string) {
        this.open = false;
        setTimeout(() => this.$.searchInput.value = '', 300);
        if (!value)
            return;

        switch (value) {
            case 'devtools': Common.dom.append(WindowDev.create()); break;
            case 'nmpoc': this.NM_POC(); break;
            case 'nmpoconly': {                
                if (App.haTags)
                    App.haTags.toggleTop(9, false);
                else
                    UrlState.stateObject.t = '-A9-A9-AG';
                this.NM_POC();
                break;
            }
            default: Common.dom.append(WindowSearch.create(value)); break;
        }
    }

    private NM_POC() {
        //App.haTags.toggleTop(9, false);

        var queryObject = {
            "size": 500,
            "from": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term":
                            {
                                "type": "asset"
                            }
                        },
                        {
                            "bool": {
                                "should": [
                                    {
                                        "exists":
                                        {
                                            "field": "location.crowd.latitude"
                                        }
                                    },
                                    {
                                        "exists":
                                        {
                                            "field": "location.verified.latitude"
                                        }
                                    }

                                ]
                            }
                        }
                    ],
                    "must_not": [ //default filter
                        { "range": { "meta.rotation": { "gt": 1 } } },
                        { "term": { "meta.cropping": "source" } },
                        {
                            "bool": {
                                "must": [
                                    { "term": { "collection.keyword": "AS" } },
                                    { "term": { "type.keyword": "object" } }
                                ]
                            }
                        },
                        { "term": { "collection.keyword": "flmlibrary" } },
                        { "term": { "collection.keyword": "DODMR" } },
                        {
                            "bool": {
                                "must": [
                                    { "term": { "collection.keyword": "MUM" } },
                                    { "term": { "type.keyword": "asset" } }
                                ]
                            }
                        },
                        {
                            "bool": {
                                "must": [
                                    { "term": { "collection.keyword": "KMM" } },
                                    { "term": { "type.keyword": "asset" } }
                                ]
                            }
                        },
                        {
                            "bool": {
                                "must": [
                                    { "term": { "collection.keyword": "DO" } },
                                    { "term": { "type.keyword": "object" } }
                                ]
                            }
                        }
                    ]
                }
            }
        };

        this.fetchFromNM(queryObject);
    }

    private fetchFromNM(queryObject: any) {
        $.ajax('https://api.natmus.dk/search/public/raw', {
            type: 'POST',
            data: JSON.stringify(queryObject),
            contentType: 'application/json'
        }).done((data) => {
            for (var hit of data.hits.hits) {

                var geo = new HaGeo({
                    title: hit._source.text['da-DK'].title,
                    lat: hit._source.location.verified.latitude ? hit._source.location.verified.latitude : hit._source.location.crowd.latitude,
                    lng: hit._source.location.verified.longitude ? hit._source.location.verified.longitude : hit._source.location.crowd.longitude,
                    imageOnlyUrl: 'http://cumulus.natmus.dk/CIP/preview/thumbnail/' + hit._source.collection + '/' + hit._source.id
                }, true, false);

            }
            IconLayer.updateShown();

            if (data.hits.hits.length == queryObject.size) {
                queryObject.from += queryObject.size;
                this.fetchFromNM(queryObject)
            }

        });

    }
}

MainSearch.register();