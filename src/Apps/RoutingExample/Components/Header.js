import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Header extends Component {

    render() {
        return (
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/About">About</Link></li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Header
