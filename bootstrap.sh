#!/bin/bash


curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2> /dev/null
sudo apt-get install -y nodejs > /dev/null 2> /dev/null
parallel --version > /dev/null || sudo apt install parallel

isnum='^[0-9]+$'

if [[ "$#" -eq 1 ]]; then
    if ! [[ $1 =~ $isnum ]]; then
        echo "$1 (\$1) must be a number"
        exit 2
    fi
    range=$1
elif [[ "$#" -eq 2 ]]; then
    if ! [[ $1 =~ $isnum ]]; then
        echo "$1 (\$1) must be a number"
        exit 2
    fi
    if ! [[ $2 =~ $isnum ]]; then
        echo "$2 (\$2) must be a number"
        exit 2
    fi
    range=$(seq $1 $2)
else
    echo Error: Run with 1 or 2 arguments
    echo Usage: $0 id
    echo Usage: $0 start end
fi

JOBS=1024


parallel --progress -j$JOBS node dist/main.cjs ::: $range