@component("dialog-tour-main-menu")
class DialogTourMainMenu extends polymer.Base implements polymer.Element {
    private curDialog: number = 0;

    constructor() {
        super();
        this.nextTap();
    }

    dismissTap() {
        LocalStorage.set('firstMenuOpenTourDone', 'true');
    }

    nextTap() {
        App.mainMenu.drawerOpen = true;
        this.curDialog++;
        $(this).append(DialogTour.create('Temavælger', 'Her kan du vælge et overordnet tema, som tilpasser indholdet der vises på sitet.', -40, null, 0, null, null, 45, -15, null));
    }

    @listen('next')
    next() {
        this.curDialog++;
        switch (this.curDialog) {
            case 2: $(this).append(DialogTour.create('Fortællinger', 'Under dette menupunkt kan du filtrere på emner og perioder for de fortællinger (steder) der vises på kortet. Her kan du også vælge at slå brugerskabte fortællinger til.', -40, null, 40, null, 65, null, -15, null)); break;
            case 3: $(this).append(DialogTour.create('Grænser', 'Under dette menupunkt kan du vælge at få vist historiske grænsedragninger på kortet.', -40, null, 83, null, 65, null, -15, null)); break;
            case 4: $(this).append(DialogTour.create('Ruter', 'Under dette menupunkt kan du slå forskellige ruter til, som vil blive vist på kortet.', -40, null, 126, null, 65, null, -15, null, true, 'firstMenuOpenTourDone')); break;
            case 5: LocalStorage.set('firstMenuOpenTourDone', 'true'); break;
        }
    }
}

DialogTourMainMenu.register();