import React from 'react';
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'

export default class CommodityOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commodities: [],
            commodity: {},
        }

        this.getCommodities()
    }

    componentDidMount() {
        this.initSideBar()
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
        
    getCommodities() {
        HttpUtils.get("/openapi/commodities", {}, ((resp)=>{
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
                    <div className="col-md-3">
                        <ul id="sidebar" className="nav nav-pills nav-stacked" role="tablist">
                            <li role="presentation" className="active"><a>Home</a></li>
                            <li role="presentation"><a>Profile</a></li>
                            <li role="presentation"><a>Messages</a></li>
                        </ul>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            {
                                this.state.commodities.map((commodity, index)=>{
                                    return (
                                        <div className="col-sm-4 col-md-3" key={index}>
                                            <div className="thumbnail hover-background" onClick={(()=>{
                                                this.detailCommodity(commodity)
                                            }).bind(this)} style={{padding:"0px", borderRadius:"0px"}}>
                                                <img src={commodity.imageUrl} style={{height:"150px"}}/>
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
                </div>
                
                <div className="modal fade" id="commodityDetailModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
