#!/bin/bash

pwd

echo $WORK_DIR
# Change folder!
cd $WORK_DIR

pwd

yarn install

yarn build
