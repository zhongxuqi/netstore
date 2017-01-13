package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
	"zhongxuqi/netstore/errors"
	"zhongxuqi/netstore/model"
	"zhongxuqi/netstore/utils"

	"gopkg.in/mgo.v2/bson"
)

func (p *MainHandler) ActionCommodities(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "parse form error: "+err.Error(), 400)
			return
		}

		var params struct {
			index    int    `json:"index" bson:"index"`
			title    string `json:"title" bson:"title"`
			SubClass string `json:"subClass" bson:"subClass"`
			Class    string `json:"class" bson:"class"`
		}
		params.index, _ = strconv.Atoi(r.Form.Get("index"))
		params.title = r.Form.Get("title")
		params.SubClass = r.Form.Get("subClass")
		params.Class = r.Form.Get("class")

		filter := bson.M{}
		if params.index != 0 {
			filter["index"] = params.index
		}
		if params.title != "" {
			filter["title"] = bson.M{
				"$regex": params.title,
			}
		}
		if params.SubClass != "" {
			filter["subClass"] = bson.M{
				"$regex": params.SubClass,
			}
		}
		if params.Class != "" {
			filter["class"] = params.Class
		}

		var respBody struct {
			model.RespBase
			Commodities []model.Commodity `json:"commodities"`
			TotalNum    int               `json:"totalNum"`
		}
		err = p.CommodityColl.Find(&filter).Sort("-modifyTime").All(&respBody.Commodities)
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

func (p *MainHandler) ActionCommodity(w http.ResponseWriter, r *http.Request) {
	var commodityId string
	if r.Method != http.MethodPost {
		cmds := strings.Split(r.URL.Path, "/")
		if len(cmds) < 5 {
			http.Error(w, errors.ERROR_EMPTY_ID.Error(), 400)
			return
		}
		commodityId = cmds[4]
		if !bson.IsObjectIdHex(commodityId) {
			http.Error(w, errors.ERROR_INVAIL_ID.Error(), 400)
			return
		}
	}

	if r.Method == http.MethodGet {
		var respBody struct {
			model.RespBase
			Commodity model.Commodity `json:"commodity"`
		}
		err := p.CommodityColl.Find(bson.M{"_id": bson.ObjectIdHex(commodityId)}).One(&respBody.Commodity)
		if err != nil {
			http.Error(w, "find commodity error: "+err.Error(), 500)
			return
		}

		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	} else if r.Method == http.MethodPost {
		var reqData struct {
			Action    string          `json:"action"`
			Commodity model.Commodity `json:"commodity"`
		}
		err := utils.ReadReq2Struct(r, &reqData)
		if err != nil {
			http.Error(w, "read request params error: "+err.Error(), 400)
			return
		}

		commodityByte, _ := bson.Marshal(&reqData.Commodity)
		commodityBson := make(bson.M, 0)
		err = bson.Unmarshal(commodityByte, &commodityBson)
		if err != nil {
			http.Error(w, "commodity byte Unmarshal error: "+err.Error(), 500)
			return
		}

		var respBody struct {
			model.RespBase
			CommodityId bson.ObjectId `json:"commodityId"`
		}
		if reqData.Action == "add" {
			delete(commodityBson, "_id")
			commodityBson["index"], err = p.GenerateCommodityIndex()
			if err != nil {
				http.Error(w, "GenerateCommodityIndex error: "+err.Error(), 500)
				return
			}
			commodityBson["modifyTime"] = time.Now().Unix()
			err = p.CommodityColl.Insert(commodityBson)
			if err != nil {
				http.Error(w, "commodity insert error: "+err.Error(), 500)
				return
			}

			var commodity model.Commodity
			err = p.CommodityColl.Find(commodityBson).One(&commodity)
			if err != nil {
				http.Error(w, "find commodity error: "+err.Error(), 500)
				return
			}
			respBody.CommodityId = commodity.ID
		} else if reqData.Action == "edit" {
			respBody.CommodityId = commodityBson["_id"].(bson.ObjectId)
			delete(commodityBson, "_id")
			delete(commodityBson, "index")
			p.CommodityColl.Update(bson.M{"_id": respBody.CommodityId}, bson.M{"$set": commodityBson})
		}

		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	} else if r.Method == http.MethodDelete {
		err := p.CommodityColl.Remove(bson.M{"_id": bson.ObjectIdHex(commodityId)})
		if err != nil {
			http.Error(w, "remove commodity error: "+err.Error(), 500)
			return
		}

		respByte, _ := json.Marshal(model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(respByte)
		return
	}

	http.Error(w, "Not Found", 404)
}
