@component("window-search")
class WindowSearch extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public search: string;

    @property({ type: String })
    public fallbackSearch: string;

    @property({ type: String, value: '' })
    public didYouMean: string;

    @property({ type: String, value: true })
    public searchInProgress: boolean;

    @property({ type: Array })
    public googleResults: Array<GoogleResult>;

    @property({ type: Array })
    public geos: Array<HaGeo>;

    @property({ type: Array })
    public addresses: Array<Address>;

    constructor(search: string) {
        super();
        this.search = search;
        this.doSearch();

        //Can do paging by setting num = 10 and start = 11.......

    }
    
    doSearch() {
        this.searchInProgress = true;
        this.googleResults = [];
        this.addresses = [];
        this.didYouMean = '';
        $.getJSON("https://www.googleapis.com/customsearch/v1?q=" + this.search + "&key=AIzaSyAghy4ufGMclOCsaEPsLLF_lk_rALYezds&cx=015044497176521657010:pfssikn7wii&fields=items(link,htmlTitle,htmlSnippet),searchInformation/totalResults,spelling/correctedQuery&num=10", (data) => {

            if (data.spelling)
                this.didYouMean = data.spelling.correctedQuery;
                        
            if (data.items) {
                var reSnippet = /<br>/g;
                for (var item of data.items) {

                    var matches = /_\((\d+)\)/g.exec(item.link)
                    if (!matches)
                        continue;

                    var result = new GoogleResult();
                    result.geoid = parseInt(matches[1]);
                    result.title = item.htmlTitle.replace(' | Historisk Atlas', '');
                    result.snippet = item.htmlSnippet.replace(reSnippet, '');

                    this.push('googleResults', result);
                }
            }
                //if (!data.error)
                //this.searchIsDone = true;

                //if (data.error)
                //    this.fallbackSearch = this.search;

            this.searchInProgress = false;
            
        }).fail(() => {
            this.searchInProgress = false;
            this.fallbackSearch = this.search;
        }).always(() => {
            this.doSearchAddress();
        });
    }

    doSearchAddress() {
        $.getJSON(location.protocol + "//nominatim.openstreetmap.org/search?q=" + this.search + "&format=json&addressdetails=1&countrycodes=dk&email=it@historiskatlas.dk", (data) => {
            for (var place of data) {
                if (place.address) {
                    var address = new Address();
                    address.lat = parseFloat(place.lat);
                    address.lng = parseFloat(place.lon);
                    address.title = '';
                    if (place.address.road) {
                        address.title += place.address.road;
                        if (place.address.house_number)
                            address.title += ' ' + place.address.house_number;
                    }
                    var types: Array<String> = [];
                    for (var type of ['hamlet', 'village', 'town', 'city'])
                        if (place.address[type])
                            types.push(place.address[type]);

                    if (types.length > 0)
                        address.title += (address.title.length > 0 ? ', ' : '') + types.join(', ');

                    for (var otherAddress of this.addresses)
                        if (otherAddress.title == address.title) {
                            address.title = '';
                            break;
                        }

                    if (address.title.length == 0)
                        continue;

                    this.push('addresses', address)
                }
            }
        });
    }

    geoTap(e: any) {
        var geo = <HaGeo>e.model.geo;
        Common.dom.append(WindowGeo.create(geo));
        App.map.centerAnim(geo.coord, 1000, true)
    }

    addressTap(e: any) {
        var address: Address = <Address>e.model.address;
        App.map.centerAnim([address.lng, address.lat], 1000);
        (<WindowBasic>this.$.windowbasic).close();
    }

    didYouMeanTap() {
        this.search = this.didYouMean;
        this.doSearch();
    }

    showDidYouMean(didYouMean: string): boolean {
        return !!didYouMean;
    }

    showNoResultsText(searchInProgress: boolean, googleResultsLength: number, geosLength: number): boolean {
        return !searchInProgress && googleResultsLength == 0 && geosLength == 0;
    }
}

class Address {
    title: string;
    lat: number;
    lng: number;
}

class GoogleResult {
    title: string;
    snippet: string;
    geoid: number;
}

WindowSearch.register();