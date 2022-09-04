#!/bin/bash

git clone https://github.com/nikhilanayak/GeniusTS.git GeniusTS
cd GeniusTS

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
parallel --version > /dev/null || sudo apt install parallel

npm install

npx tsc
npx webpack
mv dist/main.js dist/main.cjs

node dist/Server.js