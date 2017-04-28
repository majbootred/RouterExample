import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Components/Header';

import Home from './Components/Home';
import About from './Components/About';

export default class ReactRouting extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header />
                    <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit</h1>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}