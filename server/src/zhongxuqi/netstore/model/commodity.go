package model

import "gopkg.in/mgo.v2/bson"

type Commodity struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	Title    string        `json:"title"`
	ImageUrl string        `json:"imageUrl"`
	Intro    string        `json:"intro"`
	Price    int           `json:"price"`
	Class    string        `json:"class"`
	SubClass string        `json:"subClass"`
}

type Banner struct {
	ID          bson.ObjectId `json:"id" bson:"_id"`
	CommodityId string        `json:"commodityId"`
	ImageUrl    string        `json:"imageUrl"`
}
