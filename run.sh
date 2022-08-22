#!/bin/bash
tsc

echo starting with $1 threads

for i in $(seq 1 $1);
do
	echo $i
	node --es-module-specifier-resolution=node dist/index.js&
done

wait
