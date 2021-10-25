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

    @property({ type: Array })
    public users: Array<any>;

    @property({ type: Number, value: 0 })
    public userId: number;

    @property({ type: String, value: '' })
    public filter: string;

    @property({ type: String, value: 'id' })
    public sort: string;

    @property({ type: String, value: 'asc' })
    public sortDir: string;

    @property({ type: Boolean })
    public selected: boolean;

    private isChangingParam: boolean = false;
    private geosPerPage: number = 100;
    private tagSelectedForDeletion: any;
    private geosSelectedForDeletionByTagId: Array<Array<any>>;
    private tagSelectedForAddition: any;
    private geosSelected: Array<any>;

    @observe('selected')
    selectedChanged() {
        if (!this.selected)
            return;

        if (!this.geos) {
            //this.sortOnTitle();
            this.fetchGeos(true);
        }
        if (!this.institutionTags) { //TODO: reload always?
            this.institutionTags = [];
            this.fetchInstitutionTags();
        }
        if (!this.users) { //TODO: reload always?
            this.users = [];
            this.fetchUsers();
        }
    }

    @observe('institutionTagId')
    institutionIdChanged(newValue: any, oldValue: any) {
        if (oldValue == undefined)
            return;
        if (this.isChangingParam)
            return;
        this.isChangingParam = true;
        this.filter = '';
        this.userId = 0;
        this.fetchGeos(true);
        this.isChangingParam = false;
    }

    @observe('userId')
    userIdChanged(newValue: any, oldValue: any) {
        if (oldValue == undefined)
            return;
        if (this.isChangingParam)
            return;
        this.isChangingParam = true;
        this.filter = '';
        this.institutionTagId = 0;
        this.fetchGeos(true);
        this.isChangingParam = false;
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchGeos(true);
    }

    public fetchGeos(reset: boolean) {
        if (reset) {
            //this.curPage = 0;
            this.set('geos', []);
        }

        var params: any = {
            schema: 'admin',
            count: this.institutionTagId > 0 || this.userId > 0 ? 'all' : this.geosPerPage,
            skip: this.geos.length,
            sort: this.sort,
            sortdir: this.sortDir
        };
        //var filters: Array<string> = [];
        if (this.filter)
            params.filter = this.filter;
            //filters.push('title:{like:' + this.filter + '}');
        if (this.institutionTagId > 0)
            params.institutiontagid = this.institutionTagId;
            //filters.push('tag_geos:[{tag:{id:' + this.institutionTagId + '}}]');
        if (this.userId > 0)
            params.userid = this.userId;
            //filters.push('userid:' + this.userId);
        //Services.get('geo', {
        //    'schema': '{geo:{' + (filters.length > 0 ? 'filters:{' + filters.join(',') + '},' : '') + 'fields:[id,title,created,views,deleted,{tag_geos:[{tag:[id,plurname,category]}]},{user:[login,firstname,lastname]}]}}',  //{title:{like:' + this.filter + '}}
        //    'count': this.institutionTagId > 0 || this.userId > 0 ? 'all' : this.geosPerPage,
        //    'skip': this.geos.length,
        //    'sort': '{' + this.sort + ':' + this.sortDir + '}'
        Services.HAAPI_GET('geos', params, (result) => {
            this.updateGeos(result.data);
            //if (!reset)
            //    this.$.ironList.scrollTop = this.$.ironList.scrollHeight;
        }, null, "Henter fortællinger")

        //this.curPage++;
    }
    public updateGeos(newList: Array<any>) {
        this.set('geos', this.geos.concat(newList));
    }

    public fetchInstitutionTags() {
        //Services.get('tag', {
        //    'schema': '{tag:{fields:[id,plurname],filters:{category:3}}}',
        //    'count': 'all'
        Services.HAAPI_GET('tags', { schema: 'plurnames', categoryid: 3 }, (result) => {
            result.data.sort((a, b) => a.plurname.localeCompare(b.plurname));
            this.set('institutionTags', result.data);
        })
    }

    public fetchUsers() {
        //Services.get('user', {
        //    'schema': '{user:{fields:[id,login,firstname,lastname]}}',
        //    'count': 'all',
        //    'deleted': 'any'
        Services.HAAPI_GET('users', {}, (result) => {
            result.data.sort((a, b) => (a.firstname + ' ' + a.lastname + ' ' + a.login).localeCompare(b.firstname + ' ' + b.lastname + ' ' + b.login));
            this.set('users', result.data);
        })
    }

    itemTap(e: any) {
        this.$.admin.select(e.model.item);
    }
    @observe('geo')
    private getGeo() {
        if (!this.geo)
            return;
        //Services.get('geo', {
        //    'schema': '{geo:[title,intro,online]}',
        //    'id': this.geo.id
        Services.HAAPI_GET(`geo/${this.geo.geoid}`, { schema: 'title-intro-online' }, (result) => {
            for (var attr in result.data)
                this.set('geo.' + attr, result.data[attr])
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

    formatInstitutions(tags: Array<any>): string {
        var institutions: Array<string> = [];
        for (var tag of tags)
            if (tag.category == 3)
                institutions.push(tag.plurname);
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
        this.fetchGeos(true);        
    }

    numberWithSeparaters(n: number): string {
        return Common.numberWithSeparaters(n);
    }

    more() {
        this.fetchGeos(false)
    }

    removeInstitution() {
        var tags = []
        var tagIds = []
        //var geoCountByTagId = []
        this.geosSelectedForDeletionByTagId = [];

        for (var geo of this.geos)
            for (var tag_geo of geo.tag_geos)
                if (tag_geo.tag.category == 3) {
                    if (tagIds.indexOf(tag_geo.tag.id) == -1) {
                        tagIds.push(tag_geo.tag.id);
                        tags.push({ id: tag_geo.tag.id, plurName: tag_geo.tag.plurname });
                    }
                    if (!this.geosSelectedForDeletionByTagId[tag_geo.tag.id])
                        this.geosSelectedForDeletionByTagId[tag_geo.tag.id] = [geo];
                    else
                        this.geosSelectedForDeletionByTagId[tag_geo.tag.id].push(geo);
                }

        Common.dom.append(DialogTagSelection.create('Vælg institution der skal fjernes', tags, (tag) => {
            this.tagSelectedForDeletion = tag;
            $(this).append(DialogConfirm.create("remove-institution", "Advarsel! Du er ved at fjerne '" + tag.plurName + "' fra " + this.geosSelectedForDeletionByTagId[tag.id].length + " fortællinger. Vil du fortsætte? (Det kan tage lang tid.)"));
        }));

    }
    @listen('remove-institution-confirmed')
    removeInstitutionConfirmed() {
        App.loading.show("Fjerner institution");
        this.removeOneInstitution();
    }
    removeOneInstitution() {
        var geos = this.geosSelectedForDeletionByTagId[this.tagSelectedForDeletion.id];
        var geo = geos.pop();

        Services.HAAPI_DELETE('tag_geo', null, true, { tagid: this.tagSelectedForDeletion.id, geoid: geo.id }, (result) => {
            if (geos.length > 0)
                this.removeOneInstitution();
            else {
                App.loading.hide("Fjerner institution");
                App.toast.show("Institution fjernet fra fortællinger!");
                setTimeout(() => this.fetchGeos(true), 500);
            }
        })

    }

    addInstitution() {
        var tags: Array<HaTag> = [];
        for (var tag of App.haTags.tags)
            if (tag.isInstitution)
                tags.push(tag);
        tags.sort((a, b) => a.plurName.localeCompare(b.plurName));

        this.geosSelected = [...this.geos];

        Common.dom.append(DialogTagSelection.create('Vælg institution der skal tilføjes', tags, (tag) => {
            this.tagSelectedForAddition = tag;
            $(this).append(DialogConfirm.create("add-institution", "Advarsel! Du er ved at tilføje '" + tag.plurName + "' til " + this.geos.length + " fortællinger. Vil du fortsætte? (Det kan tage lang tid.)"));
        }));
    }
    @listen('add-institution-confirmed')
    addInstitutionConfirmed() {
        App.loading.show("Tilføjer institution");
        this.addOneInstitution();
    }
    addOneInstitution() {
        var geo = this.geosSelected.pop();
        Services.HAAPI_POST('tag_geo', {}, Common.formData({ tagid: this.tagSelectedForAddition.id, geoid: geo.id }), (result) => {
            if (this.geosSelected.length > 0)
                this.addOneInstitution();
            else {
                App.loading.hide("Tilføjer institution");
                App.toast.show("Institution tilføjet til fortællinger!");
                setTimeout(() => this.fetchGeos(true), 500);
            }
        })
    }

    deleteGeos() {
        $(this).append(DialogConfirm.create("delete-geos", "Advarsel! Du er ved at slette " + this.geos.length + " fortællinger. Vil du fortsætte? (Det kan tage lang tid.)"));
    }
    @listen('delete-geos-confirmed')
    deleteGeosConfirmed() {
        App.loading.show("Sletter fortællinger");
        this.geosSelected = [...this.geos];
        this.deleteOneGeo();
    }
    deleteOneGeo() {
        var geo = this.geosSelected.pop();
        Services.HAAPI_DELETE('geo', geo.id, false, {}, (result) => {
            if (this.geosSelected.length > 0)
                this.deleteOneGeo();
            else {
                App.loading.hide("Sletter fortællinger");
                App.toast.show("Fortællinger slettet!");
                setTimeout(() => this.fetchGeos(true), 500);
            }
        });

    }
}

PanelGeoAdmin.register();