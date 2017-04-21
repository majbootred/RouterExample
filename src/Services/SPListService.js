import React from 'react';
import { Observable } from 'rxjs/Observable';

export default class SPListService {
    static initSpScript() {
        return Observable.create((observer) => {
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', () => {
                observer.next(true);
                observer.complete();
            });
        });
    }

    static getListItem(listTitle, listItemId) {
        let clientContext = SP.ClientContext.get_current();
        let list = clientContext.get_web().get_lists().getByTitle(listTitle);
        let listItem = list.getItemById(listItemId);
        clientContext.load(listItem);

        return Observable.create((observer) => {
            clientContext.executeQueryAsync(() => {
                observer.next(listItem);
                observer.complete();
            }, (ex) => {
                observer.error(ex);
            });
        });
    }

    static getAllListItems(webUrl, listName, orderBy, orderByAscending) {
        return Observable.create((observer) => {
            let clientContext = new SP.ClientContext(webUrl);
            this.getListByName(clientContext, listName)
                .map(list => {
                    let query;
                    if (orderBy) {
                        let viewXml = `<View Scope=\"RecursiveAll\"><Query><OrderBy><FieldRef Name=\'TileOrder\' Ascending=\'${orderByAscending.toString().toUpperCase()}\' /></OrderBy></Query></View>`;
                        query = new SP.CamlQuery();
                        query.set_viewXml(viewXml);
                    } else {
                        query = SP.CamlQuery.createAllItemsQuery();
                    }
                    let items = list.getItems(query);
                    clientContext.load(items);
                    clientContext.executeQueryAsync(() => {
                        observer.next(items);
                        observer.complete();
                    }, (ex) => {
                        observer.error(ex);
                    });
                })
                .subscribe(() => { },
                ex => observer.error(ex));
        });
    }

    static deleteRegistration(selections) {
        return Observable.create((observer) => {
            let ctx = SP.ClientContext.get_current();
            let web = ctx.get_web();
            let list = web.get_lists().getByTitle('Registrations');
            for (let selection of selections) {
                let item = list.getItemById(selection.ID);
                item.deleteObject();
            }
            ctx.executeQueryAsync(
                function () {
                    observer.next();
                    observer.complete();
                },
                function (sender, args) {
                    observer.error(args.get_message());
                }
            )
        });
    }

    static getRegistrationsByCourseId(courseId) {
        return Observable.create((observer) => {
            let ctx = SP.ClientContext.get_current();
            let web = ctx.get_web();
            let list = web.get_lists().getByTitle('Registrations');
            let query = new SP.CamlQuery();
            query.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Training_x002d_CourseLookup" LookupId="TRUE"/><Value Type="Lookup">' + courseId + '</Value></Eq></Where></Query></View>');
            let listItems = list.getItems(query);
            let items = [];
            ctx.load(listItems);
            ctx.executeQueryAsync(
                function () {
                    let listEnumerator = listItems.getEnumerator();
                    while (listEnumerator.moveNext()) {
                        let item = listEnumerator.get_current();
                        if (!item.get_item('Training_RegistrationCanceled')) {
                            let subscriber = item.get_item('Training_x002d_Subscriber') ? (<a href={`/_layouts/15/userdisp.aspx?id=${item.get_item('Training_x002d_Subscriber').get_lookupId()}`} target='_blank'>{item.get_item('Training_x002d_Subscriber').get_lookupValue()}</a>) : '';
                            let partner = item.get_item('service_x002d_partner_x003a_Titl') ? (<a href={`/en/trainings-web/Service%20Partner/Forms/DispForm.aspx?ID=${item.get_item('service_x002d_partner_x003a_Titl').get_lookupId()}`} target='_blank'>{item.get_item('service_x002d_partner_x003a_Titl').get_lookupValue()}</a>) : '';
                            items.push(
                                {
                                    'Subscriber': subscriber === '' && partner === '' ? `${item.get_item('Training_x002d_SubscriberLastnam')}, ${item.get_item('Training_x002d_SubscriberFirstna')}` : subscriber,
                                    'Service Partner': partner,
                                    'ID': item.get_item('ID')
                                }
                            );
                        }
                    }
                    observer.next(items);
                    observer.complete();
                },
                function (sender, args) { alert("error in inner request: " + args.get_message()); }
            );
        })
    }

    static isCurrentUserInGroup(group) {
        return Observable.create((observer) => {
            let userInGroup = false;
            let ctx = SP.ClientContext.get_current();
            let user = ctx.get_web().get_currentUser();
            let groupUsers = ctx.get_web().get_siteGroups().getByName(group).get_users();

            ctx.load(user);
            ctx.load(groupUsers);
            ctx.executeQueryAsync(function () {
                let groupUsersEnumerator = groupUsers.getEnumerator();
                while (groupUsersEnumerator.moveNext()) {
                    let groupUser = groupUsersEnumerator.get_current();
                    if (groupUser.get_id() == user.get_id()) {
                        userInGroup = true;
                    }
                }
                observer.next(userInGroup);
                observer.complete();
            }, function (sender, args) {
                observer.next(userInGroup);
                observer.complete();
            });
        });
    }

    static getListByName(clientContext, listName) {
        return Observable.create((observer) => {
            let lists = clientContext.get_web().get_lists();
            clientContext.load(lists);
            let context = this;
            clientContext.executeQueryAsync(() => {
                let count = lists.get_count();
                let index = 0;
                let listExits = false;
                let enumerator = lists.getEnumerator();
                while (enumerator.moveNext()) {
                    let list = enumerator.get_current();
                    context.checkList(clientContext, list, listName).subscribe((isList) => {
                        if (isList) {
                            listExits = true;
                            observer.next(list);
                            observer.complete();
                        }
                        if (++index === count && !listExits) {
                            observer.error(new Error(`List cannot be found! Please ensure that the list with Name "${listName}" exists on given url.`));
                        }
                    });
                }
            });
        });
    }

    static checkList(clientContext, list, listName) {
        return Observable.create((observer) => {
            let rootFolder = list.get_rootFolder();
            clientContext.load(rootFolder);
            clientContext.executeQueryAsync(() => {
                let currentListName = rootFolder.get_name();
                if (currentListName === listName) {
                    observer.next(true);
                    observer.complete();
                } else {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }
}