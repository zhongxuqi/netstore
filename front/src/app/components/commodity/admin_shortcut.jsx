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
                        <div className="netstore-table-cell" style={{width:"1%"}}>
                            <span className="badge">#{this.props.commodity.index}</span>
                        </div>
                        <h3 className="netstore-table-cell" style={{width:"1%", whiteSpace: "nowrap"}}>
                            {this.props.commodity.title}
                        </h3>
                        <div className="netstore-table-cell" style={{width:"99%",fontSize:"16px", paddingLeft:"10px"}}>
                            <span className="label label-info" style={{padding:"2px"}}>{this.props.commodity.class+" / "+this.props.commodity.subClass}</span>
                        </div>
                        <div className="netstore-table-cell" style={{width:"1%"}}>
                            <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-edit"></span>编辑</button>
                        </div>
                        <div className="netstore-table-cell" style={{width:"1%", paddingLeft:"10px"}}>
                            <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-trash"></span>删除</button>
                        </div>
                    </div>
                    <h4 className="price-color">{this.props.commodity.price}</h4>
                    <p>{this.props.commodity.intro}</p>
                </div>
            </div>
        )
    }
}
