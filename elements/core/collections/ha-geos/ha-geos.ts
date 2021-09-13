@component("ha-geos")
class HaGeos extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public geos: Array<HaGeo>;

    @property({ type: Object })
    public params: any;

    @property({ type: Number })
    public year: number;

    @property({ type: Number })
    public timeWarpYear: number;

    @property({ type: Boolean })
    public timeLineActive: boolean;

    @property({ type: Boolean })
    public userCreators: boolean;

    @property({ type: Boolean })
    public profCreators: boolean;

    @property({ type: Object })
    public theme: ITheme;

    //@property({ type: Boolean })
    //public beingIndexed: boolean;

    public firstGeoTour: DialogTour;

    private requests: Array<IGeoRequest>;
    private curRequest: IGeoRequest;
    private responses: Array<any>;
    private isLoading: boolean;
    //private lastGeoIdsLoaded: Array<number>;
    //private tagsIsLoaded: boolean;
    public static pageSize: number = 100000; //was 500
    //private curPage: number;
    public static usersGeoIDs: Array<number> = [];
    private static loadingText: string = 'Henter fortællinger';
    private static showingText: string = 'Viser fortællinger';

    ready() {
        this.geos = [];
        this.requests = [];
        this.responses = [];
        //this.lastGeoIdsLoaded = [];
        this.isLoading = false;
        //this.tagsIsLoaded = false;
        HaTags.loadedCallbacks.push(() => this.tagsLoaded());

        //this.$.ajax.url = Common.api + "geo.json";       
    }

    public tagsLoaded() {
        this.updateAllGeosFromAPI(false);
        if (LocalStorage.get("sessionID") && !Common.embed)
            Services.HAAPI_GET('login', { sid: LocalStorage.get("sessionID") }, (result) => {
                if (result)
                    App.haUsers.login(result.data)
            });

    //        Services.get('login', {}, (result) => {
    //            if (result.data.user.isvalid) {
    //                App.haUsers.login(result.data.user);
    //            //    if (result.data.user.role > 3)
    //            //        Services.get('hadb6stats.login', {}); //hadb5stats.login
    //            }
    //        });
    }

    public login() {
        this.processRequest({ themeTagID: this.theme.tagid, ugc: !App.haUsers.user.isPro, removeAlso: false, userLayer: true });
    }

    public logout() {
        HaGeos.usersGeoIDs = [];
        this.geos.forEach((geo) => {
            geo.userLayer = false;
        })
        this.updateAllGeosFromAPI(true);
    }

    @observe('theme')
    themeChanged(newVal: ITheme, oldVal: ITheme) {
        if (oldVal === undefined)
            return;
        this.updateAllGeosFromAPI(true);
    }

    @observe('userCreators')
    userCreatorsChanged(newVal: boolean, oldVal: boolean) {
        this.creatorTypeChanged(newVal, oldVal, true)
    }

    @observe('profCreators')
    profCreatorsChanged(newVal: boolean, oldVal: boolean) {
        this.creatorTypeChanged(newVal, oldVal, false)
    }

    private creatorTypeChanged(newVal: boolean, oldVal: boolean, ugc: boolean) {
        if (oldVal === undefined)
            return;
        if (newVal) {
            this.processRequest({ themeTagID: this.theme.tagid, ugc: ugc, removeAlso: false, userLayer: false });  //Was true!??!
            if (!App.haUsers.user.isDefault)
                this.processRequest({ themeTagID: this.theme.tagid, ugc: ugc, removeAlso: false, userLayer: true });
        }
        else
            this.removeByCreatorType(ugc)
    }

    private removeByCreatorType(ugc: boolean) {
        IconLayer.updateDisabled = true;
        var removeArray: Array<HaGeo> = [];
        this.geos.forEach((geo) => {
            if (geo.isUGC == ugc && !geo.userLayer)
                removeArray.push(geo);
        })

        for (var geo of removeArray)
            this.removeGeo(geo);

        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }

    private updateAllGeosFromAPI(removeAlso: boolean) {
        var themeTagID = this.theme ? this.theme.tagid : App.passed.theme.tagid;
        if (this.profCreators)
            this.processRequest({ themeTagID: themeTagID, ugc: false, removeAlso: removeAlso, userLayer: false });
        if (this.userCreators)
            this.processRequest({ themeTagID: themeTagID, ugc: true, removeAlso: removeAlso, userLayer: false });

        //if (!App.haUsers.user.isDefault) {
        //    this.processRequest({ themeTagID: themeTagID, ugc: false, removeAlso: removeAlso, userLayer: true });
        //    this.processRequest({ themeTagID: themeTagID, ugc: true, removeAlso: removeAlso, userLayer: true });
        //}

    }

    private processRequest(request: IGeoRequest) {

        if (this.isLoading) {
            this.requests.unshift(request)
            return;
        }
        this.isLoading = true;
        App.loading.show(HaGeos.loadingText)

        this.curRequest = request;

        if (!this.curRequest.removeAlso) {
            this.getGeos();
            return;
        }

        //var send: any = {
        //    count: '*',
        //    schema: JSON.stringify({
        //        geo: {
        //            fields: [{ collapse: "geoid" }],
        //            filters: [
        //                {
        //                    tag_geos: [{ tagid: this.curRequest.themeTagID }]
        //                }
        //            ]
        //        }
        //    })
        //}
        //if (App.haUsers.user.isDefault)
        //    send.online = true;

        var params: any = {};
        params.dest = this.curRequest.themeTagID;
        params.tags = this.curRequest.themeTagID; //This gives back list of id's
        //if (!App.haUsers.user.isDefault)
        //    params.sid = (<any>document).sid;

        //Services.get('geo', send, (result) => {
        Services.HAAPI_GET('geos', params, (result) => {
            IconLayer.updateDisabled = true;
            //var newGeoIds = <Array<number>>result.data[0].tag_geos;
            var newGeoIds = <Array<number>>result.data;
            var removeArray: Array<HaGeo> = [];

            this.geos.forEach((geo) => {
                if (newGeoIds.indexOf(geo.id) == -1 && !geo.userLayer)
                    removeArray.push(geo);
            })

            for (var geo of removeArray)
                this.removeGeo(geo);

            IconLayer.updateDisabled = false;
            //IconLayer.updateShown();
            this.getGeos();
        })
    }

    private getGeos() {
        //var selectedTagIds: Array<number> = [];
        //for (var tag of App.haTags.tags)
        //    if (tag.selected)
        //        selectedTagIds.push(tag.id);

        //var schema = {   //TODO: Dont fetch geos without tag id 530 (non ready) or convert 530's to "remove all themes"
        //    geo: {
        //        fields: [
        //            'id',
        //            'lat',
        //            'lng',
        //            'ptid'
        //        ],
        //        filters: (!this.curRequest.userLayer || App.haUsers.user.isAdmin) ? [] : [
        //            {
        //                user: [{ userhierarkis1: [{ parentid: App.haUsers.user.id /*is editor for owner*/ }] }]
        //            },
        //            {
        //                user: [{ id: App.haUsers.user.id /*is owner*/ }]
        //            }
        //        ]
        //    }
        //}

        //if (this.curRequest.userLayer)
        //    schema.geo.fields.push('online');

        //if (!App.haUsers.user.isAdmin)
        //    if (App.haUsers.user.institutions && this.curRequest.userLayer) //added  && this.curRequest.userLayer
        //        if (App.haUsers.user.institutions.length > 0)
        //            schema.geo.filters.push(
        //                <any>{
        //                    tag_geos: [
        //                        {
        //                            tag: [
        //                                {
        //                                    institutions: [
        //                                        {
        //                                            id: App.haUsers.user.institutions[0].id /*is same institution TODO: cur inst not only [0]*/
        //                                        }
        //                                    ]
        //                                }
        //                            ]
        //                        }
        //                    ]
        //                }
        //            )


        //this.params = {
        //    v: 1,
        //    count: '*',
        //    ugc: this.curRequest.ugc,
        //    tag_geos: JSON.stringify([
        //        { tagid: this.curRequest.themeTagID }
        //    ]),
        //    schema: JSON.stringify(schema)
        //}
                
        //if (this.curRequest.userLayer)
        //    this.params.sid = (<any>document).sid;
        //else
        //    this.params.online = true;

        ////v.2 hack
        //if (this.params.tag_geos == "[{\"tagid\":427}]" && this.params.schema == "{\"geo\":{\"fields\":[\"id\",\"lat\",\"lng\",\"ptid\"],\"filters\":[]}}" && this.params.online)
        //    this.params.v = 2;

        //this.$.ajax.generateRequest();

        var params: any = {};
        params.ugc = this.curRequest.ugc;
        params.dest = this.curRequest.themeTagID;
        //if (this.curRequest.userLayer)
        //    params.sid = (<any>document).sid;

        //if (!params.dest) {
        //    console.log('Missing dest')
        //}

        Services.HAAPI_GET('geos', params, (result) => this.addGeosFromResponse(result), null, null, this.curRequest.userLayer);
    }

    //public handleResponse() {
    //    var response: any = this.$.ajax.lastResponse;           
    //    this.addGeosFromResponse(response);
    //}

    private addGeosFromResponse(response: any) {
        var tempGeos: Array<HaGeo> = this.geos.slice();
        var ptidIndex = this.curRequest.userLayer ? 4 : 3;

        //this.lastGeoIdsLoaded = [];
        for (var dataArray of <any[][]>response.data) {
            if (this.geos[dataArray[0]]) { //id
                if (this.curRequest.userLayer)
                    this.geos[dataArray[0]].userLayer = true;
                continue;
            }

            //this.lastGeoIdsLoaded.push(data.id);

            var data: any = {
                id: dataArray[0],
                lat: dataArray[1],
                lng: dataArray[2],
            };

            if (dataArray.length - 1 == ptidIndex)
                data.ptid = dataArray[ptidIndex];
            
            data.ugc = this.curRequest.ugc;
            data.online = this.curRequest.userLayer ? dataArray[3] : true;

            var geo: HaGeo = new HaGeo(data, !this.curRequest.removeAlso || App.haTags.tagTops[9].selected ? true : this.curRequest.userLayer, this.curRequest.userLayer);
            //if (!geo.online)
            //    geo.addTag(HaTags.tagUserLayer);

            //if (geo.isUGC)
            //    geo.addTag(HaTags.tagUGC);

            tempGeos[geo.id] = geo;
            if (HaGeos.usersGeoIDs.length > 0) //TODO: still needed?
                if (HaGeos.usersGeoIDs.indexOf(geo.id) > -1)
                    geo.connectUser();
        }

        this.geos = tempGeos;
        App.loading.hide(HaGeos.loadingText);
        //if (!App.useClustering)
        //    IconLayer.updateMinDist();
        //IconLayer.updateShown();

        if (this.requests.length == 0)
            this.updateShownGeos(null, null, this.curRequest.themeTagID, this.userCreators, this.profCreators); //WAS true, true
        else
            this.updateShownGeosFinally(null);
    }

    public updateShownGeos(idsChanged: Array<number>, changedTo: boolean, themeTagID: number = null, userCreators: boolean = null, profCreators: boolean = null) {
        App.loading.show(HaGeos.showingText);

        //if (App.haUsers.user.isAdmin) {
        //    this.showAll(idsChanged);
        //    return;
        //}

        if ((this.curRequest.userLayer && !idsChanged) || (App.haTags.tagTops[9].selected && !idsChanged)) {
            this.updateShownGeosFinally(idsChanged);
            return;
        }

        if (!themeTagID)
            themeTagID = this.theme.tagid;

        if (userCreators === null)
            userCreators = this.userCreators;

        if (profCreators === null)
            profCreators = this.profCreators;

        var selectedTagIds: Array<number> = [];
        if (idsChanged && changedTo) {
            if (idsChanged.indexOf(App.haTags.tagTops[9].id) > -1) {
                App.haGeos.geos.forEach((geo) => {
                    if (!geo.shown)
                        geo.show();
                });
                this.updateShownGeosFinally(idsChanged);
                return;
            }

            selectedTagIds = idsChanged;
        } else
            for (var tag of App.haTags.tags) //TODO: created selectedTags array?
                if (tag.selected)
                    selectedTagIds.push(tag.id);

        if (selectedTagIds.length == 0) {
            this.hideAll(idsChanged);
            return;
        }

        //var send: any = {
        //    count: '*',
        //    ugc: userCreators == profCreators ? '' : userCreators,
        //    //sid: (<any>document).sid,
        //    tag_geos: JSON.stringify([
        //        { tagid: themeTagID }
        //    ]),
        //    schema: JSON.stringify({ geo: { fields: [{ "collapse": "id" }], filters: [{ tag_geos: [{ tagid: selectedTagIds }] }] } })
        //}

        //if (!userCreators && idsChanged && App.haUsers.user.isDefault)
        //    send.online = true;

        var params: any = {};
        if (userCreators != profCreators)
            params.ugc = userCreators;
        params.dest = themeTagID;
        params.tags = selectedTagIds.join(',');
        //if (!App.haUsers.user.isDefault)
        //    params.sid = (<any>document).sid;

        //if (!params.dest) {
        //    console.log('Missing dest')
        //}

        //Services.get('geo', send, (data) => {
        Services.HAAPI_GET('geos', params, (data) => {
            if (data.data.length == 0) {
                this.hideAll(idsChanged);
                return;
            }

            if (idsChanged && changedTo) {
                for (var geoid of data.data) {
                    var geo = App.haGeos.geos[geoid]
                    if (geo)
                        if (!geo.shown)
                            geo.show();
                }
            } else
                App.haGeos.geos.forEach((geo) => {
                    if (data.data.indexOf(geo.id) > -1) {
                        if (!geo.shown)
                            geo.show();
                    } else {
                        if (geo.shown)
                            geo.hide();
                    }
                })


            this.updateShownGeosFinally(idsChanged);

        }, (data) => {
            this.updateShownGeosFinally(null);
        })
    }

    private hideAll(idsChanged: Array<number>) {
        App.haGeos.geos.forEach((geo) => {
            if (geo.shown)
                geo.hide();
        });
        this.updateShownGeosFinally(idsChanged);
    }

    private showAll(idsChanged: Array<number>) {
        App.haGeos.geos.forEach((geo) => {
            if (!geo.shown)
                geo.show();
        });
        this.updateShownGeosFinally(idsChanged);
    }

    private updateShownGeosFinally(idsChanged: Array<number>) {
        IconLayer.updateShown();
        App.loading.hide(HaGeos.showingText);

        if (idsChanged)
            return;

        this.isLoading = false;

        if (this.requests.length > 0)
            this.processRequest(this.requests.pop())
    }


    public newGeo() {
        var size = App.map.getSize();
        var coord = Common.fromMapCoord(App.map.getCoordinateFromPixel([size[0] - 150, 150]));

        var geo = new HaGeo({ lat: coord[1], lng: coord[0], title: '', user: { id: App.haUsers.user.id }, online: false, ugc: !App.haUsers.user.isPro }, true, true);

        geo.addTag(App.haTags.byId[530]); // ready for v.5
        geo.addTag(App.haTags.byId[427]); // HA destination
        if (App.haUsers.user.isPro)
            geo.addTag(App.haTags.byId[App.haUsers.user.currentInstitution.tag.id]);

        geo.views = 0;
        geo.intro = '';
        geo.freeTags = '';
        geo.primaryTagStatic = false;
        geo.images = [];
        App.haUsers.user.geos.push(geo); //TODO: let HaUsers handle it, so change notification kicks in?
        //geo.user = App.haUsers.user;
        //this.push('geos', geo); //Moved to geo.save()
        IconLayer.updateShown();

        geo.save();
        
        if (App.haUsers.firstLogInTour) {
            App.haUsers.firstLogInTour.close();
            App.haUsers.firstLogInTour = null;
            LocalStorage.set('firstLogInTourDone', 'true')

            if (!LocalStorage.get('firstGeoTourDone')) {
                Common.dom.append(App.haGeos.firstGeoTour = <DialogTour>DialogTour.create('Flyt den på plads!', 'Træk fortællingen hen hvor den hører hjemme. Bekræft ved at trykke på det grønne flueben.', 0, null, 0, null, null, -15, 6, null, true, 'firstGeoTourDone'));
                (<any>this.firstGeoTour).geo = geo;
                this.updateFirstGeoTour();
            }
        }
    }

    public deleteGeo(geo: HaGeo) {
        geo.delete();
        this.removeGeo(geo);
    }

    private removeGeo(geo: HaGeo) {
        if (geo.shown) {
            geo.hide();
            IconLayer.updateShown();
        }
        
        for (var tag of geo.tags)
            tag.geos.splice(tag.geos.indexOf(geo), 1);

        //this.splice('geos', this.geos.indexOf(geo), 1); NO GO... messes the index = id up.
        //this.arrayDelete('geos', geo); //seems to splice also, so no go
        delete this.geos[this.geos.indexOf(geo)]; //TODO: need to notify polymer also?

        if (App.haUsers.user.geos)
            if (App.haUsers.user.geos.indexOf(geo) > -1)
                App.haUsers.user.geos.splice(App.haUsers.user.geos.indexOf(geo), 1); //TODO: let HaUsers handle it, so change notification kicks in?
    }

    public updateFirstGeoTour() {
        var pixel = App.map.getPixelFromCoordinate((<any>this.firstGeoTour).geo.coord)
        this.firstGeoTour.left = pixel[0] - 420;
        this.firstGeoTour.top = pixel[1] - 6;
    }

    @observe('year')
    yearChanged() {
        this.updateYears();
    }

    @observe('timeWarpYear')
    timeWarpYearChanged() {
        this.updateYears();
    }

    @observe('timeLineActive')
    timeLineActiveChanged() {
        this.updateYears(true);
    }

    public updateYears(forceUpdate: boolean = false): boolean {
        return false; //TODO: not used at the moment

        //if (!this.geos)
        //    return false;

        //if (!this.timeLineActive && !forceUpdate)
        //    return false;

        //var change = false;

        //this.geos.forEach((geo) => {
        //    if (geo.yearChanged())
        //        change = true;
        //});

        //if (change) {
        //    IconLayer.updateShown();
        //    return true;
        //} else
        //    return false;
    }

    //@observe('userCreators')
    //userCreatorsChanged() {
    //    if (!this.geos)
    //        return;

    //    //TODO: keep array of UGC's / profs instead?
    //    this.geos.forEach((geo) => { //Couldnt use for..of ... because of empty slots in "geos"
    //        geo.creatorTypesChanged();
    //    });
    //    IconLayer.updateShown();
    //}

    //@observe('profCreators')
    //profCreatorsChanged() {
    //    if (!this.geos)
    //        return;

    //    //TODO: keep array of UGC's / profs instead?
    //    this.geos.forEach((geo) => { //Couldnt use for..of ... because of empty slots in "geos"
    //        geo.creatorTypesChanged();
    //    });
    //    IconLayer.updateShown();
    //}
}

interface IGeoRequest {
    themeTagID: number;
    ugc: boolean;
    //selectedByTags: boolean
    removeAlso: boolean;
    userLayer: boolean;
}

HaGeos.register();