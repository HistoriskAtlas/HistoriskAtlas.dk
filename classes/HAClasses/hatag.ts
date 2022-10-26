class HaTag {
    public id: number;
    public category: number;
    public plurName: string;
    public singName: string;
    public yearEnd: number;
    public yearStart: number;
    //private parentIDs: Array<Object>

    private _selected: boolean;
    public marker: string;
    public invertedMarker: string;
    public showChildren: boolean;

    public geos: Array<HaGeo>;
    private _parents: Array<HaTag>;
    private _children: Array<HaTag>;
    public static categoryNames: Array<string> = ['Emne (v3)', 'Periode (v3)', 'Geografi (v3)', 'Institution', 'Licens', 'Intern', 'Søgning (v3)', 'Fane (v3)', 'Publiceringsdestination', 'Emne', 'Periode']

    constructor(data: any) {
        this.id = data.tagid;
        this.category = data.category;
        this.plurName = data.plurname;
        this.singName = data.singname == null ? data.plurname : data.singname;
        this.yearEnd = data.yearend;
        this.yearStart = data.yearstart;
        //this.parentIDs = data.taghierarkis1;
        //this._selected = data.category == 9;//false;
        this._selected = data.selected;//false;
        this.showChildren = false;

        this.geos = [];
        this._parents = [];
        this._children = [];
    }

    //public selectedChanged(value: boolean) {
    //    var iconsChanged = false;
    //    this.geos.forEach((geo: HaGeo, i: number, array: HaGeo[]) => {
    //        if (geo.tagSelectedChanged(value))
    //            iconsChanged = true;            
    //    });
    //    if (iconsChanged)
    //        IconLayer.update();
    //}

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(val: boolean) {
        if (this._selected == val)
            return;
        
        var idsChanged = this.justSetSelected(val);

        var tagTop = App.haTags.tagTops[this.category];
        if (!val) {
            if (tagTop.selected) {
                tagTop._selected = false;
                App.haTags.notifyPath('tagTops.' + this.category + '.selected', false)
            }
        } else {
            var allSelected = true;
            for (var tag of tagTop.children)
                if (!tag.selected) {
                    allSelected = false;
                    break;
                }
            if (allSelected) {
                tagTop._selected = true;
                App.haTags.notifyPath('tagTops.' + this.category + '.selected', true)
            }
        }


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
        if (this.category == 9 || this.category == 10)
            App.haTags.updateSelectedTagNames(); //this.category




        //for (var geo of this.geos)
        //    geo.tagSelectedChanged(val)


        //IconLayer.updateShown();
    }

    public justSetSelected(val: boolean) { //: Array<number> 
        var idsChanged: Array<number> = [this.id];
        this._selected = val;
        App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(this) + ".selected", this._selected);

        this.children.forEach((tag: HaTag) => {
            idsChanged = idsChanged.concat(tag.justSetSelected(val));
            App.haTags.notifyPath("tags." + App.haTags.tags.indexOf(this) + ".children." + this.children.indexOf(tag) + ".selected", this._selected);
        });

        UrlState.tagSelectedChanged(); //TODO: How many times is this called?

        return idsChanged;
    }

    public translateRelations(parentIDs: Array<number>, childIDs: Array<number>) {
        if (parentIDs) parentIDs.forEach((parentID: number) => this._parents.push(App.haTags.byId[parentID]))
        if (childIDs) childIDs.forEach((childID: number) => this._children.push(App.haTags.byId[childID]))
    }

    public get isTop(): boolean {
        return this._parents.length == 0;
    }

    public isChildOf(tag: HaTag): boolean {
        return tag.children.indexOf(this) > -1;
    }

    public get parents(): Array<HaTag> {
        return this._parents;
    }
    public get children(): Array<HaTag> {
        return this._children;
        //if (this._subTags)
        //    return this._subTags;

        //this._subTags = [];
        //this.taghierarkis.forEach((hierarki: any) => {
        //    this._subTags.push(App.haTags.byId[hierarki.tagid]);
        //});
        //return this._subTags;
    }

    public get allChildrenSelected(): boolean {
        for (var child of this._children)
            if (!child.selected)
                return false;
        return true;
    }

    public get parentSelected(): boolean {
        if (this.isTop)
            return App.haTags.tagTops[this.category].selected;

        for (var parent of this._parents)
            if (parent.selected)
                return true;
        return false;
    }

    get isSubject(): boolean {
        return this.category == 9;
    }

    get isInstitution(): boolean {
        return this.category == 3;
    }

    get isPublicationDestination(): boolean {
        return this.category == 8;
    }

    get hasChildren(): boolean {
        return this._children.length > 0;
    }

    get urlFrag(): string {
        return this.plurName.replace(' ', '_').toLowerCase();
    }
}