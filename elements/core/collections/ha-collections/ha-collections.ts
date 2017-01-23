@component("ha-collections")
class HaCollections extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    //constructor() {
    //    super();
    //    //this.collections.push(new HaCollection({ id: 42, title: 'Default rute' }))
    //}

    ready() {
        this.$.ajax.url = Common.api + 'collection.json';
    }

    public handleResponse() {
        this.$.ajax.lastResponse.forEach(data => {
            //newMaps.push(newMap);
        });
        //this.maps = newMaps;

    }

    public newCollection(title: string): HaCollection {
        var collection = new HaCollection({ title: title });
        collection.save();
        return collection;
    }
}

HaCollections.register();