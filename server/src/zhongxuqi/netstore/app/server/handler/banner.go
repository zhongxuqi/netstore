package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"zhongxuqi/netstore/errors"
	"zhongxuqi/netstore/model"
	"zhongxuqi/netstore/utils"

	"gopkg.in/mgo.v2/bson"
)

var (
	BannerLock = sync.Mutex{}
)

func (p *MainHandler) PublicActionBanners(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			model.RespBase
			Banners []model.Banner `json:"banners"`
		}
		err := p.BannerColl.Find(nil).Sort("index").All(&respBody.Banners)
		if err != nil {
			http.Error(w, "find banners error: "+err.Error(), 500)
			return
		}
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

func (p *MainHandler) ActionBanner(w http.ResponseWriter, r *http.Request) {
	var bannerId string
	if r.Method != http.MethodPost {
		cmds := strings.Split(r.URL.Path, "/")
		if len(cmds) < 5 {
			http.Error(w, errors.ERROR_EMPTY_ID.Error(), 400)
			return
		}
		bannerId = cmds[4]
		if !bson.IsObjectIdHex(bannerId) {
			http.Error(w, errors.ERROR_INVAIL_ID.Error(), 400)
			return
		}
	}

	if r.Method == http.MethodGet {
		var respBody struct {
			model.RespBase
			Banner model.Banner `json:"banner"`
		}
		err := p.BannerColl.Find(&bson.M{"_id": bson.ObjectIdHex(bannerId)}).One(&respBody.Banner)
		if err != nil {
			http.Error(w, "find banner error: "+err.Error(), 500)
			return
		}
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	} else if r.Method == http.MethodDelete {
		BannerLock.Lock()
		defer BannerLock.Unlock()
		var banner model.Banner
		err := p.BannerColl.Find(&bson.M{"_id": bson.ObjectIdHex(bannerId)}).One(&banner)
		if err != nil {
			http.Error(w, "find banner error: "+err.Error(), 500)
			return
		}
		var startIndex = int(banner.Index)
		var endIndex int
		endIndex, err = p.BannerColl.Count()
		if err != nil {
			http.Error(w, "count banners error: "+err.Error(), 500)
			return
		}
		for i := startIndex + 1; i < endIndex; i++ {
			err = p.BannerColl.Update(&bson.M{"index": i}, &bson.M{"$inc": bson.M{"index": -1}})
			if err != nil {
				http.Error(w, "update banners error: "+err.Error(), 500)
				return
			}
		}
		p.BannerColl.RemoveAll(&bson.M{"_id": bson.ObjectIdHex(bannerId)})
		respByte, _ := json.Marshal(&model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(respByte)
		return
	} else if r.Method == http.MethodPost {
		BannerLock.Lock()
		defer BannerLock.Unlock()
		var reqData struct {
			Action string       `json:"action"`
			Banner model.Banner `json:"banner"`
		}
		err := utils.ReadReq2Struct(r, &reqData)
		if err != nil {
			http.Error(w, "read request body error: "+err.Error(), 500)
			return
		}

		bannerByte, _ := bson.Marshal(&reqData.Banner)
		bannerBson := make(bson.M, 0)
		err = bson.Unmarshal(bannerByte, &bannerBson)
		if err != nil {
			http.Error(w, "banner byte Unmarshal error: "+err.Error(), 500)
			return
		}

		if reqData.Action == "add" {
			delete(bannerBson, "_id")
			delete(bannerBson, "index")
			var n int
			n, err = p.BannerColl.Find(nil).Count()
			bannerBson["index"] = n
			err = p.BannerColl.Insert(&bannerBson)
			if err != nil {
				http.Error(w, "insert banner error: "+err.Error(), 500)
				return
			}
		} else if reqData.Action == "edit" {
			bannerId = bannerBson["_id"].(string)
			newIndex := bannerBson["index"].(uint)
			var oldBanner model.Banner
			err = p.BannerColl.FindId(bson.ObjectIdHex(bannerId)).One(&oldBanner)
			if err != nil {
				http.Error(w, "find old banner error: "+err.Error(), 500)
				return
			}
			oldIndex := oldBanner.Index
			if newIndex > oldIndex {
				for i := oldIndex + 1; i <= newIndex; i++ {
					err = p.BannerColl.Update(&bson.M{"index": i}, &bson.M{"$inc": bson.M{"index": -1}})
					if err != nil {
						http.Error(w, "update banners error: "+err.Error(), 500)
						return
					}
				}
			} else if newIndex < oldIndex {
				for i := newIndex; i < oldIndex; i++ {
					err = p.BannerColl.Update(&bson.M{"index": i}, &bson.M{"$inc": bson.M{"index": 1}})
					if err != nil {
						http.Error(w, "update banners error: "+err.Error(), 500)
						return
					}
				}
			}
			err = p.BannerColl.Update(&bson.M{"_id": bson.ObjectIdHex(bannerId)}, &bson.M{"$set": &bannerBson})
			if err != nil {
				http.Error(w, "update banner error: "+err.Error(), 500)
				return
			}
		}
		respByte, _ := json.Marshal(&model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}
