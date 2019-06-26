@component("map-tooltip")
class MapTooltip extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public tooltipText: string;

    @property({ type: String })
    public imageUrl: string;

    @property({ type: Boolean, value: true })
    public hideImage: boolean;

    private shown: boolean = false;;

    public setText(text: string, ifShown?: boolean, imageUrl?: string) {
        if (ifShown && !this.shown)
            return;

        this.shown = true;
        this.set('hideImage', true);
        this.set('tooltipText', text);
        if (imageUrl)
            this.set('imageUrl', imageUrl);
        this.$.tooltip.show();
    }

    imageLoaded() {
        this.set('hideImage', false);
    }

    public hide() {
        this.shown = false;
        this.$.tooltip.hide();
        this.set('hideImage', true);
        this.set('imageUrl', '');
    }

    public setPosition(pixel: ol.Pixel) {
        $(this).offset({ left: pixel[0], top: pixel[1] });
    }
}

MapTooltip.register();