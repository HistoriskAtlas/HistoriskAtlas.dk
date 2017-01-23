@component("panel-admin")
class PanelAdmin extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public items: Array<any>;

    @property({ type: Object, notify: true })
    public item: any;

    private compareFunc: (a: any, b: any) => number;
    private compareDir: number = 1;

    public select(item: any) {
        this.$.selector.select(item);
    }

    public deselect(item: any) {
        this.$.selector.deselect(item);
    }

    public sort(func: (a: any, b: any) => number = null, newItems: any = null) {
        this.$.selector.sort(func, newItems);
    }
}

PanelAdmin.register();