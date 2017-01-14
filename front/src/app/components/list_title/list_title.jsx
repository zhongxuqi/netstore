import React from 'react'

import Language from '../../language/language.jsx'

import './list_title.less'

export default class ListTitle extends React.Component {
    render() {
        return <h4 className="list-title">一共找到{this.props.commodityTotal}件商品</h4>
    }
}
