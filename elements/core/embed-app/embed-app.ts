@component("embed-app")
class EmbedApp extends App implements polymer.Element {

    created() {
        super.created();
    }

    ready() {
        super.ready();
    }

    showWindowRoute(collection: HaCollection): boolean {
        return collection && !(Common.embed && App.passed.collection); //Hack for digterruter...
    }
}

EmbedApp.register();

