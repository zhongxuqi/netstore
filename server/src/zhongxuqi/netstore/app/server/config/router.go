package config

import (
	"fmt"
	"net/http"
	"time"

	"zhongxuqi/netstore/app/server/handler"
	"zhongxuqi/netstore/utils"
)

// InitRouter init the router of server
func InitRouter(mainHandler *handler.MainHandler) {

	//---------------------------------
	//
	// init openapi handlers
	//
	//---------------------------------
	openAPIHandler := http.NewServeMux()
	openAPIHandler.HandleFunc("/openapi/login", mainHandler.Login)
	openAPIHandler.HandleFunc("/openapi/logout", mainHandler.Logout)
	openAPIHandler.HandleFunc("/openapi/rootinfo_email", mainHandler.ActionRootEmail)
	openAPIHandler.HandleFunc("/openapi/commodities", mainHandler.PublicActionCommodities)
	openAPIHandler.HandleFunc("/openapi/commodity_classes", mainHandler.PublicActionCommodityClasses)
	openAPIHandler.HandleFunc("/openapi/banners", mainHandler.PublicActionBanners)
	openAPIHandler.HandleFunc("/openapi/rootinfo", mainHandler.PublicActionRootInfo)
	openAPIHandler.HandleFunc("/openapi/commodity_byindex/", mainHandler.PublicActionCommodityByIndex)
	mainHandler.Mux.HandleFunc("/openapi/", func(w http.ResponseWriter, r *http.Request) {
		openAPIHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	//---------------------------------
	//
	// init api handlers
	//
	//---------------------------------
	apiHandler := http.NewServeMux()
	rootHandler := http.NewServeMux()

	// setup /api/ handler
	mainHandler.Mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {

		// check cookie
		err := mainHandler.CheckSession(w, r)
		if err != nil {
			http.Error(w, "[Handle /api/user/] "+err.Error(), 400)
			return
		}

		apiHandler.ServeHTTP(w, r)

		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	// setup /api/root/ handler
	rootHandler.HandleFunc("/api/root/self", mainHandler.ActionSelf)
	rootHandler.HandleFunc("/api/root/upload_image", mainHandler.ActionUpLoadImage)
	rootHandler.HandleFunc("/api/root/upload_audio", mainHandler.ActionUpLoadAudio)
	rootHandler.HandleFunc("/api/root/upload_video", mainHandler.ActionUpLoadVideo)
	rootHandler.HandleFunc("/api/root/commodity", mainHandler.ActionCommodity)
	rootHandler.HandleFunc("/api/root/commodity/", mainHandler.ActionCommodity)
	rootHandler.HandleFunc("/api/root/commodities", mainHandler.ActionCommodities)
	rootHandler.HandleFunc("/api/root/banner", mainHandler.ActionBanner)
	rootHandler.HandleFunc("/api/root/banner/", mainHandler.ActionBanner)
	apiHandler.HandleFunc("/api/root/", func(w http.ResponseWriter, r *http.Request) {

		// check permission
		// err := mainHandler.CheckRoot(r)
		// if err != nil {
		// 	http.Error(w, "check permission error: "+err.Error(), 400)
		// 	return
		// }

		rootHandler.ServeHTTP(w, r)
	})

	// init web file handler
	fileHandler := http.FileServer(http.Dir("../front/dist"))
	mainHandler.Mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})
}
