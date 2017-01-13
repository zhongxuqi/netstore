package handler

import (
	"encoding/json"
	"net/http"
	"zhongxuqi/netstore/model"

	"gopkg.in/mgo.v2/bson"
)

func (p *MainHandler) PublicActionCommodities(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "parse form error: "+err.Error(), 400)
			return
		}

		var params struct {
			Class string `json:"class" bson:"class"`
		}
		params.Class = r.Form.Get("class")

		filter := bson.M{}
		if params.Class != "" {
			filter["class"] = params.Class
		}

		var respBody struct {
			model.RespBase
			Commodities []model.Commodity `json:"commodities"`
			TotalNum    int               `json:"totalNum"`
		}
		err = p.CommodityColl.Find(filter).Sort("-modifyTime").All(&respBody.Commodities)
		if err != nil {
			http.Error(w, "find commodities error: "+err.Error(), 500)
			return
		}
		respBody.TotalNum = len(respBody.Commodities)
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

func (p *MainHandler) PublicActionCommodityClasses(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var classes []string
		p.CommodityColl.Find(nil).Distinct("class", &classes)

		var respBody struct {
			model.RespBase
			ClassMap map[string]int `json:"classMap"`
			TotalNum int            `json:"totalNum"`
		}

		respBody.ClassMap = make(map[string]int, 0)
		for _, class := range classes {
			n, err := p.CommodityColl.Find(&bson.M{"class": class}).Count()
			if err != nil {
				http.Error(w, "count class error: "+err.Error(), 500)
				return
			}
			respBody.ClassMap[class] = n
			respBody.TotalNum += n
		}

		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}
