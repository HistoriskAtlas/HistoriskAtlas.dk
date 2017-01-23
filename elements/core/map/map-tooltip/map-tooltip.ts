@component("map-tooltip")
class MapTooltip extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public tooltipText: string;

    public setText(text: string) {
        this.set('tooltipText', text);
        this.$.tooltip.show();
    }

    public hide() {
        this.$.tooltip.hide();
    }

    public setPosition(pixel: ol.Pixel) {
        $(this).offset({ left: pixel[0], top: pixel[1] });
    }
}

MapTooltip.register();