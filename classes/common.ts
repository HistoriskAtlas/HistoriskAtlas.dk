class Common {

    private static r2hItalic: RegExp = new RegExp("'''(.*?)'''", 'gi')
    private static r2hBold: RegExp = new RegExp("''(.*?)''", 'gi')
    private static r2hSpace: RegExp = new RegExp("  ", 'gi')
    private static r2hLinebreak: RegExp = new RegExp("\\n", 'gi')
    private static r2hA: RegExp = new RegExp("\\[(https?:\\/\\/.*?) (.*?)\\]", 'gi')

    private static h2rItalic: RegExp = new RegExp('<i>(.*?)<\/i>', 'gi')
    private static h2rBold: RegExp = new RegExp('<b>(.*?)<\/b>', 'gi')
    private static h2rSpace: RegExp = new RegExp("&nbsp;", 'gi')
    private static h2rLinebreak: RegExp = new RegExp("<br>", 'gi')
    private static h2rDiv: RegExp = new RegExp("<div>(.*?)<\/div>", 'gi')
    private static h2rA: RegExp = new RegExp("<a href=[\"'](https?:\\/\\/.*?)[\"']>(.*?)<\\/a>", 'gi')

    public static dom = $(document.body);
    private static _api: string;
    public static apiSchemaTags = '{tag:[tagid,plurname,singname,category,yearstart,yearend,{parents:[empty,{collapse:{parent:id}}]}]}'

    public static get isDevOrBeta(): boolean {
        if (this.standalone)
            return document.location.hostname.indexOf('beta') == 0 || document.location.hostname.indexOf('localhost') == 0;
        return App.isDev || document.location.hostname.indexOf('beta') == 0;
    }

    public static get api(): string {
        if (!this._api) {
            this._api = 'http://' + (this.isDevOrBeta ? 'beta.' : '') + 'api.historiskatlas.dk/hadb5' + (this.isDevOrBeta ? 'beta' : '') + '.';

            //this._api = 'http://beta.api.historiskatlas.dk/hadb5.';
            //this._api = 'http://34.252.49.216/hadb5beta.'
        }

        return this._api;
    }

    public static rich2html(rich: string): string {
        var result: string = rich;
        result = result.replace(Common.r2hLinebreak, '<br>'); //Need to be first(?)
        result = result.replace(Common.r2hItalic, '<i>$1</i>');
        result = result.replace(Common.r2hBold, '<b>$1</b>');
        result = result.replace(Common.r2hA, "<a href='$1'>$2</a>");
        result = result.replace(Common.r2hSpace, ' &nbsp;');
        return result;
    }

    public static html2rich(html: string): string {
        var result: string = html;
        result = result.replace(Common.h2rItalic, "'''$1'''");
        result = result.replace(Common.h2rBold, "''$1''");
        result = result.replace(Common.h2rSpace, " ");
        result = result.replace(Common.h2rDiv, "\n$1");
        result = result.replace(Common.h2rA, "[$1 $2]");
        result = result.replace(Common.h2rLinebreak, "\n"); //Needs to be last
        return result;
    }

    public static toMapCoord(coord: ol.Coordinate): ol.Coordinate {
        return ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
    }

    public static fromMapCoord(coord: ol.Coordinate): ol.Coordinate {
        return ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
    }

    public static years(start: number, end: number): string {
        return (start ? start + ' - ' : '') + (end == 2050 ? 'nu' : end);
    }

    public static geoClick(id: number) {
        var geo = App.haGeos.geos[id];
        if (!geo) {
            App.toast.show('Lokaliteten er ikke tilgængelig')
            return;
        }

        Common.dom.append(WindowGeo.create(geo));
    }

    public static dateTimeStringFromMs(ms: number): string {
        var date = new Date(ms);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
    public static formatDate(stringDate: string): string {
         return this.shortDate(new Date(stringDate));
    }
    public static shortDate(date: Date): string {
        return date ? date.getDate() + '/' + (date.getMonth() + 1) + '-' + date.getFullYear() : '';
    }
    public static shortTime(date: Date): string {
        return date ? date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '';
    }

    public static get standalone(): boolean {
        return typeof App == 'undefined';
    }

    public static objPath(obj: Object, path: string): any {
        return path.split('.').reduce((o, i) => o[i], obj);
    }

    public static objPathsString(obj: Object, paths: string): string {
        var result: string = '';
        for (var part of paths.split(',')) {
            if (part.substr(0, 1) == "$")
                result += part.substr(1);
            else {
                var val = Common.objPath(obj, part);
                if (val)
                    result += val;
            }
        }
        return result;
    }

    public static importModule(name: string, callback: (e: Event) => void = null) { //TODO: check if module is already loaded first
        if (document.getElementById('module_' + name)) {
            if (callback)
                callback(null);
            return;
        }
        var link = document.createElement('link');
        link.id = 'module_' + name;
        if (callback)
            link.onload = callback
        link.rel = 'import';
        link.href = 'elements/' + name + '.aspx';
        link.setAttribute('async', '');
        document.head.appendChild(link);
    }
}

class ChangeRecord<T> {
    public indexSplices: Array<IndexSplice<T>>;
    public keySplices: Array<KeySplice>;
}

class IndexSplice<T> {
    public index: number;
    public removed: Array<T>
    public addedCount: number;
}

class KeySplice {
    public added: Array<any>
    public removed: Array<any>
}