#!/bin/bash

git clone https://github.com/nikhilanayak/GeniusTS.git GeniusTS
cd GeniusTS

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>> err.log
sudo apt-get install -y nodejs > /dev/null 2>> err.log
parallel --version > /dev/null || sudo apt install parallel

npm install

npx tsc
npx webpack
mv dist/main.js dist/main.cjs

node dist/Server.js&
disown