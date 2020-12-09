#!/bin/bash

cd /home/app/node-server && aws s3 cp s3://codepipeline-tarun/node-env/.env .
cd /home/app/node-server && npm install
