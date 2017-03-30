@component("window-geo-biblio")
class WindowGeoBiblio extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public url: string;

    @property({ type: String, notify: true })
    public cql: string;

    @property({ type: String })
    public immediatecql: string;

    @property({ type: Boolean })
    public searching: boolean;

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Object })
    public params: Object;

    @property({ type: Array })
    public biblios: Array<Biblio>;

    @property({ type: Boolean, value: false })
    public showCql: boolean;

    private _closingItem: boolean;

    @observe("cql")
    cqlChanged() {
        //if (!this.geo.id)
        //    return;
        this.immediatecql = this.cql;
        this.set('params', {
            'cql': this.cql
        });
        if (!this._closingItem) {
            this.searching = true;
            this.biblios = null;
        }
        this._closingItem = false;
        if (!this.url)
            this.url = location.protocol + '//' + (Common.isDevOrBeta ? 'beta.' : '') + 'historiskatlas.dk/proxy/biblio.json'
        this.$.ajax.generateRequest();
    }

    search() {
        this.set('cql', this.immediatecql);
    }

    public handleResponse() {
        this.searching = false;
        var data = this.$.ajax.lastResponse;
        this.biblios = data.biblios;
    }

    secondLine(creator: string, date: string, format: string): string {
        var line: Array<string> = [];
        if (creator)
            line.push(creator)
        if (date)
            line.push(date)
        if (format)
            line.push(format)
        return line.join(' - ');
    }
    
    biblioTap(e: any) {
        var biblio = <Biblio>e.model.biblio;
        window.open(biblio.url, '_blank');
    }

    closeTap(e: any) {
        e.stopPropagation();
        var biblio = <Biblio>this.$.biblioRepeat.modelForElement(e.currentTarget).biblio;

        var ids = [];
        if (biblio.identifiers.length == 0)
            ids.push(biblio.id.split('|')[0]);
        else
            for (var identifier of biblio.identifiers)
                ids.push(identifier.split(':')[1]);

        var idString = ids.join(' or ');

        this._closingItem = true;
        this.splice('biblios', this.biblios.indexOf(biblio), 1);
        this.cql = (/not rec\.id = \(.*\)$/g).test(this.cql) ? this.cql.slice(0, -1) + ' or ' + idString + ')' : '(' + this.cql + ') not rec.id = (' + idString + ')';
    }

    toggleIcon(showCql: boolean) {
        return showCql ? 'remove' : 'add';
    }

    toggleCqlTap() {
        this.showCql = !this.showCql;
    }
}

class Biblio {
    id: string;
    title: string;
    creator: string;
    subject: string;
    date: string;
    format: string;
    description: string;
    url: string;
    identifiers: Array<string>;
}

WindowGeoBiblio.register();