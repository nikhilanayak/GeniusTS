import os
import time


command = "node --es-module-specifier-resolution=node dist/scrape.js {} > /dev/null"

times = []

for i in range(128):
    start = time.time()

    res = os.system(command.format(i))

    end = time.time()


    times.append(end - start)
    print(end-start)
