#!/bin/bash



start=72576


while true;
do
    let "end=$start+127"


    curl --silent localhost:3030/$start/$end > /mnt/d/songs/$start.jsonl

    echo finished $start

    let "start=$start+128"
done

ls $dir

