@component("dialog-tour-intro")
class DialogTourIntro extends polymer.Base implements polymer.Element {
    private curDialog: number = 0;

    constructor(showFirst: boolean = true) {
        super();
        if (showFirst)
            this.$.dialog.open();
        else
            this.nextTap();
    }

    dismissTap() {
        AppMode.showPopup();
    }

    nextTap() {
        App.mainMenu.drawerOpen = false;
        this.curDialog++;
        $(this).append(DialogTour.create('Her er MitAtlas', 'Her kan du logge ind eller oprette en bruger, så du kan bidrage med dine egne fortællinger!', null, -25, 50, null, null, 6, -15, null));
    }

    @listen('next')
    next() {
        this.curDialog++;
        switch (this.curDialog) {
            case 2: $(this).append(DialogTour.create('Her er kortnavigationen', 'Brug knapperne til at zoome på kortet og finde hen hvor du er lige nu. mv.', null, 50, null, 0, null, -15, null, 6)); break;
            case 3: $(this).append(DialogTour.create('Her kan du vælge et nyt kort', 'Vælg mellem flere forskellige historiske kort.', -20, null, null, 50, 6, null, null, -15)); break;
            case 4: $(this).append(DialogTour.create('Her er hovedmenuen', 'Her kan du slå indhold på kortet til og fra, og få mere information. Til højre herfor finder du søgeknappen.', -25, null, 50, null, 6, null, -15, null)); break;
            case 5: App.mainMenu.drawerOpen = false; LocalStorage.delete('firstMenuOpenTourDone'); App.mainMenu.drawerOpen = true; AppMode.showPopup(); break;
        }
    }
}

DialogTourIntro.register();