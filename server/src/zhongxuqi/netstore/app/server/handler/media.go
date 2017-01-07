package handler

import (
	"encoding/json"
	"net/http"
	"zhongxuqi/netstore/model"
)

func (p *MainHandler) ActionUpLoadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(1024 * 1024 * 1024)
		if err != nil {
			http.Error(w, "parse multipart form error: "+err.Error(), 400)
			return
		}
		imageBody, _, err := r.FormFile("imagefile")
		if err != nil {
			http.Error(w, "form file \"imagefile\" error: "+err.Error(), 400)
			return
		}
		if p.Oss == nil {
			http.Error(w, "oss is not configured.", 500)
			return
		}
		imageUrl, err := p.Oss.SaveImage(&imageBody)
		if err != nil {
			http.Error(w, "save image error: "+err.Error(), 500)
			return
		}

		var respData struct {
			model.RespBase
			ImageUrl string `json:"imageUrl"`
		}
		respData.Status = 200
		respData.Message = "success"
		respData.ImageUrl = imageUrl

		respByte, _ := json.Marshal(&respData)
		w.Write(respByte)
		return
	}
	http.Error(w, "not found", 404)
}

func (p *MainHandler) ActionUpLoadAudio(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(1024 * 1024 * 1024)
		if err != nil {
			http.Error(w, "parse multipart form error: "+err.Error(), 400)
			return
		}
		audioBody, _, err := r.FormFile("audiofile")
		if err != nil {
			http.Error(w, "form file \"audiofile\" error: "+err.Error(), 400)
			return
		}
		if p.Oss == nil {
			http.Error(w, "oss is not configured.", 500)
			return
		}
		audioUrl, err := p.Oss.SaveAudio(&audioBody)
		if err != nil {
			http.Error(w, "save audio error: "+err.Error(), 500)
			return
		}

		var respData struct {
			model.RespBase
			AudioUrl string `json:"audioUrl"`
		}
		respData.Status = 200
		respData.Message = "success"
		respData.AudioUrl = audioUrl

		respByte, _ := json.Marshal(&respData)
		w.Write(respByte)
		return
	}
	http.Error(w, "not found", 404)
}

func (p *MainHandler) ActionUpLoadVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(1024 * 1024 * 1024)
		if err != nil {
			http.Error(w, "parse multipart form error: "+err.Error(), 400)
			return
		}
		videoBody, _, err := r.FormFile("videofile")
		if err != nil {
			http.Error(w, "form file \"videofile\" error: "+err.Error(), 400)
			return
		}
		if p.Oss == nil {
			http.Error(w, "oss is not configured.", 500)
			return
		}
		videoUrl, err := p.Oss.SaveVideo(&videoBody)
		if err != nil {
			http.Error(w, "save video error: "+err.Error(), 500)
			return
		}

		var respData struct {
			model.RespBase
			VideoUrl string `json:"videoUrl"`
		}
		respData.Status = 200
		respData.Message = "success"
		respData.VideoUrl = videoUrl

		respByte, _ := json.Marshal(&respData)
		w.Write(respByte)
		return
	}
	http.Error(w, "not found", 404)
}
