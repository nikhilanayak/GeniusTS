import json

FILE = "data/0/1.json"

def print_size(obj, tabs=0):

    full_size = sum([print_size(i) for i in obj])


obj = json.loads(open(FILE, "r").read())

print(obj.keys())