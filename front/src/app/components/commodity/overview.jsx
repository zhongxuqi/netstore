import React from 'react';
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'

import CommodityGridItem from './grid_item.jsx'

export default class CommodityOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [],
            commodityMap: {},
            commodities: [],
            commodity: {},
            commodityClasses:[{
                className:"所有商品",
                classValue:"",
                classNum:0,
            }],
            currCommodityClassValue:"",
        }

        this.getBanners()
        this.getCommodityClasses()
        this.getCommodities()
    }

    componentDidMount() {
        $(".netstore-banner").css("height", document.body.clientWidth*2/5+"px")
        //this.initSideBar()
    }

    initSideBar() {
        $(window).scroll(()=>{
            let sideBarParentToTop = $("#sidebar").parent().offset().top - $(window).scrollTop()
            if (sideBarParentToTop >= 0) {
                $("#sidebar").removeClass("sidebar-active")
                $("#sidebar").css("width", "auto")
            }
            let sideBarToTop = $('#sidebar').offset().top - $(window).scrollTop()
            let width = $("#sidebar").width()
            if (sideBarToTop <= 10) {
                $("#sidebar").addClass("sidebar-active")
                $("#sidebar").css("width", width+"px")
            }
        })
    }

    getBanners() {
        HttpUtils.get("/openapi/banners", {}, ((resp)=>{
            if (resp.banners == null) resp.banners = []
            if (resp.commodityMap == null) resp.commodityMap = {}
            this.setState({
                banners: resp.banners,
                commodityMap: resp.commodityMap,
            })
        }).bind(this))
    }

    getCommodityClasses() {
        HttpUtils.get("/openapi/commodity_classes", {}, ((resp)=>{
            let commodityClasses = this.state.commodityClasses.slice(0, 1)
            commodityClasses[0].classNum = resp.totalNum
            for (let className of Object.keys(resp.classMap)) {
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
            }
            this.setState({commodityClasses: commodityClasses})
        }).bind(this))
    }
        
    getCommodities() {
        HttpUtils.get("/openapi/commodities", {
            class: this.state.currCommodityClassValue,
        }, ((resp)=>{
            if (resp.commodities == null) return
            this.setState({
                commodities: resp.commodities,
                totalNum: resp.totalNum,
            })
        }).bind(this))
    }

    detailCommodity(commodity) {
        this.setState({
            commodity:commodity,
        })
        $("#commodityDetailModal #content")[0].innerHTML = marked(commodity.detailIntro)
        $("#commodityDetailModal #content a").each((i, element)=>{
            $(element).attr("target", "_blank")
        })
        $("#commodityDetailModal").modal("show")
    }

    render() {
        return (
            <div style={{overflow:"hidden"}}>
                <div className="carousel slide netstore-banner" data-ride="carousel" style={{
                    overflow: "hidden",
                }}>
                    <ol className="carousel-indicators">
                        {
                            this.state.banners.map(((item, index)=>{
                                return (
                                    <li key={index} data-target="#carousel-example-generic" data-slide-to={index} 
                                    className={[{true:"active",false:""}[index==0]].join(" ")}
                                    onClick={(()=>{
                                        $('.carousel').carousel(index)
                                    }).bind(this)}></li>
                                
                                )
                            }).bind(this))
                        }
                    </ol>

                    <div className="carousel-inner" role="listbox" style={{height:"100%"}}>
                        {
                            this.state.banners.map(((item, index)=>{
                                return (
                                    <div key={index} className={["item", {true:"active",false:""}[index==0]].join(" ")} 
                                        style={{height: "100%", cursor:"pointer"}}
                                        onClick={this.detailCommodity.bind(this, this.state.commodityMap[item.commodityIndex])}>
                                        <img className="banner" src={item.imageUrl} style={{height:"100%"}}/>
                                        <div className="carousel-caption">
                                            <h3>{this.state.commodityMap[item.commodityIndex].title}</h3>
                                            <p>{this.state.commodityMap[item.commodityIndex].intro}</p>
                                        </div>
                                    </div>
                                    
                                )
                            }).bind(this))
                        }
                    </div>

                    <a className="left carousel-control" role="button" data-slide="prev" onClick={()=>{
                        $('.carousel').carousel('prev')
                    }}>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" role="button" data-slide="next" onClick={()=>{
                        $('.carousel').carousel('next')
                    }}>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                <div className="container netstore-body" style={{paddingTop:"10px"}}>
                    <div className="col-md-2 col-sm-2">
                        <ul id="sidebar" className="nav netstore-nav-list" role="tablist" style={{position:"relative"}}>
                            {
                                this.state.commodityClasses.map(((item, i)=>{
                                    return (
                                        <li key={i} role="presentation" 
                                          className={[{true:"active",false:""}[item.classValue==this.state.currCommodityClassValue]].join(" ")}
                                          style={{
                                              position:"relative",
                                              borderRadius: {
                                                  true:"0px", 
                                                  false: {
                                                      true:"6px 6px 0px 0px",
                                                      false:"0px 0px 6px 6px"
                                                  }[i==0],
                                              }[i!=0&&i!=this.state.commodityClasses.length-1],
                                              borderWidth: {
                                                  true: "1px",
                                                  false: "1px 1px 0px 1px",
                                              }[i==this.state.commodityClasses.length-1],
                                          }}>
                                            <a onClick={(()=>{
                                                this.state.currCommodityClassValue = item.classValue
                                                this.setState({})
                                                this.getCommodities()
                                            }).bind(this)} className="netstore-table">
                                                <div className="netstore-table-cell" style={{width:"99%", paddingLeft:"5px"}}>
                                                    {item.className}
                                                </div>
                                                <div className="netstore-table-cell">
                                                    <i className="fa fa-chevron-right"></i>
                                                </div>
                                            </a>

                                            <div className="class-num">
                                                <span>{item.classNum}</span>
                                            </div>
                                        </li>
                                    )
                                }).bind(this))
                            }
                        </ul>
                    </div>
                    <div className="col-md-10 col-sm-10" onLoad={()=>{
                        $(".grid-item-image").css("height", $(".grid-item-image")[0].clientWidth+"px")
                    }}>
                        {
                            this.state.commodities.map((commodity, index)=>{
                                return (
                                    <div className="col-md-3 col-sm-4" key={index} style={{padding:"0px 10px"}}>
                                        <CommodityGridItem onItemClick={this.detailCommodity.bind(this, commodity)} commodity={commodity}></CommodityGridItem>
                                    </div>
                                )
                            })
                        }
                    </div>
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
