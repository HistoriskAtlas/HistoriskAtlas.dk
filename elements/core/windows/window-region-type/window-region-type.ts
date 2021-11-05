@component("window-region-type")
class WindowRegionType extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public regionType: HARegionType & Object;

    constructor(regionType: HARegionType) {
        super();
        //this.$.ajax.url = Common.api + 'regiontype.json';
        this.regionType = regionType;
    }

    ready() {
        setTimeout(() => {
            //(<any>$(this.$.scroller)).mCustomScrollbar({
            //    theme: "minimal-dark"
            //})
            $(this.$.about).load('html/RegionTypeAbouts/' + this.regionType.id + '.html');
        }, 100);
    }

    //@observe("regionType")
    //regionTypeChanged() {
    //    //if (this.regionType.....) //already loaded
    //    //    return;

    //    this.set('params', {
    //        'v': 1,
    //        'regiontypeid': this.regionType.id
    //        //'schema': '{region:[regiontypeid,periodstart,periodend,{parents:[{region:[regionid,name,periodstart,periodend]}]},{children:[{child:[regionid,name,periodstart,periodend]}]},{region_regionsources:[{regionsource:[name]}]}]}'
    //    });
    //    this.$.ajax.generateRequest();
    //}

    //public handleResponse() {
    //    var data = this.$.ajax.lastResponse.data[0];
    //    //this.set('region.periodStart', data.periodstart);
    //}

    years(start: number, end: number): string {
        return Common.years(start, end);
    }

    isDefined(val: any): boolean {
        return !!val ? val.length > 0 : false;
    }
}

WindowRegionType.register();