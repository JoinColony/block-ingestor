#!/usr/bin/env bash

# Check if AWS CLI is installed
if ! command -v aws &>/dev/null; then
    echo "Error: AWS CLI is not installed."
    echo "Please install the AWS CLI before running this script."
    exit 1
fi

# Usage function for displaying help
usage() {
    echo "Usage: $0 --userPool USERPOOL [--password PASSWORD]"
    echo "       $0 -u USERPOOL [-p PASSWORD]"
    echo ""
    echo "  -u, --userPool    Required. Specify the user pool."
    echo "  -p, --password    Optional. Specify the password. Default: test1234"
    echo "  -h, --help        Display this help message."
    exit 1
}

# Function to prompt for confirmation
confirm() {
    while true; do
        read -rp "Do you want to continue? (y/n, default: y) " yn
        case $yn in
            [Yy]* | '') break ;;
            [Nn]*) exit ;;
            *) echo "Please answer y or n." ;;
        esac
    done
}

# Default password value
DEFAULT_PASSWORD="test1234"
PASSWORD="$DEFAULT_PASSWORD"

# Check if any argument is passed
if [ $# -eq 0 ]; then
    usage
fi

# Parsing arguments
while [ "$1" != "" ]; do
    case $1 in
        -u | --userPool)
            shift
            USER_POOL="$1"
            ;;
        -p | --password)
            shift
            PASSWORD="$1"
            ;;
        -h | --help)
            usage
            ;;
        *)
            usage
            ;;
    esac
    shift
done

# Check if userPool is set
if [ -z "$USER_POOL" ]; then
    echo "Error: User pool is required."
    usage
fi

# Show confirmation message if default password is used
if [ "$PASSWORD" == "$DEFAULT_PASSWORD" ]; then
    echo "No password provided. Using the default password: $DEFAULT_PASSWORD"
    confirm
fi

# Create a new user
output=$(aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL" \
    --username blockingestor \
    2>&1 >/dev/null)

if [ $? -ne 0 ]; then
    echo "Error: Failed to create user."
    echo "Error details: $output"
    exit 1
fi

# Set the user's password
output=$(aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL" \
    --username blockingestor \
    --password "$PASSWORD" \
    --permanent \
    2>&1)

if [ $? -ne 0 ]; then
    echo "Error: Failed to set user password."
    echo "Error details: $output"
    exit 1
fi

# Create a new group
output=$(aws cognito-idp create-group \
    --user-pool-id "$USER_POOL" \
    --group-name admin \
    2>&1 >/dev/null)

if [ $? -ne 0 ]; then
    echo "Error: Failed to create group."
    echo "Error details: $output"
    exit 1
fi

# Add the user to the group
output=$(aws cognito-idp admin-add-user-to-group \
    --user-pool-id "$USER_POOL" \
    --username blockingestor \
    --group-name admin \
    2>&1)

if [ $? -ne 0 ]; then
    echo "Error: Failed to add user to group."
    echo "Error details: $output"
    exit 1
fi

echo "Blockingestor user successfully created and added to the Admin group."
