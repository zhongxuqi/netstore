import React from 'react';
import { render } from 'react-dom';
import md5 from 'js-md5'

import HttpUtils from './utils/http.jsx'
import Language from './language/language.jsx'

import './login.less'

class LoginApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formState: 'login',
            loginPassword: '',
        }
        
        
        HttpUtils.get('/api/root/self', {}, ((resp) => {
            window.location = "/admin.html?lang="+resp.user.language
        }).bind(this), ((resp) => {
        }).bind(this))
    }

    handleStateChange(stateName, event) {
        let updates = {}
        updates[stateName] = event.target.value

        this.setState(updates)
    }

    onClickLoginBtn() {
            if (this.state.loginPassword.length > 0) {
            let password = this.state.loginPassword,
                expireTime = Math.floor(new Date().getTime() / 1000 + 60)
            let sign = md5.hex(password + expireTime)
            
            HttpUtils.post("/openapi/login", {
                expireTime: expireTime,
                sign: sign,
            }, (data) => {
                window.location = "/admin.html?lang="+data.user.language
            }, (data) => {
                HttpUtils.alert("["+data.status+"]: "+data.responseText)
            })
        }
    }

    render() {
        return (
            <div className="lowtea-login-container">
                <div className="lowtea-login-form">
                    <form className="clearfix" style={{display:{true: "block", false: "none"}[this.state.formState=="login"]}}>
                        <div className="form-group">
                            <label>{Language.textMap("Password")}</label>
                            <input type="password" className="form-control" value={this.state.loginPassword} onChange={this.handleStateChange.bind(this, "loginPassword")}/>
                        </div>
                        <button type="button" className="btn btn-success btn-block" style={{marginBottom:"10px"}} onClick={this.onClickLoginBtn.bind(this)}>{Language.textMap("Login In")}</button>
                        <button type="button" className="btn btn-primary btn-sm pull-left" onClick={()=>{
                            window.location="/?lang="+Language.currLang.short
                        }}>{Language.textMap("Guest")}</button>
                    </form>
                </div>
            </div>
        )
    }
}

render((
  <LoginApp></LoginApp>
), document.getElementById('app'));
