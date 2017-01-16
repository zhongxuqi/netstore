import React from 'react'

import Language from '../../language/language.jsx'

export default class Footer extends React.Component {
    render() {
        return (
            <div className="netstore-footer">
                <div className="col-xs-12 col-md-12 col-sm-12">
                    <h3 className="col-xs-6 col-md-3 col-sm-4" style={{textAlign:"right"}}>{Language.textMap("Contact Me")}</h3>
                </div>
                <p>
                    <div className="col-sm-offset-1 col-md-offset-1 col-xs-4 col-md-2 col-sm-4" style={{textAlign:"right"}}>{Language.textMap("Address")}:</div>
                    <div className="col-md-9 col-sm-8 col-xs-8">{this.props.address}</div>
                </p>
                <p>
                    <div className="col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-xs-4 col-md-2 col-sm-4" style={{textAlign:"right"}}>{Language.textMap("Phone")}:</div>
                    <div className="col-md-9 col-sm-8 col-xs-8">{this.props.phone}</div>
                </p>
            </div>
        )
    }
}
