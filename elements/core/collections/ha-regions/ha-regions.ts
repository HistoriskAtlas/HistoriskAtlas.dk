@component("ha-regions")
class HaRegions extends polymer.Base implements polymer.Element {
    //@property({ type: Array, notify: true })
    public regions: Array<HaRegion> = [];
    public regionTypes: Array<HARegionType>;

    @property({ type: Object })
    private type: HARegionType & Object; 
    
    ready() {
        this.$.ajax.url = Common.api + 'region.json';
    }

    @observe("type")
    regionTypeChanged(regionType: HARegionType) {

        //TODO: Dont load this if touch only...

        if (!regionType)
            return;

        if (regionType.regionsLoaded)
            return;

        regionType.regionsLoaded = true;

        this.set('params', {
            'v': 1,
            'schema': '{region:[regionid,name]}',
            'count': 'all',
            'regiontypeid': regionType.id
        });
        this.$.ajax.generateRequest();
    }

    public handleResponse() {
        this.$.ajax.lastResponse.data.forEach(data => {
            var region: HaRegion = new HaRegion(data)
            //if (this.regions.length - 1 < region.id)
            //    //this.regions.length = region.id + 1;
            //    this.set('regions.length', region.id + 1);
            
            this.regions[region.id] = region;
            //this.set('regions.' + region.id, region);
            
            //this.push('regions', new HaRegion(data));
        });
    }
}

HaRegions.register();