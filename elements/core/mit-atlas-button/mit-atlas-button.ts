@component("mit-atlas-button")
class MitAtlasButton extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public user: HAUser;

    @property({ type: Boolean })
    public isDevOrBeta: boolean;

    @property({ type: Boolean })
    public showEmbed: boolean;

    ready() {
        this.isDevOrBeta = Common.isDevOrBeta;
    }

    @listen("button.tap")
    buttonTap() {
        //if (!App.isDev) {
        //    App.toast.show('Vi oplever i øjeblikket problemer med at logge ind. Kom tilbage igen lidt senere!');
        //    return;
        //}

        if (App.haUsers.user.isDefault)
            Common.dom.append(WindowLogin.create());
    }

    @listen("button.paper-dropdown-open")
    buttonPaperDropdownOpen() {
        //this.$.menu.selected = null;

        if (App.haUsers.user.isDefault)
            this.$.button.close();
    }

    userCanCreateRoute(isDevOrBeta: boolean, user: HAUser): boolean {
        if (isDevOrBeta)
            return true;
        return user.canAccessHoD2017;
    }
    
    newGeoTap() {
        if (!App.haUsers.user.isActive) {
            App.toast.show('Du kan ikke oprette en fortælling, før brugeren er aktiveret. Se mail sendt til ' + App.haUsers.user.email + '.');
            return;
        }

        App.haGeos.newGeo();
    }

    newRouteTap() {
        App.haCollections.newRoute();
    }

    userCanCreateEmbed(user: HAUser) {
        return user.isPro;
    }
    newEmbedTap() {
        this.showEmbed = true;
    }

    profileTap() {
        //$(this).append(WindowProfile.create());
        Common.dom.append(WindowProfile.create());
    }

    newsTap() {
        //$(this).append(WindowUserNews.create());
        Common.dom.append(WindowUserNews.create());
    }

    adminTap() {
        //$(this).append(WindowAdmin.create());
        Common.dom.append(WindowAdmin.create());
    }
    editorialTap() {
        //$(this).append(WindowEditorial.create());
        Common.dom.append(WindowEditorial.create());

    }

    logOutTap() {
        Services.get('exit', {}, (result) => {
            if (result.data.status.code == 2)
                App.haUsers.set('user', HAUser.default);
            //else
            //    error logging out
        })
    }

    noAnimations(user: HAUser): boolean {
        return user.isDefault;
    }

    text(user: HAUser): string {
        return user.isDefault ? 'Log ind på' : user.firstname;
    }

}

MitAtlasButton.register();