package model

import "gopkg.in/mgo.v2/bson"

type Commodity struct {
	ID          bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Index       int           `json:"index" bson:"index"`
	Title       string        `json:"title" bson:"title"`
	ImageUrl    string        `json:"imageUrl" bson:"imageUrl"`
	Intro       string        `json:"intro" bson:"intro"`
	Price       float32       `json:"price" bson:"price"`
	Class       string        `json:"class" bson:"class"`
	SubClass    string        `json:"subClass" bson:"subClass"`
	ModifyTime  int64         `json:"modifyTime" bson:"modifyTime"`
	DetailIntro string        `json:"detailIntro" bson:"detailIntro"`
}

type Banner struct {
	ID             bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	CommodityIndex uint          `json:"commodityIndex" bson:"commodityIndex"`
	ImageUrl       string        `json:"imageUrl" bson:"imageUrl"`
	Index          uint          `json:"index" bson:"index"`
}
