@component("dialog-map-select")
class DialogMapSelect extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public map: HaMap;

    @property({ type: Array })
    public maps: Array<HaMap>;

    public open() {
        this.$.dialog.open();
    }

    @observe('map')
    mapChanged() {
        this.$.dialog.close();
    }

    years(start: number, end: number): string {
        return (start ? start + ' - ' : '') + end;
    }
}

DialogMapSelect.register();