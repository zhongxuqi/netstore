package config

import (
	"zhongxuqi/netstore/app/server/handler"
	"zhongxuqi/netstore/oss"
)

func InitOss(mainHandler *handler.MainHandler) {
	mainHandler.Oss = oss.NewOss(mainHandler.Mux, &mainHandler.Config.OssConfig)
}
