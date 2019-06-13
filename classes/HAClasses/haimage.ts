class HAImage {
    private _id: number;
    private _year: number;
    private _text: string;
    private _photographer: string;
    private _licensee: string;
    public tags: Array<HaTag>;

    private _ordering: number; //from geo_image
    //"yearisapprox": false,
    //"created": "2009-02-13 01:11:47.533",
    //"deleted": "",
    //"userid": 5

    constructor(data: any, ordering: number) {
        this._id = data.imageid;
        this._year = data.year;
        this._text = data.text == null ? '' : data.text;
        this._photographer = data.photographer == null ? '' : data.photographer;
        this._licensee = data.licensee == null ? '' : data.licensee;
        this._ordering = ordering;

        this.tags = [];
        if (data.tag_images)
            for (var tag_image of data.tag_images)
                if (typeof tag_image === 'object')
                    this.tags.push(new HaTag(tag_image.tag))
                else
                    this.tags.push(App.haTags.byId[tag_image])
    }

    get id() {
        return this._id;
    }

    get year(): string {
        return this._year == null ? '' : this._year.toString();
    }
    set year(newVal: string) {
        this._year = newVal == '' ? null : parseInt(newVal);
    }

    get text() {
        return this._text;
    }
    set text(newVal: string) {
        this._text = newVal;
    }

    get photographer() {
        return this._photographer;
    }
    set photographer(newVal: string) {
        this._photographer = newVal;
    }

    get licensee() {
        return this._licensee;
    }
    set licensee(newVal: string) {
        this._licensee = newVal;
    }

    get url() {
        return Common.api + 'image/' + this._id;
    }

    get urlLowRes() {
        return Common.api + 'image/' + this._id + '?action=scale&size={640:10000}&scalemode=inner';
    }
    
    get ordering() {
        return this._ordering;
    }
    set ordering(newVal: number) {
        this._ordering = newVal;
    }
    //public get licens(): HaLicens {
    //    for (var tag of this.tags) //TODO: when real tags class is available, use that instead..
    //        if (tag.category == 4) //Licens
    //            return (<HaLicenses>document.querySelector('ha-licenses')).byTagID[tag.id];

    //    return null;
    //}
}
 