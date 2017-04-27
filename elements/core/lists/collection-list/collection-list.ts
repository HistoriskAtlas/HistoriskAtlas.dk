@component("collection-list")
class CollectionList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public topLevels: Array<ICollectionTopLevel>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Boolean, value: false })
    public defaultSelected: boolean;

    @property({ type: Boolean })
    public userCreators: boolean;

    @property({ type: Boolean })
    public profCreators: boolean;

    private static ignoreCollectionChanges: boolean = false;
    private static collectionLists: Array<CollectionList> = [];

    ready() {
        CollectionList.collectionLists.push(this); //TODO: remove again?
    }

    toggleShown(e: any) {
        var topLevel = <ICollectionTopLevel>e.model.topLevel;
        this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.shown', !topLevel.shown);
    }
    isSpacer(topLevel: ICollectionTopLevel): boolean {
        return topLevel.name == 'spacer';
    }
    isOpen(openCollection: HaCollection, collection: HaCollection) {
        return openCollection == collection;
    }

    collectionTap(e: any) {
        App.haCollections.select(<HaCollection>e.model.item);
    }

    checkboxTap(e: any) {
        var topLevel: ICollectionTopLevel = e.model.topLevel;
        //this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.selected', !topLevel.selected);

        CollectionList.ignoreCollectionChanges = true;

        for (var collection of this.collections)
            if (topLevel.filter(collection))
                this.set('collections.' + this.collections.indexOf(collection) + '.selected', !topLevel.selected);

        CollectionList.ignoreCollectionChanges = false;

        for (var list of CollectionList.collectionLists)
            list.updateTopLevelSelections();
        
        e.cancelBubble = true;
        e.stopPropagation();
    }

    @observe('collections.*')
    collectionsChanged(changeRecord: any) {
        if (CollectionList.ignoreCollectionChanges)
            return;

        var path: Array<string> = changeRecord.path.split('.');
        if (path.length != 3)
            return
        if (path[2] != 'selected')
            return;

        this.updateTopLevelSelections();
    }

    @observe('collections.splices')
    collectionsSplices(changeRecord: ChangeRecord<HaCollection>) {
        //if (this.defaultSelected)
        //    this.set('collections.' + this.collections.indexOf(collection) + '.selected', true);

        if (changeRecord && this.defaultSelected)
            if (changeRecord.indexSplices.length > 0) {
                var splice = changeRecord.indexSplices[0];
                for (var i = splice.index; i < splice.index + splice.addedCount; i++)
                    for (var topLevel of this.topLevels)
                        if (topLevel.filter(this.collections[i])) {
                            this.set('collections.' + i + '.selected', true);
                            break;
                        }

            }

        if (this.collections.length > 0)
            this.updateTopLevelSelections();
    }

    public updateTopLevelSelections() {
        var topLevels: Array<ICollectionTopLevel> = [];
        for (var topLevel of this.topLevels) {
            if (topLevel.filter) {
                topLevels.push(topLevel);
                (<any>topLevel).countSelected = 0;
                (<any>topLevel).countTotal = 0;
            }
        }

        for (var collection of this.collections) {
            for (var topLevel of topLevels)
                if (topLevel.filter(collection)) {
                    (<any>topLevel).countTotal++;
                    if (collection.selected)
                        (<any>topLevel).countSelected++;
                }
        }

        for (var topLevel of topLevels)
            this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.selected', (<any>topLevel).countTotal == 0 ? false : (<any>topLevel).countSelected == (<any>topLevel).countTotal);
    }

    public filter(topLevelFilter: (collection: HaCollection) => boolean, ignoreCreators: boolean): (collection: HaCollection) => boolean {
        return (collection: HaCollection) => {
            if (this.profCreators != null && this.userCreators != null && !ignoreCreators)
                if ((!this.profCreators && !collection.ugc) || (!this.userCreators && collection.ugc))
                    return false;

            //var test = topLevelFilter(collection);
            //if (test && this.topLevels.length != 8)
            //    var test42 = 42;
            //return test;
            return topLevelFilter(collection)
        };
    }

    sort(collection1: HaCollection, collection2: HaCollection): number {
        return collection1.title.localeCompare(collection2.title);
    }
}

interface ICollectionTopLevel {
    name: string;
    shown: boolean;
    selected: boolean;
    filter: (collection) => boolean;
    ignoreCreators: boolean;
}

CollectionList.register();