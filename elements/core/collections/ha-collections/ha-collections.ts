@component("ha-collections")
class HaCollections extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection> = [];

    //ready() {
    //}

    public getCollectionsFromUser() {
        Services.get('collection', { count: 'all', schema: '{collection:[collectionid,title,{userid:' + App.haUsers.user.id + '}]}' }, (result) => { //,{collection_geos:[{collapse:geoid}]}
            //var newCollections: Array<HaCollection> = this.collections;
            for (var data of result.data)
                this.push('collections',new HaCollection(data));
                //newCollections.push(new HaCollection(data));
            //this.set('collections', newCollections);
        })
    }


    public newCollection(title: string): HaCollection {
        var collection = new HaCollection({ title: title });
        this.push('collections', collection);
        collection.save();
        return collection;
    }
}

HaCollections.register();