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

import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import HttpUtil from './utils/http.jsx'
import Language from './language/language.jsx'

import CommodityDashboard from './components/commodity/dashboard.jsx'
import Banner from './components/banner/banner.jsx'
import CommodityEditor from './components/commodity/editor.jsx'

import './admin.less';

export default class AdminMain extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabStatus: 'dashboard',
            userInfo: {},
            confirmModal: {
                title: "",
                message: "",
            },
            isShowNoBtn: false,
        }
        let sindex = window.location.hash.indexOf("#/")
        let status = window.location.hash.substring(sindex + 2)
        if (status.length == 0) {
            this.state.tabStatus = 'dashboard'
        } else {
            this.state.tabStatus = status
        }
        this.updateUserInfo()
    }

    updateUserInfo() {
        HttpUtil.get('/api/root/self', {}, ((resp) => {
            if (resp.user.language != Language.currLang.short && !(resp.user.language == "" && Language.currLang.short == "en")) {
                window.location = "?lang=" + resp.user.language
            }
            this.setState({
                userInfo: resp.user,
            })
        }).bind(this), ((data) => {
            window.location = "/login.html"
        }).bind(this))
    }

    onConfirm(title, message, callback, negativeCallback) {
        if (negativeCallback != undefined) {
            this.setState({isShowNoBtn: true})
        } else {
            this.setState({isShowNoBtn: false})
        }
        $("#confirmModal").off("show.bs.modal")
        $("#confirmModal").off("hide.bs.modal")
        $("#confirmModal").on("show.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").on("click", () => {
                if (callback != undefined) callback()
                $("#confirmModal #confirmAffirmBtn").off("click")
                $("#confirmModal").modal("hide")
            })
            
            $("#confirmModal #confirmNoBtn").on("click", () => {
                if (negativeCallback != undefined) negativeCallback()
                $("#confirmModal #confirmNoBtn").off("click")
                $("#confirmModal").modal("hide")
            })
        })
        $("#confirmModal").on("hide.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").off("click")
            $("#confirmModal #confirmNoBtn").off("click")
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
                <nav className="navbar navbar-default topbar" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">
                                <img alt="Brand" src="/favicon.ico" style={{height:"100%"}}/>
                            </a>
                        </div>

                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav btn-menu">
                                <li className={[{true:"active", false:""}[this.state.tabStatus=="dashboard"]].join(" ")}><a onClick={(()=>{
                                    this.setState({tabStatus:"dashboard"})
                                }).bind(this)} href="#/">商品管理</a></li>
                                <li className={[{true:"active", false:""}[this.state.tabStatus=="banner"]].join(" ")}><a onClick={(()=> {
                                    this.setState({tabStatus:"banner"})
                                }).bind(this)} href="#/banner">Banner管理</a></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right btn-menu">
                                <li><a href="#/editor" onClick={(()=>{
                                    this.setState({tabStatus:"editor"})
                                }).bind(this)}><span className="glyphicon glyphicon-plus"></span>添加商品</a></li>
                                <li className="dropdown">
                                    <a className="dropdown-toggle" data-toggle="dropdown">{Language.currLang.value} <span className="caret"></span></a>
                                    <ul className="dropdown-menu" role="menu">
                                        {
                                            Language.languages.map(((lang, i)=>{
                                                return <li key={i}><a onClick={(()=>{
                                                    window.location = "?lang=" + lang.short
                                                }).bind(this)}>{lang.value}</a></li>
                                            }).bind(this))
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div style={{padding:"0px", margin:"0px", height:'100%'}}>
                    {
                        React.cloneElement(this.props.children, {
                            userInfo: this.state.userInfo,
                            onConfirm: this.onConfirm.bind(this),
                            updateUserInfo: this.updateUserInfo.bind(this),
                        })
                    }
                </div>
                
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
                                <button id="confirmCancelBtn" type="button" className="btn btn-default" data-dismiss="modal">{Language.textMap("Cancel")}</button>
                                <button id="confirmNoBtn" type="button" className="btn btn-default" data-dismiss="modal" style={{color:"red", display:{true:"inline-block", false:"none"}[this.state.isShowNoBtn]}}>{Language.textMap("No")}</button>
                                <button id="confirmAffirmBtn" type="button" className="btn btn-primary">{Language.textMap("Yes")}</button>
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
    <Route path="/" component={AdminMain}>
      <IndexRoute component={CommodityDashboard}/>
      <Route path="banner" component={Banner}/>
      <Route path="editor" component={CommodityEditor}/>
      <Route path="editor/:id" component={CommodityEditor}/>
    </Route>
  </Router>
), document.getElementById('app'));
