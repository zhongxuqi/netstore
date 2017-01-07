all: build-server

build-server:
	GOPATH=${CURDIR}/server:$(GOPATH) && go build -o ./bin/netstore zhongxuqi/netstore/app/server

build-front:
	cd front && npm install && ./node_modules/webpack/bin/webpack.js

build-all: build-server build-front

run: build-server
	cd ./bin && ./netstore

