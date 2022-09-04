#!/bin/bash

create_tpu() {
    gcloud alpha compute tpus tpu-vm create --zone=us-central1-f scraper --accelerator-type=v2-8 --version=v2-alpha --project=axial-silicon-315619
}

