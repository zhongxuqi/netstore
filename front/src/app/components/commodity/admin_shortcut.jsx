import React from 'react'

export default class AdminShortCut extends React.Component {
    render() {
        return (
            <div className="border-bottom clearfix" style={{padding:"10px"}}>
                <div className="col-md-3">
                    <a className="thumbnail" style={{margin:"0px"}}>
                        <img src={this.props.commodity.imageUrl} alt="..."/>
                    </a>
                </div>
                <div className="col-md-9">
                    <div className="netstore-table">
                        <div className="netstore-table-cell">
                            <span className="badge">#{this.props.commodity.index}</span>
                        </div>
                        <h3 className="netstore-table-cell" style={{whiteSpace: "nowrap"}}>
                            {this.props.commodity.title}
                        </h3>
                    </div>
                    <div style={{fontSize:"18px", margin:"5px 0px"}}>
                        <span className="label label-info theme-background" style={{padding:"5px"}}>{this.props.commodity.class+" / "+this.props.commodity.subClass}</span>
                    </div>
                    <h4 className="price-color">{this.props.commodity.price.toFixed(2)}</h4>
                    <p>{this.props.commodity.intro}</p>
                    <div className="netstore-table">
                        <div className="netstore-table-cell">
                            <button type="button" className="btn btn-info" onClick={(()=>{this.props.onItemClick("detail", this.props.commodity)}).bind(this)}><i className="fa fa-eye" style={{paddingRight:"7px"}}></i>详情</button>
                        </div>
                        <div className="netstore-table-cell" style={{paddingLeft:"10px"}}>
                            <button type="button" className="btn btn-success" onClick={(()=>{this.props.onItemClick("edit", this.props.commodity)}).bind(this)}><i className="fa fa-edit" style={{paddingRight:"7px"}}></i>编辑</button>
                        </div>
                        <div className="netstore-table-cell" style={{paddingLeft:"10px"}}>
                                <button type="button" className="btn btn-warning" onClick={(()=>{this.props.onItemClick("delete", this.props.commodity)}).bind(this)}><i className="fa fa-trash" style={{paddingRight:"7px"}}></i>删除</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
