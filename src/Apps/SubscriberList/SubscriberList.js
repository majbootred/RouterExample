import React, { Component } from 'react';
import { Button, PrimaryButton, CommandBar, DetailsList, Dialog, DialogType, DialogFooter, Selection } from 'office-ui-fabric-react';

import SPListService from '../../Services/SPListService';

export default class SubscriberList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isUserAdmin: false,
            confirmDialog: false,
            selection: new Selection(),
            loading: true
        }
        this.state.selection.setItems(this.state.items, false);
    }

    componentDidMount() {
        SPListService.initSpScript().subscribe(() => {
            SPListService.isCurrentUserInGroup('Training Managers').subscribe((response) => {
                this.setState({
                    isUserAdmin: response
                });
                this.update();
            })
        })
    }

    update() {
        this.setState({
            loading: true
        })
        let courseId = this.getUrlParameterByName('ID');

        SPListService.getRegistrationsByCourseId(courseId).subscribe((data) => {
            this.setState({
                items: data,
                loading: false
            })
        });
    }

    getUrlParameterByName(name) {
        let url = window.location.href;

        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    _removeSubscribers = (e) => {
        e.preventDefault();

        SPListService.deleteRegistration(this.state.selection.getSelection()).subscribe(() => {
            this.update();
        });
        this._toggleDialog(e);
    }

    _refresh = (e) => {
        e.preventDefault();
        this.update();
    }

    _toggleDialog = (e) => {
        e.preventDefault();
        if (this.state.selection.getSelection().length == 0) return;
        this.setState({
            confirmDialog: !this.state.confirmDialog
        });
    }

    render() {
        let Commands = this.state.isUserAdmin ? [{ name: 'Abmelden/Cancel', onClick: this._toggleDialog, iconProps: { iconName: 'Unsubscribe' }, disabled: this.state.loading }] : [];
        let FarCommands = [{ name: '', onClick: this._refresh, iconProps: { iconName: 'Refresh' }, disabled: this.state.loading }]
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm12">
                        <h1>Subscriber List</h1>
                        <Dialog
                            title={'Sind Sie sicher, dass Sie die ausgewählten Benutzer abmelden möchten?'}
                            isOpen={this.state.confirmDialog}
                            isBlocking={true}>
                            <DialogFooter>
                                <PrimaryButton onClick={this._removeSubscribers}>Abmelden</PrimaryButton>
                                <Button onClick={this._toggleDialog}>Abbrechen</Button>
                            </DialogFooter>
                        </Dialog>
                        <CommandBar
                            isSearchBoxVisible={false}
                            items={Commands}
                            farItems={FarCommands}></CommandBar>
                        <DetailsList
                            items={this.state.items}
                            selection={this.state.selection}></DetailsList>
                    </div>
                </div>
            </div>
        )
    }
}
