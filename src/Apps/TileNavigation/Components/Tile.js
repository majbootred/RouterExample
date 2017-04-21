import React, { Component } from 'react'

export default class Tile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offsetHeight: 0,
            containerHeight: 0,
            containerWidth: 0,
        }
    }

    componentDidMount() {
        let containerWidth = this.props.width - 20;
        let containerHeight = this.props.height / 3;
        let offsetHeight = this.props.height - containerHeight;
        this.setState({
            containerWidth,
            containerHeight,
            offsetHeight
        })
    }

    _mouseOver = () => {
        let panelHeight = jQuery(this.imageElem).children('.height');
        let panelDescription = jQuery(this.imageElem).children('.description');
        panelHeight.stop().animate({ height: 0 }, 300);
        panelDescription.show();
        panelDescription.stop().animate({ height: this.state.offsetHeight }, 300);
    }

    _mouseOut = () => {
        let panelHeight = jQuery(this.imageElem).children('.height');
        let panelDescription = jQuery(this.imageElem).children('.description');
        panelHeight.stop().animate({ height: this.state.offsetHeight }, 300);
        panelDescription.stop().animate({ height: 0 }, 300);
    }

    render() {
        return (
            <div className="tilenavigation"
                onMouseOver={this._mouseOver}
                onMouseOut={this._mouseOut}>
                <a className="link"
                    href={this.props.tile.navigateUrl}
                    title={this.props.tile.title}>
                    <div className="image ms-tileview-tile-content"
                        style={{
                            width: this.props.width,
                            height: this.props.height,
                            backgroundImage: `url(${this.props.tile.imageUrl})`
                        }}
                        ref={(image) => { this.imageElem = image }}>
                        <div className="height" style={{ height: this.state.offsetHeight }} ></div>
                        <div className="title"
                            style={{
                                height: this.state.containerHeight,
                                width: this.state.containerWidth
                            }}>
                            <span>{this.props.tile.title}</span>
                        </div >
                        <div className="description"
                            title={this.props.tile.description}
                            style={{ width: this.state.containerWidth }} >
                            {this.props.tile.description}
                        </div >
                    </div >
                </a >
            </div >
        )
    }
}