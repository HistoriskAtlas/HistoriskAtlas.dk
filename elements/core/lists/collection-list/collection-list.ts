﻿@component("collection-list")
class CollectionList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public topLevels: Array<ICollectionTopLevel>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

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
    collectionsSplices() {
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

        for (var collection of this.collections)
            for (var topLevel of topLevels)
                if (topLevel.filter(collection)) {
                    (<any>topLevel).countTotal++;
                    if (collection.selected)
                        (<any>topLevel).countSelected++;
                }

        for (var topLevel of topLevels)
            this.set('topLevels.' + this.topLevels.indexOf(topLevel) + '.selected', (<any>topLevel).countTotal == 0 ? false : (<any>topLevel).countSelected == (<any>topLevel).countTotal);
    }

}

interface ICollectionTopLevel {
    name: string;
    shown: boolean;
    selected: boolean;
    filter: (collection) => boolean;
}

CollectionList.register();