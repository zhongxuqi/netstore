package model

const (
	LOCAL = "local"
	QINIU = "qiniu"
)

type AppConfig struct {
	App     string `json:"app" bson:"app"`
	Version string `json:"version" bson:"version"`
}

// Config env of the server
type Config struct {
	AppName      string `json:"app_name"`
	ServerAddr   string `json:"server_addr"`
	RootEmail    string `json:"root_email"`
	RootPhone    string `json:"root_phone"`
	RootAddress  string `json:"root_address"`
	RootPassword string `json:"root_password"`
	RootLanguage string `json:"root_language"`
	ShopName     string `json:"shopname"`
	ShopInfo     string `json:"shopinfo"`

	DBConfig        DBConfig  `json:"dbConfig"`
	OssConfig       OSSConfig `json:"ossConfig"`
	FlagExpiredTime int64     `json:"-"`
}

// DBConfig env of the db
type DBConfig struct {
	Host          string `json:"host"`
	User          string `json:"user"`
	Password      string `json:"password"`
	DBName        string `json:"dbname"`
	CommodityColl string `json:"commodityColl"`
	BannerColl    string `json:"bannerColl"`
}

type OSSConfig struct {
	OssProvider string `json:"ossProvider"`
}
