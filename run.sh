#!/bin/bash
# Script by Jordan R. Frary
# Purpose: To run Express and MongoDB services and restart them if they crash or are shut down

# Defining variables
MONGOPID=-1
MONGOSTATUS=1
NPMPID=-1
NPMSTATUS=1

# cleanup function will kill the services when script is terminated
function cleanup {
    MONGOPID=$(pgrep mongo)
    MONGOSTATUS=$?
    NPMPID=$(pgrep npm)
    NPMSTATUS=$?

    if [[ MONGOSTATUS -eq 0  ]]; then
        kill $MONGOPID
    fi
    if [[ NPMSTATUS -eq 0  ]]; then
        kill $NPMPID
    fi
}

trap cleanup EXIT

while true; do
    MONGOPID=$(pgrep mongo)
    MONGOSTATUS=$?
    NPMPID=$(pgrep npm)
    NPMSTATUS=$?
    if [[ MONGOSTATUS -eq 1 ]]; then
        echo "==========Starting mongo=========="
        mongod --dbpath $(pwd)/data/db &
    fi
    if [[ NPMSTATUS -eq 1 ]]; then
        echo "==========Starting npm============"
        npm start &
    fi
    sleep 5
done