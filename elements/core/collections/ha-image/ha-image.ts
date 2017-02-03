@component("ha-image")
class HaImageService extends Tags implements polymer.Element {

    @property({ type: Object, notify: true })
    public image: HAImage;

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Boolean })
    public editing: boolean;

    //ready() {
    //    this.$.ajax.url = Common.api + 'geo.json';
    //}

    @observe("image")
    imageChanged() {
        this.initTags('image'/*, this.image.id*/);
    }
    
    @observe("image.text")
    textChanged() {
        Services.update('image', { id: this.image.id, text: this.image.text });
    }

    @observe("image.year")
    yearChanged() {
        Services.update('image', { id: this.image.id, year: this.image.year });
    }

    @observe("image.licensee")
    licenseeChanged() {
        Services.update('image', { id: this.image.id, licensee: this.image.licensee });
    }

    @observe("image.photographer")
    photographerChanged() {
        Services.update('image', { id: this.image.id, photographer: this.image.photographer });
    }

    deleteImage() {
        Services.delete('image', { id: this.image.id }, (result) => {
            App.toast.show('Billedet blev slettet.');
            (<WindowImage>this.parentNode).windowGeo.splice('geo.images', this.geo.images.indexOf(this.image), 1); //TODO: might be easier to stop spawning windom-image dynamically
        }, (result) => {
            App.toast.show('Billedet blev IKKE slettet. Muligvis pga. manglende rettigheder.');
        })
    }
}

HaImageService.register();