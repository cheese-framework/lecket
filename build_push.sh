#!/usr/bin/env bash
sudo docker build -f Dockerfile -t insistglobal/lecket:admin-latest .

sudo docker push insistglobal/lecket:admin-latest