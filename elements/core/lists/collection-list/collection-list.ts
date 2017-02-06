@component("collection-list")
class CollectionList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public topLevels: Array<ICollectionTopLevel>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    toggleShown(e: any) {
        var topLevel = <ICollectionTopLevel>e.model.topLevel;
        this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.shown', !topLevel.shown);
    }
    isSpacer(topLevel: ICollectionTopLevel): boolean {
        return topLevel.name == 'spacer';
    }

    collectionTap(e: any) {
        App.haCollections.select(<HaCollection>e.model.collection);
    }

}

interface ICollectionTopLevel {
    name: string;
    shown: boolean;
    filter: (collection) => boolean;
}

CollectionList.register();