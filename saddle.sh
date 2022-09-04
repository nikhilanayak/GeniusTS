#!/bin/bash



start=0


while true;
do
    let "end=$start+127"


    curl localhost:3030/$start/$end > /mnt/d/songs/$start.jsonl

    echo finished $start

    let "start=$start+128"
done

ls $dir

