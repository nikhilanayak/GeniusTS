#!/bin/bash

ssh -i ssh-key-2022-09-04.key ubuntu@152.70.135.84 -L 3030:localhost:3030 "curl https://raw.githubusercontent.com/nikhilanayak/GeniusTS/main/bootstrap.sh | bash -"