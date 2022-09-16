import os
import sys
import requests

# curr = 3353984
# curr = 3393536

PORT = sys.argv[1]

def file_exists(i):
    if os.path.exists(f"/mnt/d/songs/{i}.jsonl"):
        return True
    return False

i = 0
while True:
    if file_exists(i):
        print(f"skipped {i}")
        i += 128
        continue
    else:
        res = requests.get(f"http://localhost:{PORT}/ping")
        if res.ok:
            print(f"started {i}")
            os.system(f"bash tunnel.sh {i} {i + 127} {PORT}")
            print(f"finished {i}")