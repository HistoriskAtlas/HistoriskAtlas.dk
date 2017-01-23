class HaCollection {
    public _id: number;
    private _title: string;
    private _geos: Array<HaGeo>;
    //private maps: Array<HaGeo>;
    //....

    constructor(data: any) {
        this._geos = [];

        if (!data)
            return;

        this._id = data.collectionid;
        this._title = data.title;

        if (data.geoids)
            data.geoids.forEach(geoid => {
                this._geos.push(App.haGeos.geos[geoid]);
            });
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get geos(): Array<HaGeo> {
        return this._geos;
    }

    public save() {
        var data: any = {
            title: this._title,
        };
        if (this._id) { //TODO: not tested yet?
            data.collectionid = this._id;
            Services.update('collection', data, () => { })
        } else {
            data.userid = App.haUsers.user.id;
            Services.insert('collection', data, (result) => {
                this._id = result.data[0].collectionid;
            });
        }
    }

    public saveNewGeo(geo: HaGeo) {
        var data: any = {
            collectionid: this._id,
            geoid: geo.id,
            ordering: this.geos.indexOf(geo)
        };
        Services.insert('collection_geo', data, (result) => {
            
        });
    }
}
