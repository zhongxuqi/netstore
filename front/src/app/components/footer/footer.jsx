import React from 'react'

import Language from '../../language/language.jsx'

export default class Footer extends React.Component {
    render() {
        return (
            <div className="netstore-footer">
                <h3 className="col-md-offset-1">{Language.textMap("Contact Me")}</h3>
                <p>
                    <div className="col-md-2" style={{textAlign:"right"}}>{Language.textMap("Address")}:</div>
                    <div className="col-md-10">{this.props.address}</div>
                </p>
                <p>
                    <div className="col-md-2" style={{textAlign:"right"}}>{Language.textMap("Phone")}:</div>
                    <div className="col-md-10">{this.props.phone}</div>
                </p>
            </div>
        )
    }
}
