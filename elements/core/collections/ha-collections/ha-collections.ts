@component("ha-collections")
class HaCollections extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    public getCollectionsFromUser() {
        Services.get('collection', { count: 'all', schema: '{collection:[collectionid,title,{userid:' + App.haUsers.user.id + '}]}' }, (result) => { //,{collection_geos:[{collapse:geoid}]}
            //var newCollections: Array<HaCollection> = this.collections;
            for (var data of result.data)
                this.push('collections',new HaCollection(data));
                //newCollections.push(new HaCollection(data));
            //this.set('collections', newCollections);
        })
    }

    public select(collection: HaCollection, addGeo?: HaGeo) {
        this.$.selector.select(collection);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }
    }

    public deselect(collection: HaCollection) {
        this.$.selector.deselect(collection);
    }

    public newRoute(geo?: HaGeo) {
        Common.dom.append(DialogText.create('Angiv titel på rute', (title) => this.newCollection(title, geo)));
    }

    private newCollection(title: string, geo?: HaGeo): HaCollection {
        var collection = new HaCollection({ title: title });
        this.push('collections', collection);
        this.select(collection);
        collection.save(() => {
            if (geo) {
                this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
        return collection;
    }

    @observe('collection')
    collectionChanged() {
        if (!this.collection)
            return;

        if (this.collection.geos.length > 0 || !this.collection.id)
            return;

        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this.collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
            for (var data of result.data) {
                var geo = App.haGeos.geos[data.geoid];
                if (!geo)
                    continue;
                geo.title = data.title;
                this.push('collection.geos', geo);
            }
        })
    }
}

HaCollections.register();