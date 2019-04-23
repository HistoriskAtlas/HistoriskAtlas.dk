@component("panel-geo-admin")
class PanelGeoAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public geos: Array<any>;

    @property({ type: Object })
    public geo: any;

    @property({ type: Array })
    public institutionTags: Array<any>;

    @property({ type: Number, value: 0 })
    public institutionTagId: number;

    @property({ type: String, value: '' })
    public filter: string;

    @property({ type: String, value: 'id' })
    public sort: string;

    @property({ type: String, value: 'asc' })
    public sortDir: string;

    @property({ type: Boolean })
    public selected: boolean;

    @observe('selected')
    selectedChanged() {
        if (!this.selected)
            return;

        if (!this.geos) {
            this.geos = [];
            //this.sortOnTitle();
            this.fetchGeos();
        }
        if (!this.institutionTags) {
            this.institutionTags = [];
            this.fetchInstitutionTags();
        }
    }

    @observe('institutionTagId')
    institutionIdChanged(newValue: any, oldValue: any) {
        if (oldValue == undefined)
            return;
        this.updateGeos([]);
        this.fetchGeos();
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchGeos();
    }

    public fetchGeos() {
        var filters: Array<string> = [];
        if (this.filter)
            filters.push('title:{like:' + this.filter + '}');
        if (this.institutionTagId > 0)
            filters.push('tag_geos:[{tag:{id:' + this.institutionTagId + '}}]');
        Services.get('geo', {
            'schema': '{geo:{' + (filters.length > 0 ? 'filters:{' + filters.join(',') + '},' : '') + 'fields:[id,title,created,views,{tag_geos:[{tag:[plurname,{category:3}]}]},{user:[login,firstname,lastname]}]}}',  //{title:{like:' + this.filter + '}}
            'count': '100',
            'sort': '{' + this.sort + ':' + this.sortDir + '}'
        }, (result) => {
            this.updateGeos(result.data);
        })
    }
    public updateGeos(newList: Array<any>) {
        ////this.set('geos', (newList ? newList : this.geos).sort(this.compare));
        this.set('geos', newList);
        //this.$.admin.sort(null, newList);
    }

    public fetchInstitutionTags() {
        Services.get('tag', {
            'schema': '{tag:{fields:[id,plurname],filters:{category:3}}}',
            'count': 'all'
        }, (result) => {
            result.data.sort((a, b) => a.plurname.localeCompare(b.plurname));
            this.set('institutionTags', result.data);
        })
    }

    itemTap(e: any) {
        this.$.admin.select(e.model.item);
    }
    @observe('geo')
    private getGeo() {
        if (!this.geo)
            return;
        Services.get('geo', {
            'schema': '{geo:[title,intro,online]}',
            'id': this.geo.id
        }, (result) => {
            for (var attr in result.data[0])
                this.set('geo.' + attr, result.data[0][attr])
        })
    }

    //getAutosuggestSchema(children: any): string {
    //    if (!children)
    //        return;
    //    var existingIds: Array<number> = [];
    //    for (var item of children)
    //        existingIds.push(item.child.id)
    //    return '{tag:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},category:' + this.tag.category + ',plurname:{like:$input}},fields:[id,plurname]}}';
    //}

    onlineClass(online: boolean): string {
        if (online == null)
            return '';
        return online ? 'online' : 'offline';
    }

    formatDate(date: string): string {
        return Common.formatDate(date);
    }

    formatInstitutions(tag_geos: Array<any>): string {
        var institutions: Array<string> = [];
        for (var tag_geo of tag_geos)
            if (tag_geo.tag.category == 3)
                institutions.push(tag_geo.tag.plurname);
        return institutions.join(', ');
    }

    isInstitutionCaetgory(category: number): boolean {
        return category == 3;
    }

    titleTap() {
        Common.geoClick(this.geo.id);
    }
    
    sortOnId() {
        //this.$.admin.sort(this.compareId);
        this.changeSort('id');
    }
    //compareId(a: any, b: any): number {
    //    return a.id - b.id;
    //}

    sortOnTitle() {
        //this.$.admin.sort(this.compareTitle);
        this.changeSort('title');
    }
    //compareTitle(a: any, b: any): number {
    //    return a.title.localeCompare(b.title);
    //}

    sortOnUser() {
        //this.$.admin.sort(this.compareUser);
    }
    //compareUser(a: any, b: any): number {
    //    return (a.user.firstname + a.user.lastname).localeCompare(b.user.firstname + b.user.lastname);
    //}

    sortOnDate() {
        //this.$.admin.sort(this.compareDate);
        this.changeSort('created');
    }
    //compareDate(a: any, b: any): number {
    //    return new Date(a.created).getTime() - new Date(b.created).getTime();
    //}

    sortOnInstitution() {
        //this.$.admin.sort(this.compareInstitution);
    }
    //compareInstitution(a: any, b: any): number {
    //    var objA = a.tag_geos.find((obj) => obj.tag.category == 3);
    //    var objB = b.tag_geos.find((obj) => obj.tag.category == 3);
    //    var aName = objA ? objA.tag.plurname : '';
    //    var bName = objB ? objB.tag.plurname : '';
    //    return aName.localeCompare(bName);
    //}

    sortOnViews() {
        //this.$.admin.sort(this.compareViews);
        this.changeSort('views');
    }
    //compareViews(a: any, b: any): number {
    //    return a.views - b.views;
    //}

    private changeSort(col: string) {
        if (this.sort == col)
            this.sortDir = this.sortDir == 'asc' ? 'desc' : 'asc';
        else
            this.sort = col;
        this.fetchGeos();        
    }

    numberWithSeparaters(n: number): string {
        return Common.numberWithSeparaters(n);
    }
}

PanelGeoAdmin.register();