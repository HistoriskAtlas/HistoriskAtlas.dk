@component("dialog-report")
class DialogReport extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public geo: HaGeo;

    public open() {
        this.$.dialog.open();
    }

    reportLicensViolation() {
        this.report(723);
    }
    reportFalseInformation() {
        this.report(724);
    }
    reportOffensiveContent() {
        this.report(725);
    }

    private report(tagID: number) {
        this.push('geo.tags2', App.haTags.byId[tagID]);
        this.$.dialogDone.open();
    }

}

DialogReport.register();