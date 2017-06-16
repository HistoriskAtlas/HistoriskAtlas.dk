@component("window-search")
class WindowSearch extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public search: string;

    @property({ type: Array })
    public addresses: Array<Address>;

    constructor(search: string) {
        super();
        this.search = search;
        this.doSearch();
    }
    
    doSearch() {
        this.addresses = [];
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
}

class Address {
    title: string;
    lat: number;
    lng: number;
}

WindowSearch.register();