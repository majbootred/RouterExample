import React, { Component } from 'react';
import { Observable } from 'rxjs/Observable';
import './TileNavigation.css'

import TileService from './Services/TileService';
import Tile from './Components/Tile';

export default class TileNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [],
            error: false,
            errorText: ''
        }
    }

    initSpScript = () => {
        return Observable.create((observer) => {
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', () => {
                observer.next(true);
                observer.complete();
            });
        });
    }

    componentDidMount = () => {
        this.initSpScript().subscribe(() => {
            let webUrl = this.props.weburl ? this.props.weburl : _spPageContextInfo.webAbsoluteUrl;
            TileService.getTiles(this.props.source, webUrl, this.props.listname)
                .subscribe(
                (data) => {
                    this.setState({
                        tiles: data
                    })
                },
                (ex) => {
                    this.setState({
                        error: true,
                        errorText: ex.message
                    })
                    console.log(ex.stack);
                });
        })
    }

    render() {
        if (!this.state.error) {
            return (
                <div>
                    {this.state.tiles.map((tile, key) =>
                        <Tile key={key} tile={tile} width={this.props.width} height={this.props.height} />
                    )}
                </div>
            )
        } else {
            return (
                <p>
                    <b>Error:</b> {this.state.errorText}
                </p>
            )
        }
    }
}