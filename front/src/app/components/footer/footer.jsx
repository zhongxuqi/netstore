import React from 'react'

import Language from '../../language/language.jsx'

export default class Footer extends React.Component {
    render() {
        return (
            <div className="netstore-footer">
                <h3>{Language.textMap("Contact Me")}</h3>
                <p>{Language.textMap("Address")}: {this.props.address}</p>
                <p>{Language.textMap("Phone")}: {this.props.address}</p>
            </div>
        )
    }
}
