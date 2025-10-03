@component("ha-licenses")
class HaLicenses extends polymer.Base implements polymer.Element {

    @property({ type: Object, value: null, notify: true })
    public licenses: Array<HaLicens>;
    public byTagID: Array<HaLicens>;

    ready() {
        //TODO: better to fetch from API?
        this.licenses = [];
        this.byTagID = [];

        this.add(new HaLicens(80, 'Copyright', 'https://www.retsinformation.dk/eli/lta/2014/1144'));
        this.add(new HaLicens(271, 'Navngivelse-IkkeKommerciel-IngenBearbejdelse', 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.da'));
        this.add(new HaLicens(270, 'Navngivelse-IkkeKommerciel–DelPåSammeVilkår', 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.da'));
        this.add(new HaLicens(268, 'Navngivelse-IngenBearbejdelse', 'https://creativecommons.org/licenses/by-nd/4.0/deed.da'));
        this.add(new HaLicens(269, 'Navngivelse-IkkeKommerciel', 'https://creativecommons.org/licenses/by-nc/4.0/deed.da'));
        this.add(new HaLicens(267, 'Navngivelse-DelPåSammeVilkår', 'https://creativecommons.org/licenses/by-sa/4.0/deed.da'));
        this.add(new HaLicens(63, 'Navngivelse', 'https://creativecommons.org/licenses/by/4.0/deed.da'));
        this.add(new HaLicens(79, 'Public domain', 'https://creativecommons.org/public-domain/pdm/'));
    }

    private add(licens: HaLicens) {
        this.licenses.push(licens)
        this.byTagID[licens.tagID] = licens;
    }
}

HaLicenses.register();