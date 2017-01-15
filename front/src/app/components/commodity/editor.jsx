import React from 'react'

import Language from '../../language/language.jsx'
import HttpUtils from '../../utils/http.jsx'

import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'

export default class CommodityEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasSubmit: false,
            commodity: {
                title: "",
                imageUrl: "",
                intro: "",
                price: 0,
                class: "",
                subClass: "",
                detailIntro: "",
            },
            classes: [],
        }
        if (this.props.routeParams != null && this.props.routeParams.id != null && this.props.routeParams.id.length > 0) {
            HttpUtils.get("/api/root/commodity/"+this.props.routeParams.id,{},((resp)=>{
                this.refs.editor.setValue(resp.commodity.detailIntro)
                this.setState({
                    commodity: resp.commodity,
                })
            }).bind(this),(resp)=>{
                HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            })
        }

        HttpUtils.get("/openapi/commodity_classes", {}, ((resp)=>{
            let classes = []
            for (let key in resp.classMap) {
                classes.push(key)
            }
            this.setState({classes: classes})
            $("#commodity-class").typeahead({
                source: classes,
            })
        }).bind(this))
    }

    componentDidMount() {
        this.refs.editor.setValue(this.state.commodity.detailIntro)
    }

    onSelectImg() {
        let imagefile = document.getElementById("thumbnailImg").files[0]

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
            this.state.commodity.imageUrl = resp.imageUrl
            this.setState({})
        }).bind(this))
    }

    submit() {
        console.log(this.state.commodity)
        this.setState({hasSubmit: true})
        if (this.state.commodity.title.length == 0) {
            HttpUtils.alert("标题不能为空")
            return
        }
        if (this.state.commodity.imageUrl.length == 0) {
            HttpUtils.alert("图片不能为空")
            return
        }
        if (this.state.commodity.intro.length == 0) {
            HttpUtils.alert("简介不能为空")
            return
        }
        if (this.state.commodity.price <= 0) {
            HttpUtils.alert("价格不能小于等于0")
            return
        }
        if (this.state.commodity.subClass.length == 0) {
            HttpUtils.alert("型号不能为空")
            return
        }
        if (this.state.commodity.class.length == 0) {
            HttpUtils.alert("分类不能为空")
            return
        }
        let action = "add"
        if (this.state.commodity.id != null && this.state.commodity.id.length > 0) {
            action = "edit"
        }
        HttpUtils.post("/api/root/commodity", {
            action: action,
            commodity: this.state.commodity,
        }, ((resp)=>{
            this.state.commodity.id = resp.commodityId
            this.setState({})
            HttpUtils.notice("提交成功")
            setTimeout(()=>{
                window.location.hash = "#/"
            }, 500)
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    onClickCancel() {
        this.props.onConfirm("警告", "确认放弃修改?", ()=>{
            window.location.hash = "#/"
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row border-bottom">
                    <div className="col-md-4" style={{padding:"10px 0px 0px 10px"}}>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <form role="form">
                                    <div className={["form-group has-feedback", {true:"has-error", false:""}[this.state.commodity.title.length==0&&this.state.hasSubmit]].join(" ")}>
                                        <label>标题</label>
                                        <input type="text" className="form-control" placeholder="请输入标题" value={this.state.commodity.title} onChange={((event)=>{
                                            this.state.commodity.title = event.target.value
                                            this.setState({})
                                        }).bind(this)}/>
                                        <span className="glyphicon glyphicon-remove form-control-feedback" style={{display:{true:"inline",false:"none"}[this.state.commodity.title.length==0&&this.state.hasSubmit]}}></span>
                                    </div>
                                    <div className="form-group">
                                        <label>图片</label>
                                        <input type="file" id="thumbnailImg" onChange={this.onSelectImg.bind(this)} style={{display:"none"}}/>
                                        <a className="thumbnail" onClick={()=>{$("#thumbnailImg").click()}}>
                                            <img src={this.state.commodity.imageUrl}/>
                                        </a>
                                    </div>
                                    <div className="form-group">
                                        <label>简介</label>
                                        <textarea type="text" className="form-control" placeholder="请输入简介" value={this.state.commodity.intro} onChange={((event)=>{
                                            this.state.commodity.intro = event.target.value
                                            this.setState({})
                                        }).bind(this)}></textarea>
                                    </div>
                                    <div className={["form-group has-feedback", {true:"has-error", false:""}[this.state.commodity.price<=0&&this.state.hasSubmit]].join(" ")}>
                                        <label>价格</label>
                                        <input type="number" step="0.01" className="form-control" placeholder="请输入价格" value={this.state.commodity.price} onChange={((event)=>{
                                            this.state.commodity.price = parseFloat(event.target.value)
                                            this.setState({})
                                        }).bind(this)}/>
                                        <span className="glyphicon glyphicon-remove form-control-feedback" style={{display:{true:"inline",false:"none"}[this.state.commodity.price<=0&&this.state.hasSubmit]}}></span>
                                    </div>
                                    <div className={["form-group has-feedback", {true:"has-error", false:""}[this.state.commodity.subClass.length==0&&this.state.hasSubmit]].join(" ")}>
                                        <label>型号</label>
                                        <input type="text" className="form-control" placeholder="请输入型号" value={this.state.commodity.subClass} onChange={((event)=>{
                                            this.state.commodity.subClass = event.target.value
                                            this.setState({})
                                        }).bind(this)}/>
                                        <span className="glyphicon glyphicon-remove form-control-feedback" style={{display:{true:"inline",false:"none"}[this.state.commodity.subClass.length==0&&this.state.hasSubmit]}}></span>
                                    </div>
                                    <div className={["form-group has-feedback", {true:"has-error", false:""}[this.state.commodity.class.length==0&&this.state.hasSubmit]].join(" ")}>
                                        <label>分类</label>
                                        <input id="commodity-class" type="text" className="form-control" placeholder="请输入分类" value={this.state.commodity.class} onChange={((event)=>{
                                            this.state.commodity.class = event.target.value
                                            this.setState({})
                                        }).bind(this)}/>
                                        <span className="glyphicon glyphicon-remove form-control-feedback" style={{display:{true:"inline",false:"none"}[this.state.commodity.class.length==0&&this.state.hasSubmit]}}></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <MarkdownEditor ref="editor" onChange={((value)=>{
                            this.state.commodity.detailIntro = value
                            this.setState({})
                        }).bind(this)}></MarkdownEditor>
                    </div>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-success pull-right" style={{margin:"10px"}} onClick={this.submit.bind(this)}>提交</button>
                    <button type="button" className="btn btn-warning pull-right" style={{margin:"10px"}} onClick={this.onClickCancel.bind(this)}>取消</button>
                </div>
            </div>
        )
    }
}
