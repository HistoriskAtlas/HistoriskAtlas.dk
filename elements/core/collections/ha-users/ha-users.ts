@component("ha-users")
class HaUsers extends polymer.Base implements polymer.Element {

    @property({ type: Object, value: null, notify: true })
    public user: HAUser & Object;

    @property({ type: Array, notify: true })
    public users: Array<HAUser>;

    public firstLogInTour: DialogTour;
    //private _loggingIn: boolean;

    ready() {
        //this.$.ajax.url = Common.api + 'user.json';
        this.user = HAUser.default;
    }

    //public handleResponse() {
    //}

    //public fetchUsers(callback: () => void) {
    //    if (this.users) {
    //        callback();
    //        return;
    //    }

    //    Services.get('user', {
    //        'schema': '{user:[id,firstname,lastname,role]}',
    //        'count': 'all'
    //    }, (result) => {
    //        var users: Array<HAUser> = [];
    //        for (var data of result.data)
    //            users.push(new HAUser(data));
    //        this.set('users', users);
    //        callback();
    //    })
    //}

    public login(data: any) {
        //this._loggingIn = true;
        //var user = new HAUser(data);
        //Services.get('user', {  //TODO: DO NOT DO THIS.... get the full user from org. login instead....................................................................
        //    'schema': '{user:[location,created,licensename,{userhierarkis:[empty,{child:[id,login,firstname,lastname]}]},{userhierarkis1:[empty,{parent:[id,login,firstname,lastname]}]},{geos:[empty,{collapse:geoid}]},{user_institutions:[{institution:[id,url,email,type,deleted,tagid]}]}]}',
        //    'userid': data.id | data.userid
        //}, (result) => {

        //for (var prop in result.data[0])
        //    data[prop] = result.data[0][prop];

        var user = new HAUser(data);

        user.geos = [];
        for (var geoID of data.geoids) {
            var geo: HaGeo = App.haGeos[geoID];
            if (geo)
                geo.connectUser();
            else
                HaGeos.usersGeoIDs.push(geoID);                
        }

        //Moved to constructer for HAUser...
        //for (var user_institution of result.data[0].user_institutions)
        //    user.institutions.push(new HAInstitution(user_institution.institution));


        this.set('user', user);

        //IconLayer.updateShown();
        App.haGeos.login();

        //if (App.haCollections.allCollectionsFetched)
            App.haCollections.getCollectionsFromUser();

            //this._loggingIn = false;

        //})
    }

    @observe('user')
    userChanged(newUser: HAUser, oldUser: HAUser) {
        if (!newUser)
            return;

        if (App.toast)
            App.toast.show(newUser.isDefault ? 'Logget ud' : 'Logget ind som ' + newUser.firstname + ' ' + newUser.lastname);

        if (newUser.isDefault) {
            if (oldUser) { //logged out
                App.haGeos.logout();
                LocalStorage.delete("sessionID");
            }
            return;
        }

        if (newUser.isWriter)
            Common.importModule('ha_writer', (e) => { this.writerModuleLoaded(); });
        if (newUser.isEditor)
            Common.importModule('ha_editor');
        if (newUser.isAdmin)
            Common.importModule('ha_admin');
    }

    private writerModuleLoaded() {
        if (!LocalStorage.get('firstLogInTourDone'))
            Common.dom.append(this.firstLogInTour = <DialogTour>DialogTour.create('Start her!', 'Dette er MitAtlas menuen. Her kan du bla. oprette nye fortællinger på kortet. Prøv det nu!', null, -25, 50, null, null, 6, -15, null, true, 'firstLogInTourDone'));
        else
            if (LocalStorage.isBefore('user-news-shown', WindowUserNews.lastUpdate)) {
                Common.dom.append(WindowUserNews.create());
                LocalStorage.set('user-news-shown', 'true', true);
            }
    }

    @observe('user.favourites.geos.splices')
    geosChanged(test: any) {
        //alert('test');
        this.fire('userFavouritesGeosChanged');
        ///TODO: fire custom event? listen for it on window-favourites?
    }

    @observe('user.*')
    userPropertyChanged(e) {
        var property = e.path.split('.')[1];
        switch (property) {
            case 'login':
            case 'firstname':
            case 'lastname':
            case 'email':
            case 'password':
                this.updateUserProperty(property);
        }
    }

    private updateUserProperty(property: string) {
        if (!this.user)
            return;
        if (this.user.isDefault) // || this._loggingIn
            return;

        Services.HAAPI_PUT('user', this.user.id, {}, Common.formData(JSON.parse('{ "' + property + '": "' + this.user[property] + '" }')), null, (data) => {

            
            
            //TODO: Handle error when trying to update a login to an existing one.... make "login" unique in mssql first.......................
            //alert('error');

        });
    }

    public static getApiFilter(filter: string): any {
        var filters: Array<string> = filter.split(' ', 2);
        return (filters[0] == '' ? '' : (filters.length == 1 ?
            [
                { login: { like: filter }/*, deleted: null*/ },
                { firstname: { like: filter }/*, deleted: null*/ },
                { lastname: { like: filter }/*, deleted: null*/ }
            ] :
            {
                firstname: { is: filters[0] },
                lastname: { like: filters[1] }
                //,
                //deleted: null
            }
        ))
    }
}

HaUsers.register();