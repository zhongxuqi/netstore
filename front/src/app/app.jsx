import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import marked from 'marked'
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

import './app.less'

import HttpUtils from './utils/http.jsx'
import Language from './language/language.jsx'

import CommodityOverView from './components/commodity/overview.jsx'
import Footer from './components/footer/footer.jsx'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmModal: {
                title: "",
                message: "",
            },
            rootEmail: "",
            rootInfo: {
                phone: "",
                address: "",
            }
        }

        HttpUtils.get("/openapi/rootinfo",{},((resp)=>{
            this.setState({rootInfo: resp.user})
        }).bind(this))
    }

    onConfirm(title, message, callback, cancelCallback) {
        $("#confirmModal").on("show.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").on("click", () => {
                if (callback != undefined) callback()
                $("#confirmModal #confirmAffirmBtn").off("click")
                $("#confirmModal").modal("hide")
            })
            
            $("#confirmModal #confirmCancelBtn").on("click", () => {
                if (cancelCallback != undefined) cancelCallback()
                $("#confirmModal #confirmCancelBtn").off("click")
                $("#confirmModal").modal("hide")
            })
        })
        $("#confirmModal").on("hide", () => {
            $("#confirmModal #confirmAffirmBtn").off("click")
        })
        $("#confirmModal").modal("show")
        this.setState({
            confirmModal: {
                title: title,
                message: message,
            }
        })
    
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                <div style={{position:'absolute', zIndex: "10", marginTop:"15px", width: "100%"}}>
                    <div className="container netstore-table" style={{margin: "0px auto", color:"white"}}>
                        <h3 className="netstore-table-cell" style={{width:"99%", cursor:"pointer"}}
                            onClick={()=>{window.location="/admin.html?lang="+Language.currLang.short}}>
                            <span className="label label-default netstore-shopname">Shop Name</span>
                        </h3>
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                                {Language.currLang.value}
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" style={{left:"auto", right:"0px"}}>
                                {
                                    Language.languages.map((item)=>{
                                        return (
                                            <li role="presentation"><a role="menuitem" href={"?lang="+item.short}>{item.value}</a></li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="clearfix">
                    {
                        React.cloneElement(this.props.children, {
                            onConfirm: this.onConfirm.bind(this),
                        })
                    }
                </div>

                <Footer address={this.state.rootInfo.address} phone={this.state.rootInfo.phone}></Footer>
                
                <div id="confirmModal" className="modal fade bs-example-modal-sm" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title">{this.state.confirmModal.title}</h4>
                            </div>
                            <div className="modal-body">
                                <p>{this.state.confirmModal.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button id="confirmCancelBtn" type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                <button id="confirmAffirmBtn" type="button" className="btn btn-primary">确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={CommodityOverView}/>
    </Route>
  </Router>
), document.getElementById('app'));
