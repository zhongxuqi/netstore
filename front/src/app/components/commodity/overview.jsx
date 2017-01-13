import React from 'react';
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'

export default class CommodityOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commodities: [],
            commodity: {},
            commodityClasses:[{
                className:"所有商品",
                classValue:"",
                classNum:0,
            }],
            currCommodityClassValue:"",
        }

        this.getCommodityClasses()
        this.getCommodities()
    }

    componentDidMount() {
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
                <div className="carousel slide" data-ride="carousel" style={{
                    height: "450px",
                    overflow: "hidden",
                }}>
                    <ol className="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" className="active" onClick={(()=>{
                            $('.carousel').carousel(0)
                        }).bind(this)}></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1" onClick={(()=> {
                            $('.carousel').carousel(1)
                        }).bind(this)}></li>
                    </ol>

                    <div className="carousel-inner" role="listbox">
                        <div className="item active">
                            <img className="banner" src="http://pic.58pic.com/58pic/15/35/05/95258PICQnd_1024.jpg"/>
                            <div className="carousel-caption">
                                ...
                            </div>
                        </div>
                        <div className="item">
                            <img className="banner" src="http://img.sj33.cn/uploads/allimg/201005/20100509135319416.jpg"/>
                            <div className="carousel-caption">
                                ...
                            </div>
                        </div>
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

                <div className="container" style={{marginTop:"10px"}}>
                    <div className="col-md-2">
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
                    <div className="col-md-10" onLoad={()=>{
                        $(".grid-image-item").css("height", $(".grid-image-item")[0].clientWidth+"px")
                    }}>
                        {
                            this.state.commodities.map((commodity, index)=>{
                                return (
                                    <div className="col-md-3 col-sm-4" key={index} style={{padding:"0px 10px"}}>
                                        <div className="thumbnail hover-background" onClick={(()=>{
                                            this.detailCommodity(commodity)
                                        }).bind(this)} style={{padding:"0px", borderRadius:"0px"}}>
                                            <img className="grid-image-item" src={commodity.imageUrl} style={{"width":"100%"}}/>
                                            <div className="caption">
                                                <h3><span className="price-color">{commodity.price}</span></h3>
                                                <div className="netstore-table">
                                                    <h4 className="netstore-table-cell">{commodity.title}</h4>
                                                    <div className="netstore-table-cell"><span className="badge">{commodity.index}</span></div>
                                                </div>
                                                <p>{commodity.intro}</p>
                                            </div>
                                        </div>
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
