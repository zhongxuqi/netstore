package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"zhongxuqi/netstore/errors"
	"zhongxuqi/netstore/model"
	"zhongxuqi/netstore/utils"
)

// CheckRoot
func (p *MainHandler) CheckRoot(r *http.Request) (err error) {
	var accountCookie *http.Cookie
	accountCookie, err = r.Cookie("account")
	if err != nil {
		return
	}

	// check root
	if accountCookie.Value != model.ROOT {
		err = errors.ERROR_PERMISSION_DENIED
	}
	return
}

// Login do login
func (p *MainHandler) Login(w http.ResponseWriter, r *http.Request) {
	var dataStruct struct {
		ExpireTime int64  `json:"expireTime"`
		Sign       string `json:"sign"`
	}
	err := utils.ReadReq2Struct(r, &dataStruct)
	if err != nil {
		http.Error(w, "[Login] data read and unmarshal fail: "+err.Error(), 400)
		return
	}

	if dataStruct.ExpireTime < time.Now().Unix() {
		http.Error(w, "[Login] "+ERROR_TIME_EXPIRED.Error(), 400)
		return
	}

	err = p.checkSign(dataStruct.ExpireTime, dataStruct.Sign)
	if err != nil {
		http.Error(w, "check sign fail: "+err.Error(), 400)
		return
	}

	// if pass check sign, update session
	p.UpdateSession(w)

	var user model.User
	user = model.User{
		Role:     model.ROOT,
		Language: p.Config.RootLanguage,
	}

	var ret struct {
		model.RespBase
		User *model.User `json:"user"`
	}
	ret.Status = 200
	ret.Message = "success"
	ret.User = &user

	retStr, _ := json.Marshal(ret)
	w.Write(retStr)
}

// Logout do logout
func (p *MainHandler) Logout(w http.ResponseWriter, r *http.Request) {
	p.ClearSession(w)
	retStr, _ := json.Marshal(&model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
}
