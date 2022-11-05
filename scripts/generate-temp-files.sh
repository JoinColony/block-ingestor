#!/bin/bash

ENV_FILE=".env"

echo -e "Generating local specific, temporary files\n"

# Setup the env file
if [ -f "$ENV_FILE" ]; then
    echo "The .env file already exists, skip generating it"
else
    echo "Generating the .env file"
    cp .env.example $ENV_FILE
fi
