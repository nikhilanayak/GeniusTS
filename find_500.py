import os
from natsort import natsorted
from tqdm import tqdm

dirname = "/mnt/d/songs"


while True:

    files = os.listdir(dirname)
    files = natsorted(files)
    files = reversed(files)

    i = next(files)

    #for i in tqdm(list(reversed(files))):
    path = f"{dirname}/{i}"

    with open(path, "r") as file:
        lines = file.readlines()

        for l in lines:
            if "500" in l[:20]:
                print(l[:20])
                print(i)
                quit()

    print(path)