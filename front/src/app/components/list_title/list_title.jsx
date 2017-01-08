import React from 'react'

import Language from '../../language/language.jsx'

import './list_title.less'

export default class ListTitle extends React.Component {
    render() {
        return <h4 className="list-title">{Language.textMap("We’ve found ")}{this.props.commodityTotal}{Language.textMap(" documents")}</h4>
    }
}
