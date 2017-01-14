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
            filter: {
                index: 0,
                title: "",
                class: "",
                subClass: "",
            },
            commodityClasses: [],
            isLoading: false,
        };
        this.getCommodityClasses()
    }

    componentDidMount() {
        this.getCommodities()
    }

    getCommodities() {
        this.setState({
            isLoading: true,
            commodityClasses: [],
            totalNum: 0,
        })
        
        HttpUtils.get("/api/root/commodities", this.state.filter, ((resp)=>{
            if (resp.commodities == null) resp.commodities = []
            this.setState({
                commodities: resp.commodities,
                totalNum: resp.totalNum,
            })
        }).bind(this), null, (()=>{
            this.setState({
                isLoading: false,
            })
        }).bind(this))
    }
    
    getCommodityClasses() {
        HttpUtils.get("/openapi/commodity_classes", {}, ((resp)=>{
            let commodityClasses = [] 
            for (let className of Object.keys(resp.classMap)) {
                if (commodityClasses.length > 0) {
                    for (let i=0;i<commodityClasses.length;i++) {
                        if (resp.classMap[className] > commodityClasses[i].classNum) {
                            commodityClasses.splice(i, 0, {
                                className: className,
                                classValue: className,
                                classNum: resp.classMap[className],
                            })
                            break
                        } else if (i == commodityClasses.length - 1) {
                            commodityClasses.push({
                                className: className,
                                classValue: className,
                                classNum: resp.classMap[className],
                            })
                            break
                        }
                    }
                } else {
                    commodityClasses.push({
                        className: className,
                        classValue: className,
                        classNum: resp.classMap[className],
                    })
                }
            }
            this.setState({commodityClasses: commodityClasses})
        }).bind(this))
    }

    onItemClick(action, commodity) {
        if (action == "edit") {
            window.location="#/editor/"+commodity.id
        } else if (action == "delete") {
            this.props.onConfirm("警告", "是否删除该商品?", (()=>{
                HttpUtils.delete("/api/root/commodity/"+commodity.id,{},((resp)=>{
                    this.getCommodities()
                }).bind(this))
            }).bind(this))
        } else if (action == "detail") {
            this.setState({commodity:commodity})
            $("#commodityDetailModal #content")[0].innerHTML = marked(commodity.detailIntro)
            $("#commodityDetailModal #content a").each((i, element)=>{
                $(element).attr("target", "_blank")
            })
            $("#commodityDetailModal").modal("show")
        }
    }

    setFilter(filterName, event) {
        this.state.filter[filterName] = event.target.value
        this.setState({})
    }

    render() {
        return (
            <div className="container" style={{margin:"10px auto"}}>
                <div className="panel panel-default" style={{width:"90%",margin:"0px auto 10px"}}>
                    <div className="panel-heading clearfix">
                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">编号</span></div>
                                <input className="form-control" type="number" placeholder="请输入编号" value={this.state.index} onChange={this.setFilter.bind(this, "index")}/>
                            </div>
                        </div>

                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">标题</span></div>
                                <input className="form-control" type="text" placeholder="请输入标题" value={this.state.title} onChange={this.setFilter.bind(this, "title")}/>
                            </div>
                        </div>
                        
                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">型号</span></div>
                                <input className="form-control" type="text" placeholder="请输入型号" value={this.state.subClass} onChange={this.setFilter.bind(this, "subClass")}/>
                            </div>
                        </div>

                        <div className="form-group col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon"><span className="netstore-form-item-title">分类</span></div>
                                <div className="dropdown" style={{width:"100%"}}>
                                    <button className="btn btn-default dropdown-toggle netstore-table" type="button" id="dropdownMenu1" data-toggle="dropdown" style={{width: "100%", borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px", textAlign:"left"}}>
                                        <div className="netstore-table-cell" style={{width:"99%"}}>{{true:"所有分类",false:this.state.filter.class}[this.state.filter.class==""]}</div>
                                        <div className="netstore-table-cell" style={{width:"1%"}}><span className="caret"></span></div>
                                    </button>
                                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                                        <li role="presentation"><a role="menuitem" onClick={(()=>{
                                            this.state.filter.class = ""
                                            this.setState({})
                                        }).bind(this)}>所有分类</a></li>
                                        {
                                            this.state.commodityClasses.map(((item, i)=>{
                                                return (
                                                    <li key={i} role="presentation"><a role="menuitem" onClick={(()=>{
                                                        this.state.filter.class = item.className
                                                        this.setState({})
                                                    }).bind(this)}>{item.className}</a></li>
                                                )
                                            }).bind(this))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <button type="button" className="btn btn-default pull-right" style={{width:"100px"}} onClick={this.getCommodities.bind(this)}>
                                <span className="glyphicon glyphicon-search" style={{paddingRight:"7px"}}></span>查询
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-10 col-md-offset-1">
                    <ListTitle commodityTotal={this.state.totalNum}></ListTitle>
                    <CommodityList commodities={this.state.commodities} onItemClick={this.onItemClick.bind(this)}></CommodityList>
                    <h1 style={{textAlign:"center",display:{true:"block", false:"none"}[this.state.isLoading]}}>
                        <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                        <span className="sr-only">加载中...</span>
                    </h1>
                </div>

                <div className="modal fade" id="commodityDetailModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
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
