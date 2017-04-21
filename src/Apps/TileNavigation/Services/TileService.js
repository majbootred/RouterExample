import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import SPListService from '../../../Services/SPListService';

export default class TileService {

    static getTiles(source, webUrl, listName) {
        if (source === 'List') {
            return this.getTilesFromList(webUrl, listName);
        } else if (source === 'Subweb') {
            return this.getTilesFromSubweb(webUrl);
        }
    }

    static getTilesFromList(webUrl, listName) {
        if (!listName) {
            return Observable.create((observer) => {
                observer.error(new Error('Parameter ListName is empty! Please specify a list name in webpart properties!'));
            });
        }
        return SPListService.getAllListItems(webUrl, listName, 'TileOrder', true)
            .map(listItems => this.parseListItems(listItems));
    }

    static parseListItems(listItems) {
        let tiles = [];
        let enumerator = listItems.getEnumerator();
        while (enumerator.moveNext()) {
            let listItem = enumerator.get_current();
            tiles.push(this.parseListItem(listItem));
        }
        return tiles;
    }

    static parseListItem(listItem) {
        let tile = {};
        tile.title = listItem.get_item('Title');
        tile.description = listItem.get_item('Description');
        tile.navigateUrl = listItem.get_item('LinkLocation') ? listItem.get_item('LinkLocation').get_url() : '';
        tile.imageUrl = listItem.get_item('BackgroundImageLocation') ? listItem.get_item('BackgroundImageLocation').get_url() : '';
        tile.openInNewTab = false;
        return tile;
    }

    static getTilesFromSubweb(webUrl) {
        return this.getSubWebs(webUrl)
            .map(subWebs => this.parseSubWebs(subWebs));
    }

    static getSubWebs(webUrl) {
        return Observable.create((observer) => {
            let ctx = new SP.ClientContext(webUrl);
            let web = ctx.get_web();
            let subWebs = web.getSubwebsForCurrentUser(null);
            ctx.load(subWebs);
            ctx.executeQueryAsync(() => {
                observer.next(subWebs);
                observer.complete();
            }, (ex) => {
                observer.error(ex);
            });
        });
    }

    static parseSubWebs(subWebs) {
        let tiles = [];
        let enumerator = subWebs.getEnumerator();
        while (enumerator.moveNext()) {
            let subWeb = enumerator.get_current();
            tiles.push(this.parseSubWeb(subWeb));
        }
        return tiles;
    }

    static parseSubWeb = (web) => {
        let tile = {};
        tile.title = web.get_title();
        tile.description = web.get_description();
        tile.navigateUrl = web.get_url();
        tile.imageUrl = web.get_siteLogoUrl();
        tile.openInNewTab = false;
        return tile;
    }
}