var HaTag = (function () {
    function HaTag(data) {
        this.id = data.tagid;
        this.category = data.category;
        this.plurName = data.plurname;
        this.singName = data.singname;
        this.yearEnd = data.yearend;
        this.yearStart = data.yearstart;
        //this.parentIDs = data.taghierarkis1;
        this._selected = data.category == 9; //false;
        this.showChildren = false;
        this.geos = [];
        this._parents = [];
        this._children = [];
    }
    Object.defineProperty(HaTag.prototype, "selected", {
        //public selectedChanged(value: boolean) {
        //    var iconsChanged = false;
        //    this.geos.forEach((geo: HaGeo, i: number, array: HaGeo[]) => {
        //        if (geo.tagSelectedChanged(value))
        //            iconsChanged = true;            
        //    });
        //    if (iconsChanged)
        //        IconLayer.update();
        //}
        get: function () {
            return this._selected;
        },
        set: function (val) {
            if (this._selected == val)
                return;
            if (!val)
                HaTags.tagTop[this.category]._selected = false; // TODO: notifyPath....
            var idsChanged = this.justSetSelected(val);
            //this._selected = val;
            //App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(this) + ".selected", this._selected);
            //TODO: check parents instead in "get selected()"?
            //if (this.children.length > 0)
            //    IconLayer.updateDisabled = true;
            //this.children.forEach((tag: HaTag) => {
            //    tag.justSetSelected(val);
            //    //tag.selected = this._selected;
            //    App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(this) + ".children." + this.children.indexOf(tag) + ".selected", this._selected);
            //});
            //if (this.children.length > 0)
            //    IconLayer.updateDisabled = false;
            //var iconsChanged = false;
            //this.geos.forEach((geo: HaGeo, i: number, array: HaGeo[]) => {
            //    if (geo.tagSelectedChanged(val))
            //        iconsChanged = true;
            //});
            //TODO: Should be part of the buffered loading system in HaGeos.......
            App.haGeos.updateShownGeos(idsChanged, val);
            //for (var geo of this.geos)
            //    geo.tagSelectedChanged(val)
            //IconLayer.updateShown();
        },
        enumerable: true,
        configurable: true
    });
    HaTag.prototype.justSetSelected = function (val) {
        var _this = this;
        var idsChanged = [this.id];
        this._selected = val;
        App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(this) + ".selected", this._selected);
        this.children.forEach(function (tag) {
            idsChanged = idsChanged.concat(tag.justSetSelected(val));
            App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(_this) + ".children." + _this.children.indexOf(tag) + ".selected", _this._selected);
        });
        return idsChanged;
    };
    HaTag.prototype.translateRelations = function (parentIDs, childIDs) {
        var _this = this;
        if (parentIDs)
            parentIDs.forEach(function (parentID) { return _this._parents.push(App.haTags.byId[parentID]); });
        if (childIDs)
            childIDs.forEach(function (childID) { return _this._children.push(App.haTags.byId[childID]); });
    };
    Object.defineProperty(HaTag.prototype, "isTop", {
        get: function () {
            return this._parents.length == 0;
        },
        enumerable: true,
        configurable: true
    });
    HaTag.prototype.isChildOf = function (tag) {
        return tag.children.indexOf(this) > -1;
    };
    Object.defineProperty(HaTag.prototype, "parents", {
        get: function () {
            return this._parents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaTag.prototype, "children", {
        get: function () {
            return this._children;
            //if (this._subTags)
            //    return this._subTags;
            //this._subTags = [];
            //this.taghierarkis.forEach((hierarki: any) => {
            //    this._subTags.push(App.haTags.byId[hierarki.tagid]);
            //});
            //return this._subTags;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaTag.prototype, "isSubject", {
        get: function () {
            return this.category == 9;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaTag.prototype, "isInstitution", {
        get: function () {
            return this.category == 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaTag.prototype, "hasChildren", {
        get: function () {
            return this._children.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaTag.prototype, "urlFrag", {
        get: function () {
            return this.plurName.replace(' ', '_').toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    HaTag.categoryNames = ['Emne (v3)', 'Periode (v3)', 'Geografi (v3)', 'Institution', 'Licens', 'Intern', 'Søgning (v3)', 'Fane (v3)', 'Publiceringsdestination', 'Emne', 'Periode'];
    return HaTag;
}());
//# sourceMappingURL=hatag.js.map