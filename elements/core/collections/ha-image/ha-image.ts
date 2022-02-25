@component("ha-image")
class HaImageService extends Tags implements polymer.Element {

    @property({ type: Object, notify: true })
    public image: HAImage;

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Boolean })
    public editing: boolean;

    private firstTextChange: boolean = true;
    private firstYearChange: boolean = true;
    private firstLicenseeChange: boolean = true;
    private firstPhotographerChange: boolean = true;

    //ready() {
    //    this.$.ajax.url = Common.api + 'geo.json';
    //}

    @observe("image")
    imageChanged() {
        this.initTags('image'/*, this.image.id*/);
        this.firstTextChange = true;
        this.firstYearChange = true;
        this.firstLicenseeChange = true;
        this.firstPhotographerChange = true;
    }
    
    @observe("image.text")
    textChanged() {
        if (this.editing && !this.firstTextChange)
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ text: this.image.text }));
        this.firstTextChange = false;
    }

    @observe("image.year")
    yearChanged() {
        if (this.editing && !this.firstYearChange)
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ year: this.image.year }));
        this.firstYearChange = false;
    }

    @observe("image.licensee")
    licenseeChanged() {
        if (this.editing && !this.firstLicenseeChange)
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ licensee: this.image.licensee }));
        this.firstLicenseeChange = false;
    }

    @observe("image.photographer")
    photographerChanged() {
        if (this.editing && !this.firstPhotographerChange)
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ photographer: this.image.photographer }));
        this.firstPhotographerChange = false;
    }

    deleteImage() {
        if (!this.editing)
            return;
        Services.HAAPI_DELETE('image', this.image.id, false, {}, (result) => {
            App.toast.show('Billedet blev slettet.');
            (<WindowImage>this.parentNode).windowGeo.splice('geo.images', this.geo.images.indexOf(this.image), 1); //TODO: might be easier to stop spawning windom-image dynamically
        }, (result) => {
            App.toast.show('Billedet blev IKKE slettet. Muligvis pga. manglende rettigheder. Kontakt it@historiskatlas.dk');
        })
    }
}

HaImageService.register();