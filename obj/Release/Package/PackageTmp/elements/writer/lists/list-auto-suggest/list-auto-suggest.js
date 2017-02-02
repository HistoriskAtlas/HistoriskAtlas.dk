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
var ListAutoSuggest = (function (_super) {
    __extends(ListAutoSuggest, _super);
    function ListAutoSuggest() {
        _super.apply(this, arguments);
        this.pendingRequests = 0;
    }
    ListAutoSuggest.prototype.ready = function () {
    };
    ListAutoSuggest.prototype.selectTap = function (e) {
        this.fire(this.id + 'Selected', e.model.item);
    };
    ListAutoSuggest.prototype.close = function (e) {
        this.confirmDelete(e.detail);
    };
    ListAutoSuggest.prototype.closeTap = function (e) {
        this.confirmDelete(e.model.item);
    };
    ListAutoSuggest.prototype.confirmDelete = function (item) {
        $(this).append(DialogConfirm.create('delete-listitem', 'Er du sikker på at du vil fjerne "' + this.name(item) + '" fra listen?', item));
    };
    ListAutoSuggest.prototype.deleteListitemConfirmed = function (e) {
        this.fire(this.id + 'Removed', e.detail);
    };
    ListAutoSuggest.prototype.toggleAutocomplete = function () {
        this.autocompleteIsOpen = !this.autocompleteIsOpen;
    };
    ListAutoSuggest.prototype.autocompleteIsOpenChanged = function () {
        var _this = this;
        if (this.autocompleteIsOpen)
            setTimeout(function () { return _this.$$('#inputAutocomplete').focus(); }, 0);
        else
            this.input = '';
    };
    ListAutoSuggest.prototype.inputChanged = function () {
        if (this.pendingRequests > 0)
            return;
        this.requestAutocompleteItems();
    };
    ListAutoSuggest.prototype.requestAutocompleteItems = function () {
        var _this = this;
        this.pendingRequests++;
        if (this.input.length < 3) {
            this.setAutocompleteItems([]);
            return;
        }
        Services.get(this.autosuggestService, {
            'schema': this.autosuggestSchema.replace('$input', this.input),
            'count': 5
        }, function (result) {
            _this.setAutocompleteItems(result.data);
        });
    };
    ListAutoSuggest.prototype.setAutocompleteItems = function (data) {
        this.autocompleteItems = data;
        if (this.pendingRequests > 1) {
            this.pendingRequests = 0;
            this.requestAutocompleteItems();
        }
        else
            this.pendingRequests = 0;
    };
    ListAutoSuggest.prototype.toggleAutocompleteIcon = function (autocompleteIsOpen) {
        return autocompleteIsOpen ? 'close' : 'add';
    };
    ListAutoSuggest.prototype.checkForEnter = function (e) {
        if (e.keyCode === 13 && this.autocompleteItems.length > 0)
            this.add(this.autocompleteItems[0]);
    };
    ListAutoSuggest.prototype.addTap = function (e) {
        this.add(e.model.item);
    };
    ListAutoSuggest.prototype.add = function (item) {
        this.autocompleteIsOpen = false;
        this.fire(this.id + 'Added', item);
    };
    ListAutoSuggest.prototype.name = function (item) {
        return Common.objPathsString(item, this.namePath);
    };
    ListAutoSuggest.prototype.suggestName = function (item) {
        return Common.objPathsString(item, this.suggestNamePath);
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], ListAutoSuggest.prototype, "items", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ListAutoSuggest.prototype, "autosuggestSchema", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ListAutoSuggest.prototype, "autosuggestService", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ListAutoSuggest.prototype, "namePath", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ListAutoSuggest.prototype, "suggestNamePath", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ListAutoSuggest.prototype, "input", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], ListAutoSuggest.prototype, "autocompleteItems", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], ListAutoSuggest.prototype, "autocompleteIsOpen", void 0);
    __decorate([
        listen('close'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ListAutoSuggest.prototype, "close", null);
    __decorate([
        listen('delete-listitem-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ListAutoSuggest.prototype, "deleteListitemConfirmed", null);
    __decorate([
        observe('autocompleteIsOpen'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], ListAutoSuggest.prototype, "autocompleteIsOpenChanged", null);
    __decorate([
        observe('input'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], ListAutoSuggest.prototype, "inputChanged", null);
    ListAutoSuggest = __decorate([
        component("list-auto-suggest"), 
        __metadata('design:paramtypes', [])
    ], ListAutoSuggest);
    return ListAutoSuggest;
}(polymer.Base));
ListAutoSuggest.register();
