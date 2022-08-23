#!/bin/bash
tsc

export NODE_NO_WARNINGS=1

THREADS=10240
CURR=0

while true;
do
	#echo $CURR

	start=$((CURR*THREADS))
	end_=$((CURR*THREADS+THREADS-1))

	mkdir -p /dev/shm/data/$CURR

	start_time=$(date +%s)

	echo started batch
	for i in $(seq $start $end_)
	do
		#echo $i
		sudo NODE_NO_WARNINGS=1 node --es-module-specifier-resolution=node dist/scrape.js $i > /dev/shm/data/$CURR/$i&
	done

	#jobs

	nj=`jobs | wc -l | tr -d " "`

	while [[ $nj != "0" ]]
	do
		echo $nj
		nj=`jobs | wc -l | tr -d " "`
	done



	#wait

	end_time=$(date +%s)

	elapsed=$(( end_time - start_time ))
	echo $elapsed seconds for batch $CURR


	CURR=$((CURR+1))
done
