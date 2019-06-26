@component("ha-tags")
class HaTags extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true/*, value: Array<HaTag>(20)*/ })
    public tagTops: Array<HaTag>;

    @property({ type: Object, notify: true }) //Not used yet
    public passedTag: HaTag;

    @property({ type: Array, notify: true, value: [] })
    public selectedTagNames: Array<string>;

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
    private RLEregex: RegExp = /(.)\1{3,60}/g;

    private static _blankMarker: HTMLImageElement;
    //public static _blankImageMarker: HTMLImageElement;
    private static _numberMarkers: Array<string> = [];
    private static _viaPointMarkers: Array<string> = [];
        
    ready() {
        HaTags._blankMarker = document.createElement("img");
        HaTags._blankMarker.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAFbklEQVRYw82YfUzVZRTHv+c8v3tBXvRegQlXE8UBOlkp+Iav+cKcyJxZrXyZKGo4m3O1WjVRyv6o1h9t5NaLpZGZW6Vzy0pD1EQF+sOcoolWKgjmgosgiHh/z3P6I/AlU3m9t++/z9n5ffZ9fs/ZOYfQQYlIEoBpAMb6jCSRyEAQqdZDLUQXHUynAJQCKCSiUx3JT+2ECAaQaRtZbTENF0BOVnnN8coade5KA3zaAAAcihHfrzdGDozSSR43E0C2kTKL6X0A+UTU0mUgEXlSG9momKL3l1eb/KNn+dsTF1F3/cG5+4YGYc5jsViSmmimJMSwNnJZMa0iol2dAhKRPsbgI2Y8U1herV/6ulgdr6xFZ5QSG4l3nxqnpyZ4lDHYzoyVRNTQbiARGezTZt9N28RmbzuktpX+hu7Q4nEJ+GDhRO2w+LyDOY2ILjwUSETitJGjVxqaI6a/t9s68+dVdKeGe9zY98JsOyqsV61iSiWi8/cFEhG3T5tfahtvDBj79i5V4W1ET2hQRDhKX5urI0KDLyqmZCKqbzvjOwNtLZ/5tHlkZt73PQYDABdqr2FW3g/Kp80gW8vmO8/4DncWWYrmrNh6iE9c8qKndayiBiu3FbGlaJ6IzL/rykQkxNamcu/pS+6MjXsIftTeNekybain1mIeSETNbQ4tU0x9X935s19hAOCVnaWkiCIBZN26Mp8xq388XSVl1V5/8+B4ZS0Kz1SLz5jVAMAiMsrBHP/J4TN+d6dNm4+Uk4M5UURGMIBZtjGy51RloHiw++RF2NoIgHQWkTEnLnmlscUXMKBrN3woq64TAKPZZ2T4ySovI8Aqq/byTW2SWBFFVV1tCjQPqq42gYF+zISQphY74EDXbvigFPdiI7geFuQIOFBYkAPGSDNrkbqIsKCAA0WGBUOLeJlBlYMjwiXQQHGR4aKYKthSVDQxPsZYHLiH5lCM8UOijSI6zABKejmUSh4YGTCgUbFRCHYoBaCEAezVRuqXTxwaMKAVk4ZCG6kHUMBE1KyYti4YM0T3Dnb6HcYV4sSzo4doxZR/Z/uxsZfTwtr0kX4HyklPRrDDEgAbb7UfRFTORHkvpj1qEvu5/AYzNNqFNdOTDAF5RHTu3z31GxCp/WZlmg4NsvxSCHesTNMEqgGw4Z6emojqLcXzhnvcsiXzcVHcc+2RYsLnWVPNsBi3UUzz7jt1ENFhAp5/OiUO25dPF6fV/bXJaTG+em6GPDFiEBGwioiOtGdyzTQin/507jIt2XKQu2skio0IQ/7SqXpyfIwQkEVEWzsy28/QRr5ssbX75R0l1qaiM7e2HJ2pxNmTh+GdeWN1kKVqFdMCIirs8PZDRKIE+JiAuRXeRv3md8dUfvHZdoM5FCMzNQG5GSn2AHeoJSI7iSibiGq6uh8ar0VeV0Rp2V8U4eOiX9sFlD15GD5cOAlapEAR5RJRcbcsrG6N2sYUXKlvnhq3drtqsfUDY4MshQtvzbf7hYfsZ6aZ7f1Gh56RIlrvcYWorAmJD41dNjER0b1DLCLkduQbHQIiomItUpiTnqyDLPVAd3LSk20RFBBRSY8Btbq0zuMKUUvGJ9w3Zun4RMT06bg7nQJqdWn/utnJ+r8Kp9NirM9ItgXY156fuMtAbS71d4WqzNR7XVqS2uoOsL4zuTsFRERHtciB3IyUu1xyWozcjBRb/tlPF/sNqNWlnP6uULV43G2XMlMT4HF13p0uyzbmQKW30Xau2iTOVZukqq7JZ0QKu5KzS42PIsoZ4A49vGhsPAgEjyvEArAuoPOUbcyR3/9q8P1R03DTGCkK+MQpIlPktibg/yCfbQ7Zxhzsjlzd0jxbijYA6JZx/G+qy0TEoXIVyQAAAABJRU5ErkJggg==';

        //HaTags._blankImageMarker = document.createElement("img");
        //HaTags._blankImageMarker.src = 'data:image/png;base64,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'

        Icon.imageOnlyMarker = 'data:image/png;base64,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';
        
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


        var selections = this.getSelectionArray(UrlState.stateObject.t);

        for (var data of this.$.ajax.lastResponse) {
            data.selected = selections ? selections[data.tagid] : data.category == 9;
            this.getTagFromData(data)
            LocalStorage.set('tag-' + data.tagid, JSON.stringify(data));
            this.tagIdsInStorage.push(data.tagid);
        }

        for (var tagID of this.tagIdsInStorage) {
            if (this.byId[tagID])
                continue;

            var data = JSON.parse(LocalStorage.get('tag-' + tagID));
            data.selected = selections ? selections[data.tagid] : data.category == 9;
            this.getTagFromData(data);
        }
        LocalStorage.set('tag-ids', JSON.stringify(this.tagIdsInStorage), true);
        //HaTags.tagTop[9] = new HaTag({ id: 1000000 + 9, category: 9, plurname: '' });
        //HaTags.tagTop[9].selected = true;

        var tagTops: Array<HaTag> = [];

        this.tags.forEach((tag: HaTag) => {
            tag.translateRelations(this.parentIDs[tag.id], this.childIDs[tag.id])
            if (tag.isTop) {
                var topTag = tagTops[tag.category];
                if (!topTag) {
                    tagTops[tag.category] = new HaTag({ id: 1000000 + tag.category, category: tag.category, plurname: '' });
                    topTag = tagTops[tag.category];
                    //if (tag.category == 9 && !selections)
                    //    topTag.selected = true;
                }
                topTag.children.push(tag);
            }
        });

        for (var tagTop of tagTops)
            (<any>tagTop)._selected = selections ? tagTop.allChildrenSelected : tagTop.category == 9;

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

        this.updateSelectedTagNames(9);
        this.updateSelectedTagNames(10);
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
            var hue2rgb = function(p, q, t) {
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
        var bytes = new Uint8Array(Math.floor((this.byId.length + 7) / 8));
        for (var i = 0; i < this.byId.length; i++) {
            if (this.byId[i])
                if (this.byId[i].selected) //{
                    bytes[Math.floor(i / 8)] |= 1 << (i % 8); //(7 - i % 8)
        }

        var binstr = Array.prototype.map.call(bytes, function (ch) {
            return String.fromCharCode(ch);
        }).join('');

        var b64 = btoa(binstr).replace(/=/g, '');
        var rle = b64.replace(this.RLEregex, (substring: string) => '-' + substring[0] + Common.base64chars.charAt(substring.length));
        return rle.replace(/\//g, '_').replace(/\+/g, '--');
    }

    private getSelectionArray(state: string): Array<boolean> {
        if (!state)
            return null;

        var decodedRLE = state.replace(/_/g, '/').replace(/--/g, '+');
        var decodedB64 = decodedRLE.replace(/-(..)/g, (substring: string) => Array(Common.base64chars.indexOf(substring[2]) + 1).join(substring[1]));
        var decodedBINSTR = atob(decodedB64);
        var decodedBYTES = new Uint8Array(decodedBINSTR.length);
        var result: Array<boolean> = [];
        for (var i = 0; i < decodedBINSTR.length; i++) {
            var byte = decodedBINSTR.charCodeAt(i);
            for (var b = 0; b < 8; b++)
                result[i * 8 + b] = !!(byte >> b & 1);
        }
        return result;
    }

    //public includeInSitemap(tag: HaTag): boolean {
    //    return this.passedTag ? tag.isChildOf(this.passedTag) : (tag.isTop && tag.category == 9); //only subjects for now
    //}

    public updateSelectedTagNames(category: number) {

        if (this.tagTops[category].selected) {
            this.set(['selectedTagNames', category], "Alle" + category); //HACK... observes didn't fire when set to the same value as other in the array....
            this.set(['selectedTagNames', category], "Alle");
            return;
        }

        var selectedTags: Array<string> = [];
        //var selectedTagTopChildren: Array<string> = [];
        for (var tag of this.tags)
            if (tag.category == category && tag.selected)
                if (!tag.parentSelected) {
                    selectedTags.push(tag.plurName);
                    //if (tag.isTop)
                    //    selectedTagTopChildren.push(tag.plurName);
                }

        //if (selectedTagTopChildren.length == selectedTags.length) {
        //    selectedTags = "Alle pånær ";
        //}

        if (selectedTags.length == 0) {
            this.set(['selectedTagNames', category], '' + category); //HACK... observes didn't fire when set to the same value as other in the array....
            this.set(['selectedTagNames', category], '');
            return;
        }

        if (selectedTags.length == 1) {
            this.set(['selectedTagNames', category], selectedTags[0]);
            return;
        }

        selectedTags.sort();

        if (selectedTags.length > 3) {
            this.set(['selectedTagNames', category], selectedTags.slice(0, 3).join(", ") + "...");
            return;
        }

        this.set(['selectedTagNames', category], selectedTags.slice(0, selectedTags.length - 1).join(", ") + ' og ' + selectedTags[selectedTags.length - 1]);
        return;
    }

    public toggleTop(category: number, value: boolean) {
        IconLayer.updateDisabled = true;
        //App.haTags.tags.forEach((tag: HaTag) => {
        //    if (tag.isTop)
        //        if (tag.category == this.tagCategory)
        //            tag.selected = selected;
        //});

        //HaTags.tagTop[this.tagCategory].selected = selected;

        if (this.tagTops[category].selected != value)
            this.set('tagTops.' + category + '.selected', value);
        else {
            this.set('tagTops.' + category + '.selected', !value);
            this.set('tagTops.' + category + '.selected', value);
        }


        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }

}

HaTags.register();