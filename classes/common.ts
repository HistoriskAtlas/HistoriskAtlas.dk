﻿class Common {

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
    private static _api: string;
    private static _baseApi: string;
    public static apiSchemaTags = '{tag:[tagid,plurname,singname,category,yearstart,yearend,{parents:[empty,{collapse:{parent:id}}]}]}'
    public static base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    public static openGeoWindowInNewTab: boolean;

    public static get isDevOrBeta(): boolean {
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

    public static get api(): string {
        if (!this._api)
            this._api = Common.baseApi + '/hadb6' + (this.isDevOrBeta ? 'beta' : '') + '.'; //'/hadb5'

        return this._api;
    }

    public static get baseApi(): string {
        if (!this._api) {
            this._baseApi = location.protocol + '//' + (this.isDevOrBeta ? ((location.protocol == 'https:' ? 'betasecure.' : 'beta.')) : (location.protocol == 'https:' ? 'secure' : '')) + 'api.historiskatlas.dk/api';
            //this._api = 'http://beta.api.historiskatlas.dk/hadb5.';
            //this._api = 'http://34.252.49.216/hadb5beta.'
        }

        return this._baseApi;
    }

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

        return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * R;
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
        (function (d) {
            var js; if (d.getElementById(id)) {
                if (callback)
                    callback(null);
                return;
            }
            js = d.createElement('script'); js.id = id; js.async = true;
            if (callback)
                js.onload = callback;
            js.src = src;
            d.getElementsByTagName('head')[0].appendChild(js);
        } (document));
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

    public static getStyleVar(prop: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
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