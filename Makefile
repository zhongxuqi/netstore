all: build-server

run-front:
	cd front && webpack --config webpack.config.dev.js -w

build-server:
	GOPATH=${CURDIR}/server:$(GOPATH) && go build -o ./bin/netstore zhongxuqi/netstore/app/server

build-front:
	cd front && npm install && ./node_modules/webpack/bin/webpack.js

build-all: build-server build-front

run: build-server
	cd ./bin && ./netstore

