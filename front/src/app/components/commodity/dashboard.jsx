import React from 'react'
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import ListTitle from '../list_title/list_title.jsx'
import CommodityList from '../commodity_list/commodity_list.jsx'

export default class CommodityDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commodities: [],
            totalNum: 0,
            commodity: {},
        };
        this.getCommodities()
    }

    getCommodities() {
        HttpUtils.get("/api/root/commodities", {}, ((resp)=>{
            if (resp.commodities == null) return
            this.setState({
                commodities: resp.commodities,
                totalNum: resp.totalNum,
            })
        }).bind(this))
    }

    onItemClick(action, commodity) {
        if (action == "edit") {
            window.location="#/editor/"+commodity.id
        } else if (action == "delete") {
            this.props.onConfirm(Language.textMap("Alert"), Language.textMap("Whether to ")+Language.textMap("delete")+Language.textMap("the commodity")+ "?", (()=>{
                HttpUtils.delete("/api/root/commodity/"+commodity.id,{},((resp)=>{
                    this.getCommodities()
                }).bind(this))
            }).bind(this))
        } else if (action == "detail") {
            console.log(commodity.detailIntro)
            this.setState({commodity:commodity})
            $("#commodityDetailModal #content")[0].innerHTML = marked(commodity.detailIntro)
            $("#commodityDetailModal #content a").each((i, element)=>{
                $(element).attr("target", "_blank")
            })
            $("#commodityDetailModal").modal("show")
        }
    }

    render() {
        return (
            <div className="container" style={{margin:"10px auto"}}>
                <div className="panel panel-default" style={{width:"90%",margin:"0px auto 10px"}}>
                    <div className="panel-heading clearfix">
                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">编号</span></div>
                                <input className="form-control" type="number" placeholder="请输入编号"/>
                            </div>
                        </div>

                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">标题</span></div>
                                <input className="form-control" type="text" placeholder="请输入标题"/>
                            </div>
                        </div>
                        
                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">型号</span></div>
                                <input className="form-control" type="text" placeholder="请输入型号"/>
                            </div>
                        </div>

                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">分类</span></div>
                                <div className="dropdown" style={{width:"100%"}}>
                                    <button className="btn btn-default dropdown-toggle netstore-table" type="button" id="dropdownMenu1" data-toggle="dropdown" style={{width: "100%", borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px", textAlign:"left"}}>
                                        <div className="netstore-table-cell" style={{width:"99%"}}>Dropdown</div>
                                        <div className="netstore-table-cell" style={{width:"1%"}}><span className="caret"></span></div>
                                    </button>
                                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                                        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
                                        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
                                        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
                                        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                                <button type="button" className="btn btn-default pull-right" style={{width:"100px"}}><span className="glyphicon glyphicon-search"></span>查询</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-10 col-md-offset-1">
                    <ListTitle commodityTotal={this.state.totalNum}></ListTitle>
                    <CommodityList commodities={this.state.commodities} onItemClick={this.onItemClick.bind(this)}></CommodityList>
                </div>

                <div className="modal fade" id="commodityDetailModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">{this.state.commodity.title}</h4>
                            </div>
                            <div className="modal-body">
                                <div id="content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
