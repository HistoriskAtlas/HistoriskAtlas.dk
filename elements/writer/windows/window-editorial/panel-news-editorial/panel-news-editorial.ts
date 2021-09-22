@component("panel-news-editorial")
class PanelNewsEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public geos: Array<any>;

    @property({ type: String, value: '' })
    public filter: string

    @property({ type: Boolean })
    public selected: boolean;

    @property({ type: Number, value: 0 })
    public kind: number;

    @observe('selected')
    selectedChanged() {
        if (this.selected && !this.geos) {
            this.geos = [];
            this.fetchGeos();
        }
    }

    public fetchGeos() {
        //Services.get('geo', {
        //    'schema': JSON.stringify(
        //        {
        //            geo: {
        //                fields: [
        //                    'id',
        //                    'title',
        //                    'created',
        //                    { tag_geos: [{ tag: ['id', 'plurname', 'category'] }] }
        //                ],
        //                filters: {
        //                    online: true
        //                }
        //            }
        //        }
        //    ),
        //    'count': '10',
        //    'sort': '{created:desc}'
        Services.HAAPI_GET('geos', { schema: 'newest' }, (result) => {
            this.updateGeos(result.data);
        })
    }

    public updateGeos(newList: Array<any> = null) {
        this.set('geos', (newList ? newList : this.geos));
        this.$.list.notifyResize();
    }

    formatDate(date: string): string {
        return Common.formatDate(date);
    }

    itemTap(e: any) {
        Common.geoClick(e.model.item.geoid);
    }

    numberWithSeparaters(n: number): string {
        return Common.numberWithSeparaters(n);
    }

    formatInstitutions(tags: Array<any>): string {
        var institutions: Array<string> = [];
        for (var tag of tags)
            if (tag.category == 3)
                institutions.push(tag.plurname);
        return institutions.join(', ');
    }
}

PanelNewsEditorial.register();