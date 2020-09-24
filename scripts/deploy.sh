#!/bin/bash
cd /data/deploy
tar -xf target/aws-sdk.tar.gz #--directory /data/deploy
cd aws-sdk
sh start.sh