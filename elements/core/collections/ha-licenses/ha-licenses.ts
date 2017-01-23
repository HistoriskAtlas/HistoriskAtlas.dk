@component("ha-licenses")
class HaLicenses extends polymer.Base implements polymer.Element {

    @property({ type: Object, value: null, notify: true })
    public licenses: Array<HaLicens>;
    public byTagID: Array<HaLicens>;

    ready() {
        //TODO: better to fetch from API?
        this.licenses = [];
        this.byTagID = [];

        this.add(new HaLicens(80, 'Copyright', 'https://www.retsinformation.dk/Forms/R0710.aspx?id=164796'));
        this.add(new HaLicens(271, 'Navngivelse-IkkeKommerciel-IngenBearbejdelse', 'http://creativecommons.org/licenses/by-nc-nd/2.5/dk/'));
        this.add(new HaLicens(270, 'Navngivelse-IkkeKommerciel–DelPåSammeVilkår', 'http://creativecommons.org/licenses/by-nc-sa/2.5/dk/'));
        this.add(new HaLicens(268, 'Navngivelse-IngenBearbejdelse', 'http://creativecommons.org/licenses/by-nd/2.5/dk/'));
        this.add(new HaLicens(269, 'Navngivelse-IkkeKommerciel', 'http://creativecommons.org/licenses/by-nc/2.5/dk/'));
        this.add(new HaLicens(267, 'Navngivelse-DelPåSammeVilkår', 'http://creativecommons.org/licenses/by-sa/2.5/dk/'));
        this.add(new HaLicens(63, 'Navngivelse', 'http://creativecommons.org/licenses/by/2.5/dk/'));
        this.add(new HaLicens(79, 'Public domain', 'https://creativecommons.org/about/pdm'));
    }

    private add(licens: HaLicens) {
        this.licenses.push(licens)
        this.byTagID[licens.tagID] = licens;
    }
}

HaLicenses.register();