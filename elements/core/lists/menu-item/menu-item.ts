@component("menu-item")
class MenuItem extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public disabled: boolean;

    @property({ type: Boolean, value: false })
    public spacer: boolean;

    isDisabled(disabled: boolean, spacer: boolean): boolean {
        return disabled || spacer;
    }

}

MenuItem.register();