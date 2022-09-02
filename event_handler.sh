#!/bin/bash

command=$1

echo $command

if [[ $command -eq CLOUDFLARE_ERR ]]; then
    : # run something here
fi