import React from 'react'

import AdminShortCut from '../commodity/admin_shortcut.jsx'

export default class CommodityList extends React.Component {
    render() {
        return (
            <ul className="border-top" style={{padding:"0px"}}>
                {
                    this.props.commodities.map((item, i)=>{
                        return (
                            <AdminShortCut key={i} commodity={item} onItemClick={this.props.onItemClick}></AdminShortCut>
                        )
                    })
                } 
            </ul>
        )
    }
}
