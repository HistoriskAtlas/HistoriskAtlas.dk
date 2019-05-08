@component("ha-institutions")
class HaInstitutions extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public institutions: Array<HAInstitution> = [];

    @property({ type: Object })
    public params: Object;

    //Needed?
    //public byId: Array<HaTag> = []; //Needed because polymer dosnt suppert asigning to array, ie. tags[id] = tag

    ready() {
        this.$.ajax.url = Common.api + 'tag.json';
    }

    public getAll() {
        //TODO!
        //this.parameters = {
        //    v: 1,
        //    sid: 
        //}
    }

    //public add(institution: HAInstitution) {
    //    if (this.institutions[institution.id]) //TODO: update instead?
    //        return;

    //    this.set('institutions.' + institution.id, institution); //TODO: works?
    //}




    public handleResponse() {
        for (var data of this.$.ajax.lastResponse) {

            //this.getTagFromData(data)
        }
    }

}

HaInstitutions.register();