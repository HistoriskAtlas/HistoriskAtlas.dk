class Common {

    private static r2hItalic: RegExp = new RegExp("'''(.*?)'''", 'gi')
    private static r2hBold: RegExp = new RegExp("''(.*?)''", 'gi')
    private static r2hSpace: RegExp = new RegExp("  ", 'gi')
    private static r2hLinebreak: RegExp = new RegExp("\\n", 'gi')
    private static r2hA: RegExp = new RegExp("\\[(https?:\\/\\/.*?) (.*?)\\]", 'gi')

    //private static h2rItalic: RegExp = new RegExp('<i>(.*?)<\/i>', 'gi')
    private static h2rItalic: RegExp = new RegExp('<(?:i|em)>(.*?)<\/(?:i|em)>', 'gi')
    //private static h2rBold: RegExp = new RegExp('<b>(.*?)<\/b>', 'gi')
    private static h2rBold: RegExp = new RegExp('<(?:b|strong)>(.*?)<\/(?:b|strong)>', 'gi')
    private static h2rSpace: RegExp = new RegExp("&nbsp;", 'gi')
    private static h2rLinebreak: RegExp = new RegExp("<br>", 'gi')
    private static h2rDiv: RegExp = new RegExp("<div>(.*?)<\/div>", 'gi')
    private static h2rP: RegExp = new RegExp("<p>(.*?)<\/p>", 'gi')
    private static h2rA: RegExp = new RegExp("<a href=[\"'](https?:\\/\\/.*?)[\"']>(.*?)<\\/a>", 'gi')

    public static dom = $(document.body);
    //private static _api: string;
    //private static _baseApi: string;
    public static apiSchemaTags = '{tag:[tagid,plurname,singname,category,yearstart,yearend,{parents:[empty,{collapse:{parent:id}}]}]}'
    public static base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    public static openGeoWindowInNewTab: boolean;

    public static get isDevOrBeta(): boolean {



        //return false;




        if (this.standalone)
            return document.location.hostname.indexOf('beta') == 0 || document.location.hostname.indexOf('localhost') == 0;
        return App.isDev() || document.location.hostname.indexOf('beta') == 0;
    }

    //beta.api | betasecure.api
    //api | secureapi

    public static get apiKey(): string {
        //return App.isDev() ? "ZGV2ZWxvcG" : "aGlzdG9yaX";
        return typeof App == 'undefined' || !App.isDev() ? "00e763e5df5f47e3a4a64aea3a18fdaa" : "0f38b3d8b8ec48ba9d406e9edb5700ce";
    }

    //public static get api(): string {
    //    if (!this._api)
    //        this._api = Common.baseApi + '/hadb6' + (this.isDevOrBeta ? 'beta' : '') + '.'; //'/hadb5'

    //    return this._api;
    //}

    //public static get baseApi(): string {
    //    if (!this._api) {
    //        //this._baseApi = location.protocol + '//' + (this.isDevOrBeta ? ((location.protocol == 'https:' ? 'betasecure.' : 'beta.')) : (location.protocol == 'https:' ? 'secure' : '')) + 'api.historiskatlas.dk/api';
    //        this._baseApi = location.protocol + '//' + (location.protocol == 'https:' ? 'secure' : '') + 'api.historiskatlas.dk/api';
    //        //this._api = 'http://beta.api.historiskatlas.dk/hadb5.';
    //        //this._api = 'http://34.252.49.216/hadb5beta.'
    //    }

    //    return this._baseApi;
    //}

    public static get baseUrl(): string {
        return location.protocol + '//' + location.host;
    }

    public static numberWithSeparaters(n: number): string {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    public static rich2html(rich: string): string {
        var result: string = rich;

        //reflect changes to this to Common.cs!
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
        result = result.replace(Common.h2rP, "$1\n");
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

    public static sphericalDistance(coord1: ol.Coordinate, coord2: ol.Coordinate) {

        var R = 6371000; // m
        var dLon = this.toRad(coord2[0] - coord1[0]), //lon2 - lon1
            lat1 = this.toRad(coord1[1]),
            lat2 = this.toRad(coord2[1]);

        return Math.acos(Math.min(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon), 1)) * R;
    }
    public static toRad(x): number { return x * Math.PI / 180; }

    public static years(start: number, end: number): string {
        return (start ? start + ' - ' : '') + (end == 2050 ? 'nu' : end);
    }

    public static geoClick(id: number) {
        var geo = App.haGeos.geos[id];
        if (!geo) {
            App.toast.show('Lokaliteten er ikke tilgængelig')
            return;
        }
        this.directGeoClick(geo);
    }
    public static directGeoClick(geo: HaGeo) {
        if (this.openGeoWindowInNewTab)
            window.open(geo.link, '_new');
        else
            Common.dom.append(geo.imageOnlyUrl ? WindowExtImage.create(geo) : WindowGeo.create(geo));
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
    public static get embed(): boolean {
        if (typeof App == 'undefined')
            return false;

        return App.passed.embed;
    }

    public static objPath(obj: Object, path: string): any {
        return path.split('.').reduce((o, i) => o[i], obj);
    }

    public static objPathsString(obj: Object, paths: string): string {
        var result: string = '';
        for (var part of paths.split(',')) {
            if (part.substr(0, 1) == "$") {
                if (part.substr(0, 9) == '$deleted=') {
                    var val = Common.objPath(obj, part.substr(9));
                    if (val)
                        result += ' SLETTET';
                } else
                    result += part.substr(1);
            } else {
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

    public static loadJS(id: string, src: string, callback: (e: Event) => void = null) {
        //(function (d) {
        var js;
        if (document.getElementById(id)) {
            if (callback)
                callback(null);
            return;
        }
        js = document.createElement('script'); js.id = id; js.async = true;
        if (callback)
            js.onload = callback;
        js.src = src;
        document.getElementsByTagName('head')[0].appendChild(js);
        //} (document));
    }

    public static loadCSS(id: string, src: string) {
        if (document.getElementById(id))
            return;

        var link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = src;
        document.getElementsByTagName("head")[0].appendChild(link)
    }


    public static get isIE(): boolean {
        return window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    }

    public static savePDF(url: string, title: string, method: string = 'GET', data: string = null) {
        var loadingText = "Henter PDF";
        App.loading.show(loadingText)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                App.loading.hide(loadingText);
                Common.saveBlob(xhr.response, title); //, false
            }
        }
        xhr.open(method, url, true);
        xhr.responseType = 'blob';
        if (method == 'POST') {
            xhr.setRequestHeader("Content-type", "multipart/form-data");
            xhr.send(data);
        }
        else
            xhr.send(); 
    }

    public static saveBlob(blob: Blob, filename: string, forceDownload: boolean = true) {
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(blob, filename);
        else {
            var url = window.URL || (<any>window).webkitURL;
            var elem = window.document.createElement('a');
            elem.href = url.createObjectURL(blob);
            if (forceDownload)
                elem.setAttribute('download', filename);
            else
                elem.target = '_new';
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
            url.revokeObjectURL(elem.href);
        }
    }

    public static truncateHtml(html: string, reqCount: number) {
        return this.truncateHtmlInner($('<div>' + html + '</div>').unwrap()[0], reqCount);
    }
    private static truncateHtmlInner(elem: HTMLElement, reqCount: number) {
        var grabText = '', missCount = reqCount, done = false;
        $(elem).contents().each((i, subElem) => {
            switch (subElem.nodeType) {
                case Node.TEXT_NODE:

                    if (subElem.nodeValue.indexOf('.') > -1) {
                        var sentences = subElem.nodeValue.split('.');
                        for (var sentence of sentences) {
                            var text = sentence + (sentences.indexOf(sentence) < sentences.length - 1 ? '.' : '');
                            grabText += text;
                            missCount -= text.length;
                            if (missCount <= 0) {
                                done = true;
                                break;
                            }
                        }
                    } else {
                        grabText += subElem.nodeValue;
                        missCount -= subElem.nodeValue.length;
                    }
                    break;
                case Node.ELEMENT_NODE:
                    var childPart = this.truncateHtmlInner(<HTMLElement>subElem, missCount);
                    grabText += childPart.html;
                    missCount -= childPart.count;
                    done = childPart.done;
                    break;
            }
            if (done)
                return false;
        });
        return {
            html: elem.outerHTML.match(/^<[^>]+>/m)[0] + (grabText.length > 0 ? grabText + '</' + elem.localName + '>' : ''),
            count: reqCount - missCount,
            done: done
        };
    }

    public static get touchDevice(): boolean {
        return 'ontouchstart' in window || !!navigator.maxTouchPoints;
    }

    public static get tagsLoaded(): boolean {
        return !(!App.haTags || !App.haTags.tagsLoaded)
    }

    public static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    public static getStyleVar(prop: string): string { //TODO: cache?
        return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }

    public static md5(str: string): string {
        var MD5_inner = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ };
        return MD5_inner(unescape(encodeURIComponent(str)));
    }

    public static formData(data: { [key: string]: any }): FormData {
        var formData = new FormData();
        for (var prop in data)
            formData.append(prop, data[prop]?.toString())
        return formData;
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