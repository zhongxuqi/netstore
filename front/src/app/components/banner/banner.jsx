import React from 'react'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

export default class Banner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [],
            currBanner: {
                imageUrl: "",
                index: 0,
                commodityIndex: 0,
            },
            isSubmit: false,
            currCommodity: null,
            isLoading: false,
        }
    }

    componentDidMount() {
        this.getBanners()
    }

    getBanners() {
        this.setState({
            isLoading: true,
            banners: [],
        })
        HttpUtils.get("/openapi/banners", {}, ((resp)=>{
            if (resp.banners == null) resp.banners = []
            this.setState({banners: resp.banners})
        }).bind(this), null, (()=>{
            this.setState({isLoading:false})
        }).bind(this))
    }

    modalBanner(banner) {
        let copy = {}
        Object.assign(copy, banner)
        if (banner != null) {
            this.state.currBanner = copy
            this.setState({isSubmit:true})
            this.checkCommodityIndex()
        } else {
            this.setState({isSubmit:false})
            this.setState({currBanner: {
                imageUrl:"",
                index:0,
                commodityIndex:0,
            }})
        }

        $("#bannerModal").modal("show")
    }

    updateCurrBanner(attrName, event) {
        if (attrName == "commodityIndex") {
            this.state.currBanner[attrName] = parseInt(event.target.value)
        } else {
            this.state.currBanner[attrName] = event.target.value
        }
        this.setState({})
        this.checkCommodityIndex()
    }

    checkCommodityIndex() {
        let commodityIndex = this.state.currBanner.commodityIndex
        if (commodityIndex <= 0) {
            return
        }

        HttpUtils.get("/openapi/commodity_byindex/"+commodityIndex, {}, ((resp)=>{
            this.setState({
                currCommodity: resp.commodity,
                currCommodityTitle: resp.commodity.title,
            })
        }).bind(this), ((resp)=>{
            this.setState({
                currCommodity: null
            })
        }).bind(this))
    }
    
    onSelectImg() {
        let imagefile = document.getElementById("bannerImageFile").files[0]

        if (imagefile == null) {
            HttpUtils.alert("请选择图片")
            return
        } else if (!(/\.(png|jpeg|jpg)$/.test(imagefile.name))) {
            HttpUtils.alert("所选文件不是图片")
            return
        }
        
        let formData = new FormData()
        formData.append("imagefile", imagefile)
        HttpUtils.postFile("/api/root/upload_image", formData, ((resp)=>{
            this.state.currBanner.imageUrl = resp.imageUrl
            this.setState({})
        }).bind(this))
    }

    postBanner(banner) {
        this.setState({isSubmit:true})
        if (banner.commodityIndex == null || banner.commodityIndex <= 0) {
            HttpUtils.alert("请输入商品编号")
            return
        }
        if (banner.imageUrl == null || banner.imageUrl.length == 0) {
            HttpUtils.alert("请选择图片")
            return
        }

        let action
        if (banner.id == null || banner.id.length == 0) {
            banner.id = null
            action = "add"
        } else {
            action = "edit"
        }

        HttpUtils.post("/api/root/banner", {
            action: action,
            banner: banner,
        }, (resp)=>{
            this.getBanners()
            $("#bannerModal").modal("hide")
        })
    }

    deleteBanner(bannerId) {
        if (bannerId == null || bannerId.length == 0) {
            HttpUtils.alert("ID为空")
            return
        }

        this.props.onConfirm(Language.textMap("Alert"), Language.textMap("Whether to ")+Language.textMap("delete")+Language.textMap(" the banner")+"?", ()=>{
            HttpUtils.delete("/api/root/banner/"+bannerId, {}, ((resp)=>{
                this.getBanners()
            }).bind(this))
        })
    }

    render() {
        return (
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>商品编号</th>
                            <th>图片</th>
                            <th>次序</th>
                            <th><button type="button" className="btn btn-sm btn-default" onClick={this.modalBanner.bind(this, null)}>
                                <span className="glyphicon glyphicon-plus"></span>    
                                添加
                            </button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.banners.map((item, i)=>{
                                return (
                                    <tr key={i}>
                                        <td style={{verticalAlign:"middle"}}>{item.commodityIndex}</td>
                                        <td><img src={item.imageUrl} style={{height:"200px"}}/></td>
                                        <td style={{verticalAlign:"middle"}}>
                                            <select className="form-control" value={item.index}
                                                onChange={((event)=>{
                                                    let copyItem = {}
                                                    Object.assign(copyItem, item)
                                                    copyItem.index = parseInt(event.target.value)
                                                    this.postBanner(copyItem)
                                                }).bind(this)}>
                                                {
                                                    this.state.banners.map(((item, index)=>{
                                                        return (
                                                            <option key={index} value={index}>{index + 1}</option>
                                                        )
                                                    }).bind(this))
                                                }
                                            </select>
                                        </td>
                                        <td style={{verticalAlign: "middle"}}>
                                            <button type="button" className="btn btn-success" style={{margin:"10px"}} onClick={this.modalBanner.bind(this, item)}>
                                                <span className="glyphicon glyphicon-edit"></span>
                                                编辑
                                            </button>
                                            <button type="button" className="btn btn-danger" style={{margin:"10px"}} onClick={this.deleteBanner.bind(this, item.id)}>
                                                <span className="glyphicon glyphicon-trash"></span>
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <h1 style={{textAlign:"center",display:{true:"block", false:"none"}[this.state.isLoading]}}>
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    <span className="sr-only">加载中...</span>
                </h1>

                <div className="modal fade" id="bannerModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">Banner编辑</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal" role="form">
                                    <div className={["form-group", {
                                        true: {
                                            true:"has-feedback has-error", 
                                            false:"has-success has-feedback"
                                        }[this.state.currCommodity==null],
                                        false: ""
                                    }[this.state.isSubmit]].join(" ")}>
                                        <label className="col-sm-2 control-label">商品编号</label>
                                        <div className="col-sm-10">
                                            <input type="number" className="form-control" placeholder="请输入商品编号"
                                                value={this.state.currBanner.commodityIndex} 
                                                onChange={this.updateCurrBanner.bind(this, "commodityIndex")}/>
                                            <span className="glyphicon glyphicon-ok form-control-feedback" style={{
                                                display:{true:"inline",false:"none"}[this.state.isSubmit&&this.state.currCommodity!=null]
                                            }}></span>
                                            <span className="glyphicon glyphicon-remove form-control-feedback" style={{
                                                display:{true:"inline",false:"none"}[this.state.isSubmit&&this.state.currCommodity==null],
                                            }}></span>
                                            <label className="control-label" style={{
                                                display:{true:"inline",false:"none"}[this.state.isSubmit]
                                            }}>{{true:"无效商品编号",false:"标题: "+this.state.currCommodityTitle}[this.state.currCommodity==null]}</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">展示图片</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="请输入图片链接"
                                                value={this.state.currBanner.imageUrl}
                                                onChange={this.updateCurrBanner.bind(this, "imageUrl")}/>
                                            <input id="bannerImageFile" type="file" style={{display:"none"}}
                                                onChange={this.onSelectImg.bind(this)}/>
                                            <a className="thumbnail" style={{marginTop:"10px"}}
                                                onClick={()=>{$("#bannerImageFile").click()}}>
                                                <img src={this.state.currBanner.imageUrl}/>
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary" onClick={this.postBanner.bind(this, this.state.currBanner)}>提交</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
