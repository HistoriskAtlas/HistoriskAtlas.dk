@component("list-auto-suggest")
class ListAutoSuggest extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public items: Array<any>;

    @property({ type: String })
    public autosuggestSchema: string;

    @property({ type: String })
    public autosuggestService: string;

    @property({ type: String })
    public namePath: string;

    @property({ type: String })
    public suggestNamePath: string;

    @property({ type: String })
    public input: string;

    @property({ type: Array })
    public autocompleteItems: Array<any>;

    @property({ type: Boolean, value: false })
    public autocompleteIsOpen: boolean;

    private pendingRequests: number = 0;

    ready() {
    }
    
    closeTap(e: any) {
        $(this).append(DialogConfirm.create('delete-listitem', 'Er du sikker på at du vil fjerne "' + this.name(e.model.item) + '" fra listen?', e.model.item));
    }
    @listen('delete-listitem-confirmed')
    deleteListitemConfirmed(e: any) {
        this.fire(this.id + 'Removed', e.detail);
    }

    toggleAutocomplete() {
        this.autocompleteIsOpen = !this.autocompleteIsOpen; 
    }
    @observe('autocompleteIsOpen')
    autocompleteIsOpenChanged() {
        if (this.autocompleteIsOpen)
            setTimeout(() => this.$$('#inputAutocomplete').focus(), 0);
        else
            this.input = '';
    }

    @observe('input')
    inputChanged() {
        if (this.pendingRequests > 0)
            return;        

        this.requestAutocompleteItems();
    }
    private requestAutocompleteItems() {
        this.pendingRequests++;

        if (this.input.length < 3) {
            this.setAutocompleteItems([]);
            return;
        }
        //var existingIds: Array<number> = [];
        //for (var item of this.items)
        //    existingIds.push(item.institution.id) //TODO

        Services.get(this.autosuggestService, {
            //'schema': '{institution:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},tag:{plurname:{like:' + this.input + '}}},fields:[id,{tag:[plurname]}]}}',
            'schema': this.autosuggestSchema.replace('$input', this.input),
            'count': 5
        }, (result) => {
            this.setAutocompleteItems(result.data);
        })
    }
    private setAutocompleteItems(data: any) {
        this.autocompleteItems = data;

        if (this.pendingRequests > 1) {
            this.pendingRequests = 0;
            this.requestAutocompleteItems();
        } else 
            this.pendingRequests = 0;
    }

    toggleAutocompleteIcon(autocompleteIsOpen: boolean): string {
        return autocompleteIsOpen ? 'close' : 'add';
    }

    checkForEnter(e: any) {
        if (e.keyCode === 13 && this.autocompleteItems.length > 0)
            this.add(this.autocompleteItems[0]);
    }
    addTap(e: any) {
        this.add(e.model.item)
    }
    private add(item: any) {
        this.autocompleteIsOpen = false;
        this.fire(this.id + 'Added', item);
    }

    name(item: Object): string {
        return Common.objPathsString(item, this.namePath);
    }

    suggestName(item: Object): string {
        return Common.objPathsString(item, this.suggestNamePath);
    }


}

ListAutoSuggest.register();