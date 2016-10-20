#!/bin/bash
ls
cd node_modules/material-ui-build
npm i
npm run build
rm -rf node_modules
npm i --production
mkdir ../material-ui
mv build/* ../material-ui/
cd ../../
