@component("dialog-video-intro")
class DialogVideoIntro extends polymer.Base implements polymer.Element {

    @listen('dialog.iron-overlay-closed')
    dialogClosed(e: any) {
        $(this).remove();
    }
}

DialogVideoIntro.register();