package handler

import (
	"net/http"
	"strconv"

	"gopkg.in/mgo.v2"

	"crypto/md5"
	"encoding/hex"
	"errors"
	"sync"
	"time"
	"zhongxuqi/netstore/config"
	"zhongxuqi/netstore/model"
	"zhongxuqi/netstore/oss"
)

var (
	ERROR_TIME_EXPIRED    = errors.New("time expired")
	ERROR_TOKEN_INVALID   = errors.New("token is invalid")
	ERROR_SESSION_INVALID = errors.New("session is invalid")
)

// MainHandler ...
type MainHandler struct {
	Mux           *http.ServeMux
	SessMap       map[string]int64
	SessMapMutex  *sync.Mutex
	Config        model.Config
	Oss           oss.OssIBase
	AppConfColl   *mgo.Collection
	CommodityColl *mgo.Collection
	BannerColl    *mgo.Collection
}

// New new MainHandler
func New() (handler *MainHandler) {
	handler = &MainHandler{
		Mux:          http.NewServeMux(),
		SessMap:      make(map[string]int64, 0),
		SessMapMutex: &sync.Mutex{},
	}

	// GC for session
	go func() {
		for {
			handler.clearSession()
			time.Sleep(5 * time.Minute)
		}
	}()
	return
}

func (p *MainHandler) clearSession() {
	p.SessMapMutex.Lock()
	keys := make([]string, 0)
	now := time.Now().Unix()
	for k, v := range p.SessMap {
		if v < now {
			keys = append(keys, k)
		}
	}
	for _, k := range keys {
		delete(p.SessMap, k)
	}
	p.SessMapMutex.Unlock()
}

// CheckSession check the session of request
func (p *MainHandler) CheckSession(w http.ResponseWriter, r *http.Request) (err error) {
	var tokenCookie *http.Cookie
	tokenCookie, err = r.Cookie("token")
	if err != nil {
		return
	}
	p.SessMapMutex.Lock()
	defer p.SessMapMutex.Unlock()
	if expireTime, ok := p.SessMap[tokenCookie.Value]; !ok || expireTime < time.Now().Unix() {
		err = ERROR_SESSION_INVALID
		return
	} else if expireTime-time.Now().Unix() < config.SESSION_UPDATE_TIME {
		p.UpdateSession(w)
	}
	return
}

// sign string is account+password+expireTime
func (p *MainHandler) getSignStr(expireTime int64) (rawStr string, err error) {
	return p.Config.RootPassword + strconv.FormatInt(expireTime, 10), err
}

func (p *MainHandler) checkSign(expireTime int64, sign string) (err error) {
	var rawStr string
	rawStr, err = p.getSignStr(expireTime)
	sum := md5.Sum([]byte(rawStr))
	if hex.EncodeToString(sum[:]) != sign {
		err = ERROR_TOKEN_INVALID
	}
	return
}

// CalculateSign calculate the sign
func (p *MainHandler) CalculateSign(expireTime int64) (ret string, err error) {
	var rawStr string
	rawStr, err = p.getSignStr(expireTime)
	sum := md5.Sum([]byte(rawStr))
	return hex.EncodeToString(sum[:]), err
}

// UpdateSession update the session of http header
func (p *MainHandler) UpdateSession(w http.ResponseWriter) {
	expireTime := time.Now().Add(config.EXPIRE_TIME)
	token, err := p.CalculateSign(expireTime.Unix())
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	tokenCookie := &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", tokenCookie.String())
	p.SessMap[token] = expireTime.Unix()
}

// ClearSession update the session of http header
func (p *MainHandler) ClearSession(w http.ResponseWriter) {
	tokenCookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", tokenCookie.String())
}
