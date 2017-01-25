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
var PanelInstitutionAdmin = (function (_super) {
    __extends(PanelInstitutionAdmin, _super);
    function PanelInstitutionAdmin() {
        _super.apply(this, arguments);
        this.isGettingInstitution = false;
    }
    PanelInstitutionAdmin.prototype.selectedChanged = function () {
        if (this.selected && !this.institutions) {
            this.institutions = [];
            this.sortOnName();
            this.fetchInstitutions();
        }
    };
    PanelInstitutionAdmin.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchInstitutions();
    };
    PanelInstitutionAdmin.prototype.fetchInstitutions = function () {
        var _this = this;
        Services.get('institution', {
            'schema': '{institution:{' + (this.filter ? 'filters:[{tag:[{plurname:{like:' + this.filter + '}}]}],' : '') + 'fields:[id,type,{user_institutions:[{user:[firstname,lastname]}]},{tag:[plurname]}]}}',
            'count': 'all'
        }, function (result) {
            _this.updateInstitutions(result.data);
        });
    };
    PanelInstitutionAdmin.prototype.updateInstitutions = function (newList) {
        this.$.admin.sort(null, newList);
    };
    PanelInstitutionAdmin.prototype.itemTap = function (e) {
        this.$.admin.select(e.model.item);
    };
    PanelInstitutionAdmin.prototype.getInstitution = function () {
        var _this = this;
        if (!this.institution)
            return;
        this.isGettingInstitution = true;
        Services.get('institution', {
            'schema': '{institution:[id,url,email,{user_institutions:[{user:[id,login,firstname,lastname]}]},{tag:[id,plurname]}]}',
            'id': this.institution.id
        }, function (result) {
            for (var attr in result.data[0])
                _this.set('institution.' + attr, result.data[0][attr]);
            _this.isGettingInstitution = false;
        });
    };
    PanelInstitutionAdmin.prototype.instType = function (type) {
        return HAInstitution.types[type];
    };
    PanelInstitutionAdmin.prototype.userNames = function (user_institutions) {
        var result = [];
        for (var _i = 0, user_institutions_1 = user_institutions; _i < user_institutions_1.length; _i++) {
            var data = user_institutions_1[_i];
            result.push(data.user.firstname + ' ' + data.user.lastname);
        }
        return result.join(', ');
    };
    PanelInstitutionAdmin.prototype.institutionPropertyChanged = function (e) {
        if (this.isGettingInstitution)
            return;
        if (e.path == 'institution.tag.plurname')
            Services.update('tag', JSON.parse('{ "id": ' + this.institution.tag.id + ', "plurname": "' + this.institution.tag.plurname + '", "singname": "' + this.institution.tag.plurname + '" }'));
        var property = e.path.split('.')[1];
        switch (property) {
            case 'url':
            case 'email':
                this.updateUserProperty(property);
        }
    };
    PanelInstitutionAdmin.prototype.updateUserProperty = function (property) {
        Services.update('institution', JSON.parse('{ "id": ' + this.institution.id + ', "' + property + '": "' + this.institution[property] + '" }'));
    };
    PanelInstitutionAdmin.prototype.getAutosuggestSchema = function (user_institutions) {
        var existingIds = [];
        for (var _i = 0, user_institutions_2 = user_institutions; _i < user_institutions_2.length; _i++) {
            var item = user_institutions_2[_i];
            existingIds.push(item.user.id);
        }
        return '{user:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},firstname:{like:$input}},fields:[id,login,firstname,lastname]}}';
    };
    PanelInstitutionAdmin.prototype.userAdded = function (e) {
        var _this = this;
        Services.insert('user_institution', { 'institutionid': this.institution.id, 'userid': e.detail.id }, function (result) { _this.getInstitution(); });
    };
    PanelInstitutionAdmin.prototype.userRemoved = function (e) {
        var _this = this;
        Services.delete('user_institution', { 'institutionid': this.institution.id, 'userid': e.detail.user.id, 'deletemode': 'permanent' }, function (result) { _this.getInstitution(); });
    };
    PanelInstitutionAdmin.prototype.sortOnName = function () {
        this.$.admin.sort(this.compareName);
    };
    PanelInstitutionAdmin.prototype.compareName = function (a, b) {
        return a.tag.plurname.localeCompare(b.tag.plurname);
    };
    PanelInstitutionAdmin.prototype.sortOnType = function () {
        this.$.admin.sort(this.compareType);
    };
    PanelInstitutionAdmin.prototype.compareType = function (a, b) {
        return a.type - b.type;
    };
    PanelInstitutionAdmin.prototype.sortOnUsers = function () {
        this.$.admin.sort(this.compareUsers);
    };
    PanelInstitutionAdmin.prototype.compareUsers = function (a, b) {
        var aName = a.user_institutions.length == 0 ? '' : a.user_institutions[0].user.firstname + a.user_institutions[0].user.lastname;
        var bName = b.user_institutions.length == 0 ? '' : b.user_institutions[0].user.firstname + b.user_institutions[0].user.lastname;
        return aName.localeCompare(bName);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelInstitutionAdmin.prototype, "institutions", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], PanelInstitutionAdmin.prototype, "institution", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelInstitutionAdmin.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelInstitutionAdmin.prototype, "selected", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelInstitutionAdmin.prototype, "selectedChanged", null);
    __decorate([
        observe('institution'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelInstitutionAdmin.prototype, "getInstitution", null);
    __decorate([
        observe('institution.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelInstitutionAdmin.prototype, "institutionPropertyChanged", null);
    __decorate([
        listen('userAutosuggestAdded'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelInstitutionAdmin.prototype, "userAdded", null);
    __decorate([
        listen('userAutosuggestRemoved'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], PanelInstitutionAdmin.prototype, "userRemoved", null);
    PanelInstitutionAdmin = __decorate([
        component("panel-institution-admin"), 
        __metadata('design:paramtypes', [])
    ], PanelInstitutionAdmin);
    return PanelInstitutionAdmin;
}(polymer.Base));
PanelInstitutionAdmin.register();
