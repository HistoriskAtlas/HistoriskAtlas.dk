@component("window-region")
class WindowRegion extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public region: HaRegion & Object;

    constructor(region: HaRegion) {
        super();
        //this.$.ajax.url = Common.api + 'region.json';
        this.region = region;
    }

    //ready() {
    //    setTimeout(() =>
    //        (<any>$(this.$.scroller)).mCustomScrollbar({
    //            theme: "minimal-dark"
    //        }), 100);
    //}

    @observe("region")
    regionChanged() {
        if (this.region.type) //already loaded
            return;

    //    this.set('params', {
    //        'v': 1,
    //        'regionid': this.region.id,
    //        'schema': '{region:[regiontypeid,periodstart,periodend,{parents:[empty,{region:[regionid,name,periodstart,periodend]}]},{children:[empty,{child:[regionid,name,periodstart,periodend]}]},{region_regionsources:[empty,{regionsource:[name]}]}]}'
    //        //'sort': '[key:"region.parents.periodstart"]' TODO: HOW?! Sort on client instead...
    //    });
    //    this.$.ajax.generateRequest();
        Services.HAAPI(`region/${this.region.id}`, null, (result) => this.handleResponse(result.data))
    }

    public handleResponse(data: any) {
        //var data = this.$.ajax.lastResponse.data[0];
        this.set('region.periodStart', data.periodstart);
        this.set('region.periodEnd', data.periodend);
        this.set('region.type', App.haRegions.regionTypes[data.regiontypeid]);

        //var sources: Array<string> = [];
        //data.region_regionsources.forEach((source: any) => {
        //    sources.push(source.regionsource.name);
        //});         
        //this.set('region.sources', sources);
        this.set('region.sources', data.regionsources);

        var parents: Array<HaRegion> = [];
        //data.parents.forEach((parent: any) => {
        //    parents.push(new HaRegion(parent.region));
        //});         
        for (var parent of data.parents)
            parents.push(new HaRegion(parent));
        this.set('region.parents', parents);

        var children: Array<HaRegion> = [];
        //data.children.forEach((child: any) => {
        //    children.push(new HaRegion(child.child));
        //});
        for (var child of data.children)
            parents.push(new HaRegion(child));
        this.set('region.children', children);
    }

    years(start: number, end: number): string {
        return Common.years(start, end);
    }

    isDefined(val: any): boolean {
        return !!val ? val.length > 0 : false;
    }

    regionTap(e: any) {
        Common.dom.append(WindowRegion.create(<HaRegion>e.model.item));
        //(<any>$(this.$.scroller)).mCustomScrollbar({
        //    theme: "minimal-dark"
        //});
    }
}

WindowRegion.register();