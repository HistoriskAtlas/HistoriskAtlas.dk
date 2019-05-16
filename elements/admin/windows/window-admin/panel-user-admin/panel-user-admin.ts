@component("panel-user-admin")
class PanelUserAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public users: Array<any>;

    @property({ type: Object })
    public user: any;

    @property({ type: Number, notify: true })
    public userId: any;

    @property({ type: String, value: '' })
    public filter: string

    @property({ type: Boolean })
    public selected: boolean;

    @property({ type: Boolean, value: false })
    public showDetails: boolean;

    @property({ type: Array, value: ['læser', 'skribent', 'redaktør', 'lokal admin.', 'administrator'] })
    public roleNames: Array<string>;
    
    @property({ type: Number, value: 5 })
    public roleIDFilter: number;

    @property({ type: Number, value: 1 })
    public kind: number;

    @property({ type: Boolean, value: false })
    public deleted: boolean;

    @property({ type: Boolean, value: false })
    public inactive: boolean;

    @property({ type: Number, notify: true })
    public selectedTab: number;

    private isGettingUser: boolean = false;

    @observe('selected')
    selectedChanged() {
        if (this.selected && !this.users) {
            this.users = [];
            this.sortOnName();
            this.fetchUsers();
        }
    }

    @observe('kind')
    @observe('deleted')
    @observe('inactive')
    @observe('roleIDFilter')
    kindChanged(newValue: any, oldValue: any) {
        if (oldValue == undefined)
            return;
        this.showDetails = false;
        this.users = [];
        this.fetchUsers();
    }


    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchUsers();
    }

    public fetchUsers() {
        this.showDetails = false;
        Services.get('user', {
            //Use when "and"-bug on api is fixed:  'schema': '{user:{filters:[{login:{like:' + this.filter + '}},{firstname:{like:' + firstFilter + '},lastname:{like:' + lastFilter + '}}],fields:[id,login,firstname,lastname,roleid,{user_institutions:[empty,{institution:[{tag:[plurname]}]}]}]}}',
            'schema': JSON.stringify(
                {
                    user: {
                        filters: HaUsers.getApiFilter(this.filter),
                        fields: ['id', 'login', 'firstname', 'lastname', 'roleid', 'isactive', 'deleted', { user_institutions: [{ institution: [(this.kind == 1 ? 'exists' : ''), { tag: ['plurname'] }] }] }]
                    }
                }
            ),
            'count': 'all',
            'isactive': this.inactive ? 'any' : 'true',
            'deleted': this.deleted ? 'any' : 'no',
        }, (result) => {
            this.updateUsers(result.data);
        }, null, "Henter brugere")
    }

    public updateUsers(newList: Array<any>) {
        if (this.roleIDFilter < 5) {
            var tempList = [];
            for (var user of newList)
                if (user.roleid == this.roleIDFilter)
                    tempList.push(user);
            newList = tempList;
        }

        this.$.admin.sort(null, newList);
    }

    showGeos() {
        this.userId = this.user.id;
        this.selectedTab = WindowAdminTabs.geos;
    }

    itemTap(e: any) {
        //this.$.selector.select(e.model.item);
        //this.getInstitution();
        this.$.admin.select(e.model.item);
    }
    @observe('user')
    private getUser() {
        if (!this.user)
            return;
        this.showDetails = true;
        this.isGettingUser = true;
        Services.get('user', {
            'schema': '{user:[id,login,firstname,lastname,email,deleted,isactive,roleid,internalnote,{userhierarkis:[{child:[id,login,firstname,lastname]}]},{userhierarkis1:[{parent:[id,login,firstname,lastname]}]},{user_institutions:[empty,{institution:[id,{tag:[plurname]}]}]}]}',
            'userid': this.user.id
        }, (result) => {
            for (var attr in result.data[0])
                this.set('user.' + attr, result.data[0][attr])
            this.isGettingUser = false;
        })
    }

    //@observe('user.email')
    //private emailChanged(newVal: string) {
    //    if (this.isGettingUser || !newVal)
    //        return;
    //    Services.update('user', { 'userid': this.user.id, 'email': newVal }, (result) => { this.getUser(); })
    //}



    @observe('user.*')
    institutionPropertyChanged(e) {
        if (this.isGettingUser)
            return;
        var property = e.path.split('.')[1];
        switch (property) {
            case 'email': case 'roleid': case 'internalnote':
                this.updateUserProperty(property);
        }
    }

    private updateUserProperty(property: string) {
        Services.update('user', JSON.parse('{ "id": ' + this.user.id + ', "' + property + '": "' + this.user[property] + '" }'));
    }

    institutions(institutions: Array<any>): string {
        var result: Array<string> = [];
        for (var data of institutions)
            result.push(data.institution.tag.plurname)
        return result.join(', ');
    }

    itemClass(deleted: string): string {
        return deleted ? ' deleted' : '';
    }

    activeClass(isactive: boolean): string {
        if (isactive == null)
            return '';
        return isactive ? ' active' : ' inactive';
    }

    roleName(id: number): string {
        return this.roleNames[id];
    }

    activeTap() {
        $(this).append(DialogConfirm.create('toggle-active', 'Er du sikker på at du vil ' + (this.user.isactive ? 'IN' : '') + 'AKTIVERE denne bruger?'));
    }
    @listen('toggle-active-confirmed')
    toggleActiveConfirmed(e: any) {
        Services.update('user', { 'userid': this.user.id, 'isactive': !this.user.isactive }, (result) => { this.getUser(); })
    }

    getAutosuggestSchema(user_institutions: any): string {
        if (!user_institutions)
            return;
        var existingIds: Array<number> = [];
        for (var item of user_institutions)
            existingIds.push(item.institution.id)
        return '{institution:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},tag:{plurname:{like:$input}}},fields:[id,{tag:[plurname]}]}}';
    }
    @listen('institutionAutosuggestAdded')
    institutionAdded(e: any) {
        Services.insert('user_institution', { 'institutionid': e.detail.id, 'userid': this.user.id }, (result) => { this.getUser(); })
    }
    @listen('institutionAutosuggestRemoved')
    institutionRemoved(e: any) {
        Services.delete('user_institution', { 'institutionid': e.detail.institution.id, 'userid': this.user.id, 'deletemode': 'permanent' }, (result) => { this.getUser(); })
    }

    getUserAutosuggestSchema(userhierarkis: any): string {
        if (!userhierarkis)
            return;
        var existingIds: Array<number> = [];
        for (var item of userhierarkis)
            existingIds.push(item.child ? item.child.id : item.parent.id);
        return '{user:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},firstname:{like:$input}},fields:[id,login,firstname,lastname]}}'; //TODO Search more than login!
    }
    @listen('writerAutosuggestAdded')
    writerAdded(e: any) {
        Services.insert('userhierarki', { 'upperuserid': this.user.id, 'userid': e.detail.id }, (result) => { this.getUser(); })
    }
    @listen('writerAutosuggestRemoved')
    writerRemoved(e: any) {
        Services.delete('userhierarki', { 'upperuserid': this.user.id, 'userid': e.detail.child.id, 'deletemode': 'permanent' }, (result) => { this.getUser(); })
    }
    @listen('editorAutosuggestAdded')
    editorAdded(e: any) {
        Services.insert('userhierarki', { 'upperuserid': e.detail.id, 'userid': this.user.id }, (result) => { this.getUser(); })
    }
    @listen('editorAutosuggestRemoved')
    editorRemoved(e: any) {
        Services.delete('userhierarki', { 'upperuserid': e.detail.parent.id, 'userid': this.user.id, 'deletemode': 'permanent' }, (result) => { this.getUser(); })
    }

    sortOnLogin() {
        this.$.admin.sort(this.compareLogin);
    }
    compareLogin(a: any, b: any): number {
        return a.login.localeCompare(b.login);
    }

    sortOnName() {
        this.$.admin.sort(this.compareName);
    }
    compareName(a: any, b: any): number {
        return (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname);
    }

    sortOnRole() {
        this.$.admin.sort(this.compareRole);
    }
    compareRole(a: any, b: any): number {
        return a.roleid - b.roleid;
    }

    sortOnInstitution() {
        this.$.admin.sort(this.compareInstitution);
    }
    compareInstitution(a: any, b: any): number {
        if (a.user_institutions.length == 0)
            return b.user_institutions.length == 0 ? 0 : 1;
        if (b.user_institutions.length == 0)
            return a.user_institutions.length == 0 ? 0 : -1;

        return a.user_institutions[0].institution.tag.plurname.localeCompare(b.user_institutions[0].institution.tag.plurname);
    }

}

PanelUserAdmin.register();