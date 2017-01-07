package config

import (
	"zhongxuqi/netstore/app/server/handler"
	"zhongxuqi/netstore/model"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// InitDB init the db env
func InitDB(mainHander *handler.MainHandler) {
	sess, err := mgo.Dial(mainHander.Config.DBConfig.Host)
	if err != nil {
		panic(err)
	}

	// do login
	if len(mainHander.Config.DBConfig.User) > 0 {
		err = sess.DB("admin").Login(mainHander.Config.DBConfig.User, mainHander.Config.DBConfig.Password)
		if err != nil {
			panic(err)
		}
	}

	// init db
	mainHander.AppConfColl = sess.DB(mainHander.Config.DBConfig.DBName).C(APPNAME)
	mainHander.AppConfColl.Upsert(bson.M{"app": APPNAME}, bson.M{"$set": bson.M{"version": VERSION}})

	appConf := model.AppConfig{}
	err = mainHander.AppConfColl.Find(&bson.M{"app": APPNAME}).One(&appConf)
	if err != nil {
		panic(err)
	}

	mainHander.CommodityColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.CommodityColl)
	mainHander.BannerColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.BannerColl)
}
