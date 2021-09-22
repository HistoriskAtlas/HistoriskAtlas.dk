@component("panel-tag-admin")
class PanelTagAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public tags: Array<any>;

    @property({ type: Object })
    public tag: any;

    @property({ type: String, value: '' })
    public filter: string;

    @property({ type: Array })
    public categories: Array<any>;

    @property({ type: Number })
    public categoryIndex: number;

    @property({ type: Boolean })
    public selected: boolean;

    @observe('selected') 
    selectedChanged() {
        if (this.selected && !this.tags) {
            this.tags = [];
            this.sortOnName()
            this.categories = [];
            for (var i = 0; i < HaTag.categoryNames.length; i++)
                if (i != 3 && i != 6)
                    this.push('categories', { id: i, name: HaTag.categoryNames[i] });

            this.set('categoryIndex', 7);
            //this.tags = [];
            //this.fetchTags();
        }
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchTags();
    }

    @observe('categoryIndex')
    categoryIndexChanged() {
        this.tags = [];
        this.fetchTags();
    }

    public fetchTags() {
        Services.get('tags', {
            'schema': '{tag:{fields:[id,plurname,category],filters:{' + (this.filter ? 'plurname:{like:' + this.filter + '},' : '') + 'category:' + this.categories[this.categoryIndex].id + '}}}', //TODO: multiple "not"? 6 = søgning
            'count': 'all'
        }, (result) => {
            this.updateTags(result.data);
        }, null, "Henter tags")
    }

    public updateTags(newList: Array<any> = null) {
        //this.set('tags', (newList ? newList : this.tags).sort(this.compare));
        this.$.admin.sort(null, newList);
    }


    itemTap(e: any) {
        this.$.admin.select(e.model.item);
    }
    @observe('tag')
    private getTag() {
        if (!this.tag)
            return;
        Services.get('tag', {
            'schema': '{tag:[singname,{children:[{child:[id,plurname]}]},{parents:[{parent:[id,plurname]}]}]}',
            'id': this.tag.id
        }, (result) => {
            for (var attr in result.data[0])
                this.set('tag.' + attr, result.data[0][attr])
        })
    }

    categoryName(category: number): string {
        return HaTag.categoryNames[category];
    }

    //getAutosuggestSchema(children: any): string {
    getAutosuggestExistingIds(children: any): number[] {
        if (!children)
            return [];
        var existingIds: Array<number> = [];
        for (var item of children)
            existingIds.push(item.child.id)
        //return '{tag:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},category:' + this.tag.category + ',plurname:{like:$input}},fields:[id,plurname]}}';
        return existingIds;
    }

    sortOnName() {
        this.$.admin.sort(this.compareName);
    }
    compareName(a: any, b: any): number {
        return a.plurname.localeCompare(b.plurname);
    }

    //sortOnCategory() {
    //    this.$.admin.sort(this.compareCategory);
    //}
    //compareCategory(a: any, b: any): number {
    //    return a.category - b.category;
    //}
}

PanelTagAdmin.register();