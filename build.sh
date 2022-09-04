#!/bin/bash

npx tsc && npx webpack && mv dist/main.js dist/main.cjs
