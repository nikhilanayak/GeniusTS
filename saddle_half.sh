#!/bin/bash



start=5085056


while true;
do
    let "end=$start+127"


    curl --silent localhost:4040/$start/$end > /mnt/d/songs/$start.jsonl

    echo finished $start

    let "start=$start+128"
done

ls $dir

