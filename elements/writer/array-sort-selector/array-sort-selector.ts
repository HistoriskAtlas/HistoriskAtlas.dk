@component("array-sort-selector")
class ArraySortSelcetor extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public items: Array<any>;

    @property({ type: Object, notify: true })
    public selected: any;

    private compareFunc: (a: any, b: any) => number;
    private compareDir: number = 1;

    public select(item: any) {
        this.$.selector.select(item);
    }

    public deselect(item: any) {
        this.$.selector.deselect(item);
    }

    public sort(func: (a: any, b: any) => number = null, newItems: any = null) {
        if (func) {
            if (this.compareFunc === func)
                this.compareDir = -this.compareDir;
            else {
                this.compareDir = 1;
                this.compareFunc = func;
            }
        }

        var temp = (newItems ? newItems : this.items.slice(0)).sort(this.compareFunc);
        if (this.compareDir == -1)
            temp = temp.reverse();
        this.items = temp;
    }
}

ArraySortSelcetor.register();