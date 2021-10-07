@component("panel-user-editorial")
class PanelUserEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public users: Array<any>;

    @property({ type: String, value: '' })
    public filter: string

    @property({ type: Boolean })
    public selected: boolean;

    @observe('selected')
    selectedChanged() {
        if (this.selected && !this.users) {
            this.users = [];
            this.sortOnName();
            this.fetchUsers();
        }
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchUsers();
    }

    public fetchUsers() {
        //Services.get('user', {
        //    'schema': JSON.stringify(
        //        {
        //            user: {
        //                fields: [
        //                    'login',
        //                    'firstname',
        //                    'lastname',
        //                    {
        //                        user_institutions: [
        //                            {
        //                                institution: [
        //                                    {
        //                                        tag: ['plurname']
        //                                    }
        //                                ]
        //                            }
        //                        ]
        //                    }
        //                ],
        //                filters: HaUsers.getApiFilter(this.filter)
        //            }
        //        }
        //    ),
        //    'userhierarkis1': JSON.stringify(
        //        {
        //            parentid: App.haUsers.user.id
        //        }
        //    ),
        //    'count': 'all'
        Services.HAAPI_GET('users', { schema: 'writers' }, (result) => {
            this.updateUsers(result.data);
        })
    }

    public updateUsers(newList: Array<any> = null) {
        //this.set('users', (newList ? newList : this.users).sort(this.compare));
        this.$.selector.sort(null, newList);
    }

    //itemTap(e: any) {
    //    Common.geoClick(e.model.item.id);
    //}

    institutions(institutions: Array<any>): string {
        var result: Array<string> = [];
        for (var institution of institutions)
            result.push(institution)
        return result.join(', ');
    }

    sortOnLogin() {
        this.$.selector.sort(this.compareLogin);
    }
    compareLogin(a: any, b: any): number {
        return a.login.localeCompare(b.login);
    }

    sortOnName() {
        this.$.selector.sort(this.compareName);
    }
    compareName(a: any, b: any): number {
        return (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname);
    }

    sortOnInstitution() {
        this.$.selector.sort(this.compareInstitution);
    }
    compareInstitution(a: any, b: any): number {
        if (a.user_institutions.length == 0)
            return b.user_institutions.length == 0 ? 0 : 1;
        if (b.user_institutions.length == 0)
            return a.user_institutions.length == 0 ? 0 : -1;

        return a.user_institutions[0].institution.tag.plurname.localeCompare(b.user_institutions[0].institution.tag.plurname);
    }

}

PanelUserEditorial.register();