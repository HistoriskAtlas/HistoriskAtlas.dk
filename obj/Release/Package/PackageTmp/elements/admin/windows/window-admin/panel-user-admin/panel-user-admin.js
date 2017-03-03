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
var PanelUserAdmin = (function (_super) {
    __extends(PanelUserAdmin, _super);
    function PanelUserAdmin() {
        _super.apply(this, arguments);
        this.isGettingUser = false;
    }
    PanelUserAdmin.prototype.selectedChanged = function () {
        if (this.selected && !this.users) {
            this.users = [];
            this.sortOnName();
            this.fetchUsers();
        }
    };
    PanelUserAdmin.prototype.kindChanged = function (newValue, oldValue) {
        if (oldValue == undefined)
            return;
        this.showDetails = false;
        this.users = [];
        this.fetchUsers();
    };
    PanelUserAdmin.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchUsers();
    };
    PanelUserAdmin.prototype.fetchUsers = function () {
        var _this = this;
        this.showDetails = false;
        Services.get('user', {
            //Use when "and"-bug on api is fixed:  'schema': '{user:{filters:[{login:{like:' + this.filter + '}},{firstname:{like:' + firstFilter + '},lastname:{like:' + lastFilter + '}}],fields:[id,login,firstname,lastname,roleid,{user_institutions:[empty,{institution:[{tag:[plurname]}]}]}]}}',
            'schema': JSON.stringify({
                user: {
                    filters: HaUsers.getApiFilter(this.filter),
                    fields: ['id', 'login', 'firstname', 'lastname', 'roleid', { user_institutions: [{ institution: [(this.kind == 1 ? 'exists' : ''), { tag: ['plurname'] }] }] }]
                }
            }),
            'count': 'all'
        }, function (result) {
            _this.updateUsers(result.data);
        });
    };
    PanelUserAdmin.prototype.updateUsers = function (newList) {
        if (this.roleIDFilter < 5) {
            var tempList = [];
            for (var _i = 0, newList_1 = newList; _i < newList_1.length; _i++) {
                var user = newList_1[_i];
                if (user.roleid == this.roleIDFilter)
                    tempList.push(user);
            }
            newList = tempList;
        }
        this.$.admin.sort(null, newList);
    };
    PanelUserAdmin.prototype.itemTap = function (e) {
        //this.$.selector.select(e.model.item);
        //this.getInstitution();
        this.$.admin.select(e.model.item);
    };
    PanelUserAdmin.prototype.getUser = function () {
        var _this = this;
        if (!this.user)
            return;
        this.showDetails = true;
        this.isGettingUser = true;
        Services.get('user', {
            'schema': '{user:[id,login,firstname,lastname,email,isactive,roleid,internalnote,{userhierarkis:[{child:[id,login,firstname,lastname]}]},{userhierarkis1:[{parent:[id,login,firstname,lastname]}]},{user_institutions:[empty,{institution:[id,{tag:[plurname]}]}]}]}',
            'userid': this.user.id
        }, function (result) {
            for (var attr in result.data[0])
                _this.set('user.' + attr, result.data[0][attr]);
            _this.isGettingUser = false;
        });
    };
    //@observe('user.email')
    //private emailChanged(newVal: string) {
    //    if (this.isGettingUser || !newVal)
    //        return;
    //    Services.update('user', { 'userid': this.user.id, 'email': newVal }, (result) => { this.getUser(); })
    //}
    PanelUserAdmin.prototype.institutionPropertyChanged = function (e) {
        if (this.isGettingUser)
            return;
        var property = e.path.split('.')[1];
        switch (property) {
            case 'email':
            case 'roleid':
            case 'internalnote':
                this.updateUserProperty(property);
        }
    };
    PanelUserAdmin.prototype.updateUserProperty = function (property) {
        Services.update('user', JSON.parse('{ "id": ' + this.user.id + ', "' + property + '": "' + this.user[property] + '" }'));
    };
    PanelUserAdmin.prototype.institutions = function (institutions) {
        var result = [];
        for (var _i = 0, institutions_1 = institutions; _i < institutions_1.length; _i++) {
            var data = institutions_1[_i];
            result.push(data.institution.tag.plurname);
        }
        return result.join(', ');
    };
    PanelUserAdmin.prototype.activeClass = function (isactive) {
        if (isactive == null)
            return '';
        return isactive ? 'active' : 'inactive';
    };
    PanelUserAdmin.prototype.roleName = function (id) {
        return this.roleNames[id];
    };
    PanelUserAdmin.prototype.activeTap = function () {
        $(this).append(DialogConfirm.create('toggle-active', 'Er du sikker på at du vil ' + (this.user.isactive ? 'IN' : '') + 'AKTIVERE denne bruger?'));
    };
    PanelUserAdmin.prototype.toggleActiveConfirmed = function (e) {
        var _this = this;
        Services.update('user', { 'userid': this.user.id, 'isactive': !this.user.isactive }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.getAutosuggestSchema = function (user_institutions) {
        if (!user_institutions)
            return;
        var existingIds = [];
        for (var _i = 0, user_institutions_1 = user_institutions; _i < user_institutions_1.length; _i++) {
            var item = user_institutions_1[_i];
            existingIds.push(item.institution.id);
        }
        return '{institution:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},tag:{plurname:{like:$input}}},fields:[id,{tag:[plurname]}]}}';
    };
    PanelUserAdmin.prototype.institutionAdded = function (e) {
        var _this = this;
        Services.insert('user_institution', { 'institutionid': e.detail.id, 'userid': this.user.id }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.institutionRemoved = function (e) {
        var _this = this;
        Services.delete('user_institution', { 'institutionid': e.detail.institution.id, 'userid': this.user.id, 'deletemode': 'permanent' }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.getUserAutosuggestSchema = function (userhierarkis) {
        if (!userhierarkis)
            return;
        var existingIds = [];
        for (var _i = 0, userhierarkis_1 = userhierarkis; _i < userhierarkis_1.length; _i++) {
            var item = userhierarkis_1[_i];
            existingIds.push(item.child ? item.child.id : item.parent.id);
        }
        return '{user:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},firstname:{like:$input}},fields:[id,login,firstname,lastname]}}';
    };
    PanelUserAdmin.prototype.writerAdded = function (e) {
        var _this = this;
        Services.insert('userhierarki', { 'upperuserid': this.user.id, 'userid': e.detail.id }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.writerRemoved = function (e) {
        var _this = this;
        Services.delete('userhierarki', { 'upperuserid': this.user.id, 'userid': e.detail.child.id, 'deletemode': 'permanent' }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.editorAdded = function (e) {
        var _this = this;
        Services.insert('userhierarki', { 'upperuserid': e.detail.id, 'userid': this.user.id }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.editorRemoved = function (e) {
        var _this = this;
        Services.delete('userhierarki', { 'upperuserid': e.detail.parent.id, 'userid': this.user.id, 'deletemode': 'permanent' }, function (result) { _this.getUser(); });
    };
    PanelUserAdmin.prototype.sortOnLogin = function () {
        this.$.admin.sort(this.compareLogin);
    };
    PanelUserAdmin.prototype.compareLogin = function (a, b) {
        return a.login.localeCompare(b.login);
    };
    PanelUserAdmin.prototype.sortOnName = function () {
        this.$.admin.sort(this.compareName);
    };
    PanelUserAdmin.prototype.compareName = function (a, b) {
        return (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname);
    };
    PanelUserAdmin.prototype.sortOnRole = function () {
        this.$.admin.sort(this.compareRole);
    };
    PanelUserAdmin.prototype.compareRole = function (a, b) {
        return a.roleid - b.roleid;
    };
    PanelUserAdmin.prototype.sortOnInstitution = function () {
        this.$.admin.sort(this.compareInstitution);
    };
    PanelUserAdmin.prototype.compareInstitution = function (a, b) {
        if (a.user_institutions.length == 0)
            return b.user_institutions.length == 0 ? 0 : 1;
        if (b.user_institutions.length == 0)
            return a.user_institutions.length == 0 ? 0 : -1;
        return a.user_institutions[0].institution.tag.plurname.localeCompare(b.user_institutions[0].institution.tag.plurname);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelUserAdmin.prototype, "users", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], PanelUserAdmin.prototype, "user", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelUserAdmin.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelUserAdmin.prototype, "selected", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PanelUserAdmin.prototype, "showDetails", void 0);
    __decorate([
        property({ type: Array, value: ['læser', 'skribent', 'redaktør', 'lokal admin.', 'administrator'] }), 
        __metadata('design:type', Array)
    ], PanelUserAdmin.prototype, "roleNames", void 0);
    __decorate([
        property({ type: Number, value: 5 }), 
        __metadata('design:type', Number)
    ], PanelUserAdmin.prototype, "roleIDFilter", void 0);
    __decorate([
        property({ type: Number, value: 1 }), 
        __metadata('design:type', Number)
    ], PanelUserAdmin.prototype, "kind", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "selectedChanged", null);
    __decorate([
        observe('kind'),
        observe('roleIDFilter'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "kindChanged", null);
    __decorate([
        observe('user'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "getUser", null);
    __decorate([
        observe('user.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "institutionPropertyChanged", null);
    __decorate([
        listen('toggle-active-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "toggleActiveConfirmed", null);
    __decorate([
        listen('institutionAutosuggestAdded'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "institutionAdded", null);
    __decorate([
        listen('institutionAutosuggestRemoved'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "institutionRemoved", null);
    __decorate([
        listen('writerAutosuggestAdded'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "writerAdded", null);
    __decorate([
        listen('writerAutosuggestRemoved'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "writerRemoved", null);
    __decorate([
        listen('editorAutosuggestAdded'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "editorAdded", null);
    __decorate([
        listen('editorAutosuggestRemoved'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelUserAdmin.prototype, "editorRemoved", null);
    PanelUserAdmin = __decorate([
        component("panel-user-admin"), 
        __metadata('design:paramtypes', [])
    ], PanelUserAdmin);
    return PanelUserAdmin;
}(polymer.Base));
PanelUserAdmin.register();
//# sourceMappingURL=panel-user-admin.js.map