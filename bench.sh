#!/bin/bash
tsc

total=0

NUM_ITERS=128

#for i in {0..$NUM_ITERS};
for (( i=0; i<$NUM_ITERS; i++))
do
	start=$(date +%s.%N)
	#echo $i

	node --es-module-specifier-resolution=node dist/scrape.js 1	

	end=$(date +%s.%N)

	runtime=$(python -c "print(${end} - ${start})")

	total=$(python -c "print(${total} + ${runtime})")
	echo "Runtime was $runtime"
done

avg=$(python -c "print(${total} / ${NUM_ITERS})")

echo "Average: $avg"
