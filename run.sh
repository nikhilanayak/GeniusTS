#!/bin/bash
mkdir -p /dev/shm/data

start=$1
end=$2
JOBS=$3

range=$(seq $start $end)

parallel --progress -j$JOBS node dist/main.cjs ::: $range # 2> /dev/null