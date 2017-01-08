import React from 'react'

import HttpUtils from '../../utils/http.jsx'

import ListTitle from '../list_title/list_title.jsx'
import CommodityList from '../commodity_list/commodity_list.jsx'

export default class CommodityDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commodities: [],
            totalNum: 0,
        };
        this.getCommodities()
    }

    getCommodities() {
        HttpUtils.get("/api/root/commodities", {}, ((resp)=>{
            console.log(resp)
            if (resp.commodities == null) return
            this.setState({
                commodities: resp.commodities,
                totalNum: resp.totalNum,
            })
        }).bind(this))
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
                    <CommodityList commodities={this.state.commodities}></CommodityList>
                </div>
            </div>
        )
    }
}
