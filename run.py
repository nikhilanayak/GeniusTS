import os
import multiprocessing
from multiprocessing import Pool

#THREADS = 1024
THREADS = 128


def run(id):
    dirn = id // THREADS
    
    os.system(f"mkdir -p /dev/shm/data/{dirn}")


    command = f"NODE_NO_WARNINGS=1 node --es-module-specifier-resolution=node dist/scrape.js {id} > /dev/shm/data/{dirn}/{id}"
    print(command)
    os.system(command)


if __name__ == "__main__":
    curr = 0
    with Pool(THREADS) as p:
        while True:
            start = curr * THREADS
            end = start + THREADS


            res = p.map(run, list(range(start, end)))
            list(res)

            print(curr)
            curr += 1
