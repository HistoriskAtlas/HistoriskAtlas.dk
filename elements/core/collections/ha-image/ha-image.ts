@component("ha-image")
class HaImageService extends Tags implements polymer.Element {

    @property({ type: Object, notify: true })
    public image: HAImage;

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Boolean })
    public editing: boolean;

    private lastText: string;
    private lastYear: string;
    private lastLicensee: string;
    private lastPhotographer: string;

    //ready() {
    //    this.$.ajax.url = Common.api + 'geo.json';
    //}

    @observe("image")
    imageChanged() {
        this.initTags('image'/*, this.image.id*/);
        this.lastText = this.image.text;
        this.lastYear = this.image.year;
        this.lastLicensee = this.image.licensee;
        this.lastPhotographer = this.image.photographer;
    }
    
    @observe("image.text")
    textChanged() {
        if (this.editing && this.lastText != this.image.text) {
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ text: this.image.text }));
            this.lastText = this.image.text
        }        
    }

    @observe("image.year")
    yearChanged() {
        if (this.editing && this.lastYear != this.image.year) {
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ year: this.image.year }));
            this.lastYear = this.image.year;
        }
    }

    @observe("image.licensee")
    licenseeChanged() {
        if (this.editing && this.lastLicensee != this.image.licensee) {
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ licensee: this.image.licensee }));
            this.lastLicensee = this.image.licensee;
        }
    }

    @observe("image.photographer")
    photographerChanged() {
        if (this.editing && this.lastPhotographer != this.image.photographer) {
            Services.HAAPI_PUT('image', this.image.id, {}, Common.formData({ photographer: this.image.photographer }));
            this.lastPhotographer = this.image.photographer
        }
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