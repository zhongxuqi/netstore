package local

import (
	"errors"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"
	"zhongxuqi/netstore/model"
	"zhongxuqi/netstore/utils"

	"gopkg.in/mgo.v2/bson"
)

const (
	imagePath = "../media/lowtea_img"
	audioPath = "../media/lowtea_audio"
	videoPath = "../media/lowtea_video"
)

type LocalOss struct {
}

func NewOss(handler *http.ServeMux, cfg *model.OSSConfig) (ret *LocalOss) {
	ret = &LocalOss{}
	ret.InitOss(handler, cfg)
	return
}

func (p *LocalOss) InitOss(handler *http.ServeMux, cfg *model.OSSConfig) {

	// init media dir
	var dirInfo os.FileInfo
	var err error

	// init img dir
	dirInfo, err = os.Stat(imagePath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(imagePath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(imagePath + " is not a directionary"))
		}
	}

	// init audio dir
	dirInfo, err = os.Stat(audioPath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(audioPath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(audioPath + " is not a directionary"))
		}
	}

	// init video dir
	dirInfo, err = os.Stat(videoPath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(videoPath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(videoPath + "is not a directionary"))
		}
	}

	// init img handler
	imgFileHandler := http.FileServer(http.Dir("../media"))
	handler.HandleFunc("/lowtea_img/", func(w http.ResponseWriter, r *http.Request) {
		imgFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	// init audio handler
	audioFileHandler := http.FileServer(http.Dir("../media"))
	handler.HandleFunc("/lowtea_audio/", func(w http.ResponseWriter, r *http.Request) {
		audioFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	// init video handler
	videoFileHandler := http.FileServer(http.Dir("../media"))
	handler.HandleFunc("/lowtea_video/", func(w http.ResponseWriter, r *http.Request) {
		videoFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})
}

func (p *LocalOss) SaveImage(imageBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var imagefile *os.File
	imagefile, err = os.Create("../media/lowtea_img/" + filename)
	if err != nil {
		return
	}
	var imageByte []byte
	imageByte, err = ioutil.ReadAll(*imageBody)
	if err != nil {
		return
	}
	_, err = imagefile.Write(imageByte)
	if err != nil {
		return
	}

	url = "/lowtea_img/" + filename
	return
}

func (p *LocalOss) SaveAudio(audioBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var audiofile *os.File
	audiofile, err = os.Create("../media/lowtea_audio/" + filename)
	if err != nil {
		return
	}
	var audioByte []byte
	audioByte, err = ioutil.ReadAll(*audioBody)
	if err != nil {
		return
	}
	_, err = audiofile.Write(audioByte)
	if err != nil {
		return
	}

	url = "/lowtea_audio/" + filename
	return
}

func (p *LocalOss) SaveVideo(videoBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var videofile *os.File
	videofile, err = os.Create("../media/lowtea_video/" + filename)
	if err != nil {
		return
	}
	var videoByte []byte
	videoByte, err = ioutil.ReadAll(*videoBody)
	if err != nil {
		return
	}
	_, err = videofile.Write(videoByte)
	if err != nil {
		return
	}

	url = "/lowtea_video/" + filename
	return
}
