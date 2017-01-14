package handler

import (
	"net/http"

	"encoding/json"
	"zhongxuqi/netstore/model"
)

// ActionSelf members action self
func (p *MainHandler) ActionSelf(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var ret struct {
			model.RespBase
			User model.User `json:"user"`
		}
		ret.User = model.User{
			Role:     model.ROOT,
			Language: p.Config.RootLanguage,
			Phone:    p.Config.RootPhone,
			Address:  p.Config.RootAddress,
		}

		ret.Status = 200
		ret.Message = "success"
		retbyte, _ := json.Marshal(ret)
		w.Write(retbyte)
		return
	}

	retStr, _ := json.Marshal(model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
	return
}
