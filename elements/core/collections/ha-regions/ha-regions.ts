@component("ha-regions")
class HaRegions extends polymer.Base implements polymer.Element {
    //@property({ type: Array, notify: true })
    public regions: Array<HaRegion> = [];
    public regionTypes: Array<HARegionType>;

    @property({ type: Object })
    private type: HARegionType & Object; 
    
    //ready() {
    //    this.$.ajax.url = Common.api + 'region.json';
    //}

    @observe("type")
    regionTypeChanged(regionType: HARegionType) {

        //TODO: Dont load this if touch only...

        if (!regionType)
            return;

        if (regionType.regionsLoaded)
            return;

        Analytics.regionTypeShow(regionType);

        regionType.regionsLoaded = true;

    //    this.set('params', {
    //        'v': 1,
    //        'schema': '{region:[regionid,name]}',
    //        'count': 'all',
    //        'regiontypeid': regionType.id
    //    });
    //    this.$.ajax.generateRequest();

        Services.HAAPI_GET('regions', { schema: 'minimal', regiontypeid: regionType.id }, (result) => {
            for (var data of result.data)
                this.regions[data.regionid] = new HaRegion(data)
        })
    }

//    public handleResponse() {
//        this.$.ajax.lastResponse.data.forEach(data => {
//            var region: HaRegion = new HaRegion(data)
//            this.regions[region.id] = region;
//        });
//    }
}

HaRegions.register();