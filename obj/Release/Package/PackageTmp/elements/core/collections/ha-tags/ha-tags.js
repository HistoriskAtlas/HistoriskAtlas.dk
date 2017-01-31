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
var HaTags = (function (_super) {
    __extends(HaTags, _super);
    function HaTags() {
        _super.apply(this, arguments);
    }
    HaTags.prototype.ready = function () {
        this.tags = [];
        this.byId = [];
        this.parentIDs = [];
        this.childIDs = [];
        this.tagIdsInStorage = JSON.parse(LocalStorage.get('tag-ids'));
        if (!this.tagIdsInStorage)
            this.tagIdsInStorage = [];
        this.$.ajax.url = Common.api + 'tag.json?count=all&schema=' + Common.apiSchemaTags + (this.tagIdsInStorage.length > 0 ? '&lastmodified={min:' + LocalStorage.timestampDateTime('tag-ids') + '}' : '');
    };
    HaTags.prototype.handleResponse = function () {
        //TODO: also handle deleted tags.................................................
        var _this = this;
        for (var _i = 0, _a = this.$.ajax.lastResponse; _i < _a.length; _i++) {
            var data = _a[_i];
            this.getTagFromData(data);
            LocalStorage.set('tag-' + data.tagid, JSON.stringify(data));
            this.tagIdsInStorage.push(data.tagid);
        }
        for (var _b = 0, _c = this.tagIdsInStorage; _b < _c.length; _b++) {
            var tagID = _c[_b];
            if (this.byId[tagID])
                continue;
            this.getTagFromData(JSON.parse(LocalStorage.get('tag-' + tagID)));
        }
        LocalStorage.set('tag-ids', JSON.stringify(this.tagIdsInStorage), true);
        //HaTags.tagTop[9] = new HaTag({ id: 1000000 + 9, category: 9, plurname: '' });
        //HaTags.tagTop[9].selected = true;
        this.tags.forEach(function (tag) {
            tag.translateRelations(_this.parentIDs[tag.id], _this.childIDs[tag.id]);
            if (tag.isTop) {
                var topTag = HaTags.tagTop[tag.category];
                if (!topTag) {
                    HaTags.tagTop[tag.category] = new HaTag({ id: 1000000 + tag.category, category: tag.category, plurname: '' });
                    topTag = HaTags.tagTop[tag.category];
                    if (tag.category == 9)
                        topTag.selected = true;
                }
                topTag.children.push(tag);
            }
        });
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
    };
    HaTags.prototype.getTagFromData = function (data) {
        var _this = this;
        var tag;
        this.push('tags', tag = new HaTag(data)); //TODO: should update all at once?
        this.byId[tag.id] = tag;
        if (data.parents.length > 0) {
            this.parentIDs[tag.id] = [];
            data.parents.forEach(function (parentID) {
                _this.parentIDs[tag.id].push(parentID);
                if (!_this.childIDs[parentID])
                    _this.childIDs[parentID] = [];
                _this.childIDs[parentID].push(tag.id);
            });
        }
    };
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
    HaTags.prototype.loadMarkers = function () {
        var _this = this;
        var markerSize = 24;
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
        var delta = Math.floor((canvas.width - markerSize) / 2);
        var context = canvas.getContext("2d");
        var x = 0;
        var y = 0;
        var marker = document.createElement("img");
        $(marker).on('load', function () {
            $(markers).on('load', function () {
                while (true) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
                    contextTemp.drawImage(markers, -x * markerSize, -y * markerSize);
                    var tagID = contextTemp.getImageData(0, 0, 1, 1).data[3] + contextTemp.getImageData(markerSize - 1, 0, 1, 1).data[3] * 256;
                    if (tagID == 0 && x > 0 && y > 0)
                        break;
                    contextTemp.putImageData(blankImageData, 0, 0);
                    contextTemp.putImageData(blankImageData, markerSize - 1, 0);
                    context.drawImage(marker, 0, 0);
                    context.drawImage(canvasTemp, delta, delta);
                    if (tagID) {
                        _this.byId[tagID].marker = canvas.toDataURL();
                        _this.invertColors(canvas, context);
                        _this.byId[tagID].invertedMarker = canvas.toDataURL();
                        HaTags.tagsWithMarkers.push(_this.byId[tagID]);
                    }
                    else {
                        Icon.defaultMarker = canvas.toDataURL();
                        _this.invertColors(canvas, context);
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
                document.querySelector('ha-geos').tagsLoaded(); //TODO: best place?
            });
            markers.src = 'images/markers/all.png';
        });
        marker.src = 'images/markers/marker.png';
    };
    HaTags.prototype.invertColors = function (canvas, context) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i];
            imageData.data[i + 1] = 357 - imageData.data[i + 1]; //255 + 102
            imageData.data[i + 2] = 408 - imageData.data[i + 2]; //255 + 153
        }
        context.putImageData(imageData, 0, 0);
    };
    //@property({ type: Boolean })
    //public beingIndexed: boolean;
    //TEMP(?)
    HaTags.tagsWithMarkers = new Array(10000);
    //public static tagUGC: HaTag; //only needed because UGC cant add subjects yet........................................................................
    //public static tagUserLayer: HaTag; //TODO: create as seperate map layer instead....................................................................
    HaTags.tagTop = new Array(20);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaTags.prototype, "tags", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaTag)
    ], HaTags.prototype, "passedTag", void 0);
    HaTags = __decorate([
        component("ha-tags"), 
        __metadata('design:paramtypes', [])
    ], HaTags);
    return HaTags;
}(polymer.Base));
HaTags.register();
//# sourceMappingURL=ha-tags.js.map