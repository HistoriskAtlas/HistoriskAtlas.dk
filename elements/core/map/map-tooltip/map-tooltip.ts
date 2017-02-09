@component("map-tooltip")
class MapTooltip extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public tooltipText: string;

    private shown: boolean = false;;

    public setText(text: string, ifShown?: boolean) {
        if (ifShown && !this.shown)
            return;

        this.shown = true;
        this.set('tooltipText', text);
        this.$.tooltip.show();
    }

    public hide() {
        this.shown = false;
        this.$.tooltip.hide();
    }

    public setPosition(pixel: ol.Pixel) {
        $(this).offset({ left: pixel[0], top: pixel[1] });
    }
}

MapTooltip.register();