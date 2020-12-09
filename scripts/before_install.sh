#!/bin/bash

DIRECTORY='/home/app/node-server/'
if [ -d "$DIRECTORY" ]; then
  rm -rf /home/app/node-server
fi
mkdir /home/app/node-server