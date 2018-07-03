@component("ha-tags")
class HaTags extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true/*, value: Array<HaTag>(20)*/ })
    public tagTops: Array<HaTag>;

    @property({ type: Object, notify: true }) //Not used yet
    public passedTag: HaTag;

    //@property({ type: Boolean })
    //public beingIndexed: boolean;

    
    public static loadedCallbacks: Array<() => void> = [];

    //TEMP(?)
    public static tagsWithMarkers: Array<HaTag> = new Array<HaTag>(10000);
    private static _crossHairMarker: string;
    //public static tagUGC: HaTag; //only needed because UGC cant add subjects yet........................................................................
    //public static tagUserLayer: HaTag; //TODO: create as seperate map layer instead....................................................................
    //public static tagTop: Array<HaTag> = new Array<HaTag>(20);

    public byId: Array<HaTag>; //Needed because polymer dosnt suppert asigning to array, ie. tags[id] = tag

    private parentIDs: Array<Array<number>>;
    private childIDs: Array<Array<number>>;
    private tagIdsInStorage: Array<number>;
    private RLEregex: RegExp = /(.)\1{3,9}/g;

    private static _blankMarker: HTMLImageElement;
    private static _numberMarkers: Array<string> = [];
    private static _viaPointMarkers: Array<string> = [];
        
    ready() {
        HaTags._blankMarker = document.createElement("img");
        HaTags._blankMarker.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAFbklEQVRYw82YfUzVZRTHv+c8v3tBXvRegQlXE8UBOlkp+Iav+cKcyJxZrXyZKGo4m3O1WjVRyv6o1h9t5NaLpZGZW6Vzy0pD1EQF+sOcoolWKgjmgosgiHh/z3P6I/AlU3m9t++/z9n5ffZ9fs/ZOYfQQYlIEoBpAMb6jCSRyEAQqdZDLUQXHUynAJQCKCSiUx3JT+2ECAaQaRtZbTENF0BOVnnN8coade5KA3zaAAAcihHfrzdGDozSSR43E0C2kTKL6X0A+UTU0mUgEXlSG9momKL3l1eb/KNn+dsTF1F3/cG5+4YGYc5jsViSmmimJMSwNnJZMa0iol2dAhKRPsbgI2Y8U1herV/6ulgdr6xFZ5QSG4l3nxqnpyZ4lDHYzoyVRNTQbiARGezTZt9N28RmbzuktpX+hu7Q4nEJ+GDhRO2w+LyDOY2ILjwUSETitJGjVxqaI6a/t9s68+dVdKeGe9zY98JsOyqsV61iSiWi8/cFEhG3T5tfahtvDBj79i5V4W1ET2hQRDhKX5urI0KDLyqmZCKqbzvjOwNtLZ/5tHlkZt73PQYDABdqr2FW3g/Kp80gW8vmO8/4DncWWYrmrNh6iE9c8qKndayiBiu3FbGlaJ6IzL/rykQkxNamcu/pS+6MjXsIftTeNekybain1mIeSETNbQ4tU0x9X935s19hAOCVnaWkiCIBZN26Mp8xq388XSVl1V5/8+B4ZS0Kz1SLz5jVAMAiMsrBHP/J4TN+d6dNm4+Uk4M5UURGMIBZtjGy51RloHiw++RF2NoIgHQWkTEnLnmlscUXMKBrN3woq64TAKPZZ2T4ySovI8Aqq/byTW2SWBFFVV1tCjQPqq42gYF+zISQphY74EDXbvigFPdiI7geFuQIOFBYkAPGSDNrkbqIsKCAA0WGBUOLeJlBlYMjwiXQQHGR4aKYKthSVDQxPsZYHLiH5lCM8UOijSI6zABKejmUSh4YGTCgUbFRCHYoBaCEAezVRuqXTxwaMKAVk4ZCG6kHUMBE1KyYti4YM0T3Dnb6HcYV4sSzo4doxZR/Z/uxsZfTwtr0kX4HyklPRrDDEgAbb7UfRFTORHkvpj1qEvu5/AYzNNqFNdOTDAF5RHTu3z31GxCp/WZlmg4NsvxSCHesTNMEqgGw4Z6emojqLcXzhnvcsiXzcVHcc+2RYsLnWVPNsBi3UUzz7jt1ENFhAp5/OiUO25dPF6fV/bXJaTG+em6GPDFiEBGwioiOtGdyzTQin/507jIt2XKQu2skio0IQ/7SqXpyfIwQkEVEWzsy28/QRr5ssbX75R0l1qaiM7e2HJ2pxNmTh+GdeWN1kKVqFdMCIirs8PZDRKIE+JiAuRXeRv3md8dUfvHZdoM5FCMzNQG5GSn2AHeoJSI7iSibiGq6uh8ar0VeV0Rp2V8U4eOiX9sFlD15GD5cOAlapEAR5RJRcbcsrG6N2sYUXKlvnhq3drtqsfUDY4MshQtvzbf7hYfsZ6aZ7f1Gh56RIlrvcYWorAmJD41dNjER0b1DLCLkduQbHQIiomItUpiTnqyDLPVAd3LSk20RFBBRSY8Btbq0zuMKUUvGJ9w3Zun4RMT06bg7nQJqdWn/utnJ+r8Kp9NirM9ItgXY156fuMtAbS71d4WqzNR7XVqS2uoOsL4zuTsFRERHtciB3IyUu1xyWozcjBRb/tlPF/sNqNWlnP6uULV43G2XMlMT4HF13p0uyzbmQKW30Xau2iTOVZukqq7JZ0QKu5KzS42PIsoZ4A49vGhsPAgEjyvEArAuoPOUbcyR3/9q8P1R03DTGCkK+MQpIlPktibg/yCfbQ7Zxhzsjlzd0jxbijYA6JZx/G+qy0TEoXIVyQAAAABJRU5ErkJggg==';

        this.tags = [];
        this.byId = [];
        this.parentIDs = [];
        this.childIDs = [];
        this.tagIdsInStorage = JSON.parse(LocalStorage.get('tag-ids'));
        if (!this.tagIdsInStorage)
            this.tagIdsInStorage = [];                                                    

        this.$.ajax.url = Common.api + 'tag.json?count=all&schema=' + Common.apiSchemaTags + (this.tagIdsInStorage.length > 0 ? '&lastmodified={min:' + LocalStorage.timestampDateTime('tag-ids') + '}' : '');
        //HaTags.createCrossHairMarker();
    }

    public get tagsLoaded(): boolean {
        if (!this.tags)
            return false;

        return this.tags.length > 0;
    }

    public handleResponse() {

        //TODO: also handle deleted tags.................................................


        for (var data of this.$.ajax.lastResponse) {
            this.getTagFromData(data)
            LocalStorage.set('tag-' + data.tagid, JSON.stringify(data));
            this.tagIdsInStorage.push(data.tagid);
        }

        for (var tagID of this.tagIdsInStorage) {
            if (this.byId[tagID])
                continue;

            this.getTagFromData(JSON.parse(LocalStorage.get('tag-' + tagID)));
        }
        LocalStorage.set('tag-ids', JSON.stringify(this.tagIdsInStorage), true);

        //HaTags.tagTop[9] = new HaTag({ id: 1000000 + 9, category: 9, plurname: '' });
        //HaTags.tagTop[9].selected = true;

        var tagTops = [];

        this.tags.forEach((tag: HaTag) => {
            tag.translateRelations(this.parentIDs[tag.id], this.childIDs[tag.id])
            if (tag.isTop) {
                var topTag = tagTops[tag.category];
                if (!topTag) {
                    tagTops[tag.category] = new HaTag({ id: 1000000 + tag.category, category: tag.category, plurname: '' });
                    topTag = tagTops[tag.category];
                    if (tag.category == 9)
                        topTag.selected = true;
                }
                topTag.children.push(tag);
            }
        });
        this.set('tagTops', tagTops)
        this.parentIDs = null;
        this.childIDs = null;

        
        

        //this.push('tags', HaTags.tagUGC = new HaTag({ tagid: 10000, category: 6, plurname: 'Vis altid' }));
        //HaTags.tagUGC.selected = true;
        //this.byId[HaTags.tagUGC.id] = HaTags.tagUGC;

        //this.push('tags', HaTags.tagUserLayer = new HaTag({ tagid: 10001, category: 6, plurname: 'Brugerlag' }));
        //HaTags.tagUserLayer.selected = true;
        //this.byId[HaTags.tagUserLayer.id] = HaTags.tagUserLayer;

        if (App.passed.tag)
            this.passedTag = this.byId[App.passed.tag.id];

        this.loadMarkers();
    }

    private getTagFromData(data: any) {
        var tag: HaTag;
        this.push('tags', tag = new HaTag(data)); //TODO: should update all at once?
        this.byId[tag.id] = tag;
        if (data.parents.length > 0) {
            this.parentIDs[tag.id] = [];
            data.parents.forEach((parentID: number) => {
                this.parentIDs[tag.id].push(parentID);
                if (!this.childIDs[parentID])
                    this.childIDs[parentID] = [];
                this.childIDs[parentID].push(tag.id);
            });
        }
    }

    public setSelectedByCategory(tagCategory: number, value: boolean) {
        IconLayer.updateDisabled = true;
        this.set('tagTops.' + tagCategory + '.selected', value);
        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }
   
    //@observe("tags.*") //needed? performance impact?
    //tagsChanged(changeRecord: any) { //TODO: really? any?
    //    var props: Array<string> = (<string>changeRecord.path).split('.');
    //    var property: string = props.pop();
    //    if (props.length == 0) //array it self was changed
    //        return;
    //    if (props.length == 1) //splice or property of array changed
    //    {
    //        if (property == 'splices') { //TODO: Check for deleted keys?
    //            //var tag: HaTag = this.tags[changeRecord.value.indexSplices[0].addedKeys[0].substring(1)]
    //            var tag: HaTag = this.tags[changeRecord.value.indexSplices[0].index];
    //            this.byId[tag.id] = tag;
    //        }
    //        return;
    //    }

    //    ////var tag: HaTag = props.reduce((obj, i) => obj[i], <any>this)
    //    //var tag: HaTag = this.tags[props[1].substring(1)];
    //    //if (property == 'selected')
    //    //    tag.selectedChanged(changeRecord.value);
    //}

    private loadMarkers() {
        var markerSize: number = 24;
        var markers = document.createElement("img");
        var canvasTemp = document.createElement('canvas');
        canvasTemp.width = markerSize;
        canvasTemp.height = markerSize;
        var contextTemp = canvasTemp.getContext("2d");

        var blankImageData = contextTemp.getImageData(0, 0, 1, 1);
        //var blankImageData = new ImageData(1, 1); Not (yet) supported in IE

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 48;
        var delta: number = Math.floor((canvas.width - markerSize) / 2);
        var context = canvas.getContext("2d");
        var x: number = 0;
        var y: number = 0;
        //HaTags._blankMarker = document.createElement("img");
        //$(HaTags._blankMarker).on('load', () => {
            $(markers).on('load', () => {
                while (true) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
                    contextTemp.drawImage(markers, -x * markerSize, -y * markerSize);
                    var tagID = contextTemp.getImageData(0, 0, 1, 1).data[3] + contextTemp.getImageData(markerSize - 1, 0, 1, 1).data[3] * 256;
                    if (tagID == 0 && x > 0 && y > 0)
                        break;
                    contextTemp.putImageData(blankImageData, 0, 0);
                    contextTemp.putImageData(blankImageData, markerSize - 1, 0);

                    context.drawImage(HaTags._blankMarker, 0, 0);
                    context.drawImage(canvasTemp, delta, delta);

                    if (tagID) {
                        this.byId[tagID].marker = canvas.toDataURL();
                        this.invertColors(canvas, context);
                        this.byId[tagID].invertedMarker = canvas.toDataURL();
                        HaTags.tagsWithMarkers.push(this.byId[tagID]);
                    } else {
                        Icon.defaultMarker = canvas.toDataURL();
                        this.invertColors(canvas, context);
                        Icon.invertedDefaultMarker = canvas.toDataURL();
                    }

                    x++;
                    if (x * markerSize < markers.width)
                        continue;
                    x = 0;
                    y++;
                    if (y * markerSize < markers.height)
                        continue;

                    break;
                }
                //(<HaGeos>document.querySelector('ha-geos')).tagsLoaded(); //TODO: best place?

                for (var callback of HaTags.loadedCallbacks)
                    callback();
            });
            markers.src = 'images/markers/all.png';
        //});
        //HaTags._blankMarker.src = 'images/markers/marker.png';
    }

    private invertColors(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i];
            imageData.data[i + 1] = 357 - imageData.data[i + 1]; //255 + 102
            imageData.data[i + 2] = 408 - imageData.data[i + 2]; //255 + 153
        }
        context.putImageData(imageData, 0, 0);
    }

    public static numberMarker(number: number): string {
        var marker: string = this._numberMarkers[number];
        if (marker)
            return marker;

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 48;
        var context = canvas.getContext("2d");
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 18px Arial' //Roboto

        context.drawImage(HaTags._blankMarker, 0, 0);
        this.redColors(canvas, context);

        var text = number.toString();
        context.fillText(text, (canvas.width - context.measureText(text).width) / 2.0, 24)

        marker = canvas.toDataURL()
        this._numberMarkers[number] = marker;

        return marker;
    }

    public static viaPointMarker(number: number): string {
        var marker: string = this._viaPointMarkers[number];
        if (marker)
            return marker;

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 36;
        var context = canvas.getContext("2d");
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 14px Roboto'
        context.strokeStyle = '#990000';
        context.lineWidth = 4;

        context.arc(18, 18, 10, 0, Math.PI * 2);
        context.stroke();
        context.fill();

        if (number > -1) {
            context.fillStyle = '#990000';
            var text: string;
            switch (number) {
                case 26: text = String.fromCharCode(198); break;
                case 27: text = String.fromCharCode(216); break;
                case 28: text = String.fromCharCode(197); break;
                default: text = String.fromCharCode(65 + number); break;
            }
            context.fillText(text, (canvas.width - context.measureText(text).width) / 2.0, 23)
        }
        var marker = canvas.toDataURL()
        this._viaPointMarkers[number] = marker;

        return marker;
    }

    public static get crossHairMarker(): string {
        if (!this._crossHairMarker) {
            var canvas = document.createElement('canvas');
            canvas.width = 30;
            canvas.height = 30;
            var context = canvas.getContext("2d");
            context.fillStyle = '#990000';
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 4;
            context.save();
            context.arc(15, 15, 12.5, 0, Math.PI * 2);
            context.stroke();
            context.fill();
            context.beginPath();
            context.lineWidth = 9;
            context.arc(15, 15, 6, 0, Math.PI * 2);
            context.stroke();
            context.fill();
            this._crossHairMarker = canvas.toDataURL()
        }

        return this._crossHairMarker;
    }
    //private static createCrossHairMarker() {
    //    var canvas = document.createElement('canvas');
    //    canvas.width = 100;
    //    canvas.height = 100;
    //    var context = canvas.getContext("2d");

    //    var svg = new Blob(['<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g><path fill="#990000" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></g></svg>'], { type: "image/svg+xml;charset=utf-8" }),
    //        domURL = self.URL || (<any>self).webkitURL || self,
    //        url = domURL.createObjectURL(svg),
    //        img = new Image;

    //    img.onload = () => {
    //        context.fillStyle = 'rgba(255,255,255,0.5)';
    //        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, Math.PI * 2);
    //        context.fill();
    //        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    //        domURL.revokeObjectURL(url);
    //        this._crossHairMarker = canvas.toDataURL();
    //    };

    //    img.src = url;
    //}

    private static redColors(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            var hsl = this.rgbToHsl(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])
            var rgb = this.hslToRgb(0, hsl.s, hsl.l)
            imageData.data[i] = rgb.r;
            imageData.data[i + 1] = rgb.g;
            imageData.data[i + 2] = rgb.b;
        }
        context.putImageData(imageData, 0, 0);
    }
    
    private static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return ({ h: h, s: s, l: l });
    }

    private static hslToRgb(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return ({
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        });
    }

    public getSelectionState(): string {

        var bytes = new Uint8Array(Math.floor((this.tags.length + 7) / 8));
        for (var i = 0; i < this.tags.length; i++)
            if (this.tags[i].selected)
                bytes[Math.floor(i / 8)] |= 1 << (i % 8); //(7 - i % 8)

        var binstr = Array.prototype.map.call(bytes, function (ch) {
            return String.fromCharCode(ch);
        }).join('');

        var b64 = btoa(binstr);



        return b64.replace(this.RLEregex, (substring: string) => '-' + substring[0] + substring.length); //TODO: RLE using other than number 3 to 10..... maybe upper case or base64 char set!...................

        //TODO: how many times is this called? should be only once per change (also on multiple children changing)
    }

    //public includeInSitemap(tag: HaTag): boolean {
    //    return this.passedTag ? tag.isChildOf(this.passedTag) : (tag.isTop && tag.category == 9); //only subjects for now
    //}

}

HaTags.register();