﻿@component("panel-geo-editorial")
class PanelGeoEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public geos: Array<any>;

    @property({ type: String, value: '' })
    public filter: string

    @property({ type: Boolean })
    public selected: boolean;

    @property({ type: Number, value: 0 })
    public kind: number;

    @observe('selected')
    selectedChanged() {
        if (this.selected && !this.geos) {
            this.geos = [];
            this.sortOnTitle();
            this.fetchGeos();
        }
    }

    @observe('kind')
    kindChanged(newValue: any, oldValue: any) {
        if (oldValue == undefined)
            return;
        this.geos = [];
        this.fetchGeos();
    }

    filterCheckForEnter(e: any) {
        if (e.keyCode === 13)
            this.fetchGeos();
    }

    public fetchGeos() {
        //this.showDetails = false;
        Services.get('geo', {
            'schema': JSON.stringify(
                {
                    geo: {
                        fields: [
                            'id',
                            'title',
                            'online',
                            'created',
                            {
                                user: [
                                    'firstname',
                                    'lastname'
                                ]
                            },
                            {
                                tag_geos: [
                                    'empty',
                                    {
                                        collapse: 'tagid'
                                    }
                                ]
                            }
                        ],
                        filters: this.kind == 2 ?
                            {
                                tag_geos: [
                                    {
                                        tag: [
                                            {
                                                institutions: [
                                                    {
                                                        id: App.haUsers.user.currentInstitution.id
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                title: {
                                    like: this.filter
                                }
                            }
                            :
                            {
                            user: this.kind == 0 ?
                                [
                                    { id: App.haUsers.user.id }
                                ]
                                :
                                [
                                    {
                                        userhierarkis1: [
                                            {
                                                parentid: App.haUsers.user.id
                                            }
                                        ]
                                    }
                                ]
                                ,
                            title: {
                                like: this.filter
                            }
                        }
                    }
                }
            ),
            'count': 'all'
        }, (result) => {
            this.updateGeos(result.data);
        })
    }

    public updateGeos(newList: Array<any> = null) {
        //this.set('geos', (newList ? newList : this.geos).sort(this.compare));
        this.$.selector.sort(null, newList);
        this.$.list.notifyResize();
    }

    institution(): string {
        return App.haUsers.user.currentInstitution ? App.haUsers.user.currentInstitution.tag.plurName : '';
    }

    isPro(): boolean {
        return App.haUsers.user.isPro;
    }

    hasWriters(): boolean {
        return App.haUsers.user.isPro && App.haUsers.user.isEditor;
    }

    formatDate(date: string): string {
        return Common.formatDate(date);
    }

    statusClass(online: boolean, tag_geos: Array<number>): string {
        if (tag_geos.indexOf(730) > -1)
            return 'publish-request'

        return online ? 'online' : 'offline';
    }

    itemTap(e: any) {
        Common.geoClick(e.model.item.id);
    }

    sortOnTitle() {
        this.$.selector.sort(this.compareTitle);
    }
    compareTitle(a: any, b: any): number {
        return a.title.localeCompare(b.title);
    }

    sortOnUser() {
        this.$.selector.sort(this.compareUser);
    }
    compareUser(a: any, b: any): number {
        return (a.user.firstname + a.user.lastname).localeCompare(b.user.firstname + b.user.lastname);
    }

    sortOnDate() {
        this.$.selector.sort(this.compareDate);
    }
    compareDate(a: any, b: any): number {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
    }

    sortOnStatus() {
        this.$.selector.sort(this.compareStatus);
    }
    compareStatus(a: any, b: any): number {
        var valA = a.tag_geos.indexOf(730) > 0 ? 1 : (a.online ? 2 : 0);
        var valB = b.tag_geos.indexOf(730) > 0 ? 1 : (b.online ? 2 : 0);
        return valA - valB;
    }

}

PanelGeoEditorial.register();