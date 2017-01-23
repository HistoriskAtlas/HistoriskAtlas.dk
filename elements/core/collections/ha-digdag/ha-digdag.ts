@component("ha-digdag")
class HaDigDag extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public digdags: Array<HARegionTypeCategory>;

    ready() {
        this.$.ajax.url = Common.api + 'regiontypecategory.json?v=1&count=all&parentid=0&schema={regiontypecategory:[id,name,{regiontypes:[regiontypeid,name,periodstart,periodend]}]}';
    }

    public getData() {
        var digdagJSON = LocalStorage.get('ha-digdag', 7 * 24);
        if (digdagJSON) {
            var data = JSON.parse(digdagJSON);
            if (data instanceof Array) {
                this.handleData(data);
                return;
            }
        }

        this.$.ajax.generateRequest();
    }

    private handleResponse() {
        LocalStorage.set('ha-digdag', JSON.stringify(this.$.ajax.lastResponse.data), true);
        this.handleData(this.$.ajax.lastResponse.data);
    }

    private handleData(data: Array<Object>) {
        var result: Array<HARegionTypeCategory> = []
        data.forEach(data => {
            var regionTypeCategory: HARegionTypeCategory = new HARegionTypeCategory(data);
            result.push(regionTypeCategory);
        });
        this.digdags = result;
    }
}

HaDigDag.register();