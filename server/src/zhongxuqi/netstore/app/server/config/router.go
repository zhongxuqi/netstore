package config

import (
	"net/http"

	"zhongxuqi/netstore/app/server/handler"
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
	openAPIHandler.HandleFunc("/openapi/rootinfo", mainHandler.ActionRootEmail)
	openAPIHandler.HandleFunc("/openapi/commodities", mainHandler.PublicActionCommodities)
	mainHandler.Mux.HandleFunc("/openapi/", func(w http.ResponseWriter, r *http.Request) {
		openAPIHandler.ServeHTTP(w, r)
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
	})

	// setup /api/root/ handler
	rootHandler.HandleFunc("/api/root/self", mainHandler.ActionSelf)
	rootHandler.HandleFunc("/api/root/upload_image", mainHandler.ActionUpLoadImage)
	rootHandler.HandleFunc("/api/root/upload_audio", mainHandler.ActionUpLoadAudio)
	rootHandler.HandleFunc("/api/root/upload_video", mainHandler.ActionUpLoadVideo)
	rootHandler.HandleFunc("/api/root/commodity", mainHandler.ActionCommodity)
	rootHandler.HandleFunc("/api/root/commodity/", mainHandler.ActionCommodity)
	rootHandler.HandleFunc("/api/root/commodities", mainHandler.ActionCommodities)
	apiHandler.HandleFunc("/api/root/", func(w http.ResponseWriter, r *http.Request) {

		// check permission
		err := mainHandler.CheckRoot(r)
		if err != nil {
			http.Error(w, "check permission error: "+err.Error(), 400)
			return
		}

		rootHandler.ServeHTTP(w, r)
	})

	// init web file handler
	mainHandler.Mux.Handle("/", http.FileServer(http.Dir("../front/dist")))
}
