@component("panel-institution-admin")
class PanelInstitutionAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public institutions: Array<any>;

    @property({ type: Object })
    public institution: any;

    @property({ type: String, value: '' })
    public filter: string;

    @property({ type: Boolean })
    public selected: boolean;

    @property({ type: Number, notify: true })
    public institutionTagId: number;

    @property({ type: Number, notify: true })
    public selectedTab: number;

    private isGettingInstitution: boolean = false;

    @property({ type: Array })
    public instTypes: Array<string>;

    @observe('selected') 
    selectedChanged() {
        if (this.selected && !this.institutions) {
            this.institutions = [];
            this.sortOnName();
            this.fetchInstitutions();
            this.instTypes = HAInstitution.types;
        }
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchInstitutions();
    }

    public fetchInstitutions(callback: () => void = null) {
        Services.get('institution', {
            'schema': '{institution:{' + (this.filter ? 'filters:[{tag:[{plurname:{like:' + this.filter + '}}]}],' : '') + 'fields:[id,type,deleted,geoviews,{user_institutions:[{user:[firstname,lastname]}]},{tag:[plurname]}]}}',
            'count': 'all',
            'deleted': 'any'
        }, (result) => {
            this.updateInstitutions(result.data);
            if (callback)
                callback();
        }, null, "Henter institutioner")
    }

    public updateInstitutions(newList: Array<any>) {
        //this.set('institutions', (newList ? newList : this.institutions).sort(this.compare));
        this.$.admin.sort(null, newList);
    }

    itemTap(e: any) {
        //this.$.selector.select(e.model.item);
        //this.getInstitution();
        this.$.admin.select(e.model.item);
    }
    @observe('institution')
    private getInstitution() {
        if (!this.institution)
            return;
        this.isGettingInstitution = true;
        Services.get('institution', {
            'schema': '{institution:[id,url,email,{user_institutions:[{user:[id,login,firstname,lastname,deleted]}]},{tag:[id,plurname]}]}',
            'id': this.institution.id,
            'deleted': 'any'
        }, (result) => {
            for (var attr in result.data[0])
                this.set('institution.' + attr, result.data[0][attr])
            this.isGettingInstitution = false;
        })
    }

    public instType(type: number): string {
        return HAInstitution.types[type];
    }

    public statusClass(deleted: string): string {
        return deleted ? 'deleted' : '';
    }

    public userNames(user_institutions: Array<any>): string {
        var result: Array<string> = [];
        for (var data of user_institutions)
            result.push(data.user.firstname + ' ' + data.user.lastname)
        return result.join(', ');
    }

    @observe('institution.*')
    institutionPropertyChanged(e) {
        if (this.isGettingInstitution)
            return;
        if (e.path == 'institution.tag.plurname')
            Services.update('tag', JSON.parse('{ "id": ' + this.institution.tag.id + ', "plurname": "' + this.institution.tag.plurname + '", "singname": "' + this.institution.tag.plurname + '" }'));
        var property = e.path.split('.')[1];
        switch (property) {
            case 'url': case 'email': case 'type':
                this.updateInstProperty(property);
        }
    }

    private updateInstProperty(property: string) {
        Services.update('institution', JSON.parse('{ "id": ' + this.institution.id + ', "' + property + '": "' + this.institution[property] + '" }'));
    }

    getAutosuggestSchema(user_institutions: any): string {
        if (!user_institutions)
            return;
        var existingIds: Array<number> = [];
        for (var item of user_institutions)
            existingIds.push(item.user.id)
        return '{user:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},firstname:{like:$input}},fields:[id,login,firstname,lastname]}}';
    }

    @listen('userAutosuggestAdded')
    userAdded(e: any) {
        Services.insert('user_institution', { 'institutionid': this.institution.id, 'userid': e.detail.id }, (result) => { this.getInstitution(); })
    }

    @listen('userAutosuggestRemoved')
    userRemoved(e: any) {
        Services.delete('user_institution', { 'institutionid': this.institution.id, 'userid': e.detail.user.id, 'deletemode': 'permanent' }, (result) => { this.getInstitution(); })
    }

    showGeos() {
        this.institutionTagId = this.institution.tag.id;
        this.selectedTab = WindowAdminTabs.geos;
    }

    sortOnName() {
        this.$.admin.sort(this.compareName);
    }
    compareName(a: any, b: any): number {
        return a.tag.plurname.localeCompare(b.tag.plurname);
    }

    sortOnType() {
        this.$.admin.sort(this.compareType);
    }
    compareType(a: any, b: any): number {
        return a.type - b.type;
    }

    sortOnUsers() {
        this.$.admin.sort(this.compareUsers);
    }
    compareUsers(a: any, b: any): number {
        var aName = a.user_institutions.length == 0 ? '' : a.user_institutions[0].user.firstname + a.user_institutions[0].user.lastname
        var bName = b.user_institutions.length == 0 ? '' : b.user_institutions[0].user.firstname + b.user_institutions[0].user.lastname
        return aName.localeCompare(bName);
    }

    sortOnViews() {
        this.$.admin.sort(this.compareViews);
    }
    compareViews(a: any, b: any): number {
        return a.geoviews - b.geoviews;
    }

    numberWithSeparaters(n: number): string {
        return Common.numberWithSeparaters(n);
    }

    public createNew() {
        Common.dom.append(DialogText.create('Angiv navnet på den nye institution', (name) => this.newInstitution(name)));
    }
    private newInstitution(name: string) {
        var tag: any = {
            plurname: name,
            singname: name,
            category: 3
        };

        Services.insert('tag', tag, (result) => {
            var tagid = result.data[0].id;

            var institution: any = {
                tagid: tagid,
                url: '',
                email: ''
            };

            Services.insert('institution', institution, (result) => {
                var institutionid = result.data[0].id;
                App.toast.show("Institution oprettet!");
                this.fetchInstitutions(() => {
                    for (var inst of this.institutions)
                        if (inst.id == institutionid) {
                            this.$.admin.select(inst);
                            break;
                        }                    
                })
            })
        })
    }

    public delete() {
        Services.get('geo', { 
            'schema': '{geo:{filters:{tag_geo:{tagid:' + this.institution.tag.id + '}},fields:[{collapse:geoid}]}}',
            'count': 'all'
        }, (result) => {
            if (result.data.length == 0)
                $(this).append(DialogConfirm.create("delete-institution", "Er du sikker på, at du vil slette '" + this.institution.tag.plurname + "'?"));
            else
                $(this).append(DialogConfirm.create("modify-geos", "Denne institution har " + result.data.length + " fortælling" + (result.data.length == 1 ? "" : "er") + " tilknyttet. Vil du få dem vist og evt. flytte eller slette dem?"));
        }, null, "Henter oplysninger")        
    }
    @listen('modify-geos-confirmed')
    private modifyGeos() {
        this.showGeos();
    }
    @listen('delete-institution-confirmed')
    private deleteInstitution() {

        //TODO................................. really delete it.........................



        Common.dom.append(DialogAlert.create("Institutionen er slettet!"));
        this.$.admin.select(null);
    }
}

PanelInstitutionAdmin.register();