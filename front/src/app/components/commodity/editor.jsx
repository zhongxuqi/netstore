import React from 'react'

import HttpUtils from '../../utils/http.jsx'

import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'

export default class CommodityEditor extends React.Component {
    constructor(props) {
        super(props)
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
        $.ajax({
            type: "POST",
            url: "/api/root/upload_image",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: (resp) => {
                $("#imageview").attr("src", resp.imageUrl)
            },
            error: (resp) => {
                HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            },
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
                                    <div className="form-group">
                                        <label>商品编号</label>
                                        <input type="number" className="form-control" placeholder="请输入编号"/>
                                    </div>
                                    <div className="form-group">
                                        <label>标题</label>
                                        <input type="text" className="form-control" placeholder="请输入标题"/>
                                    </div>
                                    <div className="form-group">
                                        <label>图片</label>
                                        <input type="file" id="thumbnailImg" onChange={this.onSelectImg.bind(this)} style={{display:"none"}}/>
                                        <a className="thumbnail" onClick={()=>{$("#thumbnailImg").click()}} style={{minHeight:"50px"}}>
                                            <img id="imageview"/>
                                        </a>
                                    </div>
                                    <div className="form-group">
                                        <label>价格</label>
                                        <input type="number" className="form-control" placeholder="请输入价格"/>
                                    </div>
                                    <div className="form-group">
                                        <label>型号</label>
                                        <input type="text" className="form-control" placeholder="请输入型号"/>
                                    </div>
                                    <div className="form-group">
                                        <label>分类</label>
                                        <input type="text" className="form-control" placeholder="请输入分类"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <MarkdownEditor ref="editor" onChange={((value)=>{
                        }).bind(this)}></MarkdownEditor>
                    </div>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-success pull-right" style={{margin:"10px"}}>提交</button>
                    <button type="button" className="btn btn-warning pull-right" style={{margin:"10px"}}>取消</button>
                </div>
            </div>
        )
    }
}
