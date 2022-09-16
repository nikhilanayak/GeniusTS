start=$1
end=$2
port=$3


curl localhost:$port/$start/$end > /mnt/d/songs/$start.jsonl