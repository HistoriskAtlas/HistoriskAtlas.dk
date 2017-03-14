var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HaUsers = (function (_super) {
    __extends(HaUsers, _super);
    function HaUsers() {
        _super.apply(this, arguments);
    }
    HaUsers.prototype.ready = function () {
        //this.$.ajax.url = Common.api + 'user.json';
        this.user = HAUser.default;
    };
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
    HaUsers.prototype.login = function (data) {
        var _this = this;
        this._loggingIn = true;
        //var user = new HAUser(data);
        Services.get('user', {
            'schema': '{user:[location,created,licensename,{userhierarkis:[empty,{child:[id,login,firstname,lastname]}]},{userhierarkis1:[empty,{parent:[id,login,firstname,lastname]}]},{geos:[empty,{collapse:geoid}]},{user_institutions:[{institution:[id,url,email,type,deleted,tagid]}]}]}',
            'userid': data.id
        }, function (result) {
            for (var prop in result.data[0])
                data[prop] = result.data[0][prop];
            var user = new HAUser(data);
            user.geos = [];
            for (var _i = 0, _a = data.geos; _i < _a.length; _i++) {
                var geoID = _a[_i];
                var geo = App.haGeos[geoID];
                if (geo)
                    geo.connectUser();
                else
                    HaGeos.usersGeoIDs.push(geoID);
            }
            //Moved to constructer for HAUser...
            //for (var user_institution of result.data[0].user_institutions)
            //    user.institutions.push(new HAInstitution(user_institution.institution));
            _this.set('user', user);
            //IconLayer.updateShown();
            App.haGeos.login();
            if (App.haCollections.allCollectionsFetched)
                App.haCollections.getCollectionsFromUser();
            _this._loggingIn = false;
        });
    };
    HaUsers.prototype.userChanged = function (newUser, oldUser) {
        var _this = this;
        if (!newUser)
            return;
        if (App.toast)
            App.toast.show(newUser.isDefault ? 'Logget ud' : 'Logget ind som ' + newUser.firstname + ' ' + newUser.lastname);
        if (newUser.isDefault) {
            if (oldUser)
                App.haGeos.logout();
            return;
        }
        if (newUser.isWriter)
            Common.importModule('ha_writer', function (e) { _this.writerModuleLoaded(); });
        if (newUser.isEditor)
            Common.importModule('ha_editor');
        if (newUser.isAdmin)
            Common.importModule('ha_admin');
    };
    HaUsers.prototype.writerModuleLoaded = function () {
        if (!LocalStorage.get('firstLogInTourDone'))
            Common.dom.append(this.firstLogInTour = DialogTour.create('Start her!', 'Dette er MitAtlas menuen. Her kan du bla. oprette nye fortællinger på kortet. Prøv det nu!', null, -25, 50, null, null, 6, -15, null, true, 'firstLogInTourDone'));
        else if (LocalStorage.isBefore('user-news-shown', WindowUserNews.lastUpdate)) {
            Common.dom.append(WindowUserNews.create());
            LocalStorage.set('user-news-shown', 'true', true);
        }
    };
    HaUsers.prototype.geosChanged = function (test) {
        //alert('test');
        this.fire('userFavouritesGeosChanged');
        ///TODO: fire custom event? listen for it on window-favourites?
    };
    HaUsers.prototype.userPropertyChanged = function (e) {
        var property = e.path.split('.')[1];
        switch (property) {
            case 'login':
            case 'firstname':
            case 'lastname':
            case 'email':
                this.updateUserProperty(property);
        }
    };
    HaUsers.prototype.updateUserProperty = function (property) {
        if (!this.user)
            return;
        if (this.user.isDefault || this._loggingIn)
            return;
        Services.update('user', JSON.parse('{ "id": ' + this.user.id + ', "' + property + '": "' + this.user[property] + '" }'), null, function (data) {
            //TODO: Handle error when trying to update a login to an existing one.... make "login" unique in mssql first.......................
            //alert('error');
        });
    };
    HaUsers.getApiFilter = function (filter) {
        var filters = filter.split(' ', 2);
        return (filters[0] == '' ? '' : (filters.length == 1 ?
            [
                { login: { like: filter } },
                { firstname: { like: filter } },
                { lastname: { like: filter } },
            ] :
            {
                firstname: { is: filters[0] },
                lastname: { like: filters[1] }
            }));
    };
    __decorate([
        property({ type: Object, value: null, notify: true }), 
        __metadata('design:type', Object)
    ], HaUsers.prototype, "user", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaUsers.prototype, "users", void 0);
    __decorate([
        observe('user'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [HAUser, HAUser]), 
        __metadata('design:returntype', void 0)
    ], HaUsers.prototype, "userChanged", null);
    __decorate([
        observe('user.favourites.geos.splices'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaUsers.prototype, "geosChanged", null);
    __decorate([
        observe('user.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaUsers.prototype, "userPropertyChanged", null);
    HaUsers = __decorate([
        component("ha-users"), 
        __metadata('design:paramtypes', [])
    ], HaUsers);
    return HaUsers;
}(polymer.Base));
HaUsers.register();
//# sourceMappingURL=ha-users.js.map