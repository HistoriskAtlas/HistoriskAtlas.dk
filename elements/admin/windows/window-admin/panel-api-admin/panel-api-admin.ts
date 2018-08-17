@component("panel-api-admin")
class PanelAPIAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public keys: Array<any>;

    @property({ type: Object })
    public key: any;

    @property({ type: Array })
    public logs: Array<any>;

    //@property({ type: String, value: '' })
    //public filter: string;

    @property({ type: Boolean })
    public selected: boolean;

    @observe('selected') 
    selectedChanged() {
        if (this.selected && !this.keys) {
            this.keys = [];
            //this.sortOnKey()
            //for (var i = 0; i < HaTag.categoryNames.length; i++)
            //    if (i != 3 && i != 6)
            //        this.push('categories', { id: i, name: HaTag.categoryNames[i] });

            //this.set('categoryIndex', 7);
            //this.tags = [];
            this.fetchKeys();
        }
    }

    formatDate(date: string): string {
        return Common.formatDate(date);
    }

    logItemClass(item, key) {
        return 'logitem' + (key.urorua == item.urorua ? ' match' : '')
    }

    //filterCheckForEnter(e: any) {
    //    if (e.keyCode === 13)
    //        this.fetchKeys();
    //}

    //@observe('categoryIndex')
    //categoryIndexChanged() {
    //    this.tags = [];
    //    this.fetchTags();
    //}

    public fetchKeys() {
        Services.get('hadb5stats.AuthKey', {
            'schema': '{authkey:[key,urorua,description,created]}',
            'count': 'all'
        }, (result) => {
            result.data.push({
                key: '',
                urorua: '',
                description: 'Uden key',
                created: '2018-01-01'
            });
            this.updateKeys(result.data);
        })
    }

    public updateKeys(newList: Array<any> = null) {
        //this.set('keys', newList);
        this.$.admin.sort(null, newList);
    }


    itemTap(e: any) {
        this.$.admin.select(e.model.item);
    }
    @observe('key')
    private getKey() {
        if (!this.key)
            return;

        this.set('logs', []);
        Services.get('hadb5stats.LogTile', {
            'schema': '{logtile:[urorua,count]}', //TODO: filter by date (year / month)
            'authkey': this.key.key,
            'count': 'all'
        }, (result) => {
            var sum = {};
            for (var log of result.data)
                if (sum[log.urorua])
                    sum[log.urorua] += log.count;
                else
                    sum[log.urorua] = log.count;

            result.data = [];
            for (var param in sum)
                result.data.push({ urorua: param, count: sum[param] });
            
            this.set('logs', result.data)
        })
    }

    sortOnKey() {
        this.$.admin.sort(this.compareKey);
    }
    compareKey(a: any, b: any): number {
        return a.key.localeCompare(b.key);
    }

    //sortOnCategory() {
    //    this.$.admin.sort(this.compareCategory);
    //}
    //compareCategory(a: any, b: any): number {
    //    return a.category - b.category;
    //}
}

PanelAPIAdmin.register();