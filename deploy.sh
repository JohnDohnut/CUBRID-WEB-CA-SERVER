#!/usr/bin/env bash
set -euo pipefail

USER="cubrid"
TARGET_HOST="192.168.2.36"
REMOTE_PATH="/home/cubrid"

ART_LINUX="dist/webca-server-linux"
ART_WIN="dist/webca-server-win.exe"

# Function to check if file exists
check_file_exists() {
    local file_path="$1"
    if [[ ! -f "$file_path" ]]; then
        echo "ERROR: File not found: $file_path"
        exit 1
    fi
}

# Function to run command with error handling
run_command() {
    local command="$1"
    local description="$2"
    echo "Running: $description..."
    if ! eval "$command"; then
        echo "ERROR: Failed: $description"
        exit 1
    fi
    echo "SUCCESS: $description completed"
}

case "${1:-linux}" in
  linux)
    run_command "npm run build" "Building project"
    run_command "npm run pkg:linux" "Packaging for Linux"
    check_file_exists "$ART_LINUX"
    echo "Deploying Linux binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_LINUX" "$USER@$TARGET_HOST:$REMOTE_PATH"
    ;;
  win)
    run_command "npm run build" "Building project"
    run_command "npm run pkg:win" "Packaging for Windows"
    check_file_exists "$ART_WIN"
    echo "Deploying Windows binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_WIN" "$USER@$TARGET_HOST:$REMOTE_PATH"
    ;;
  both)
    run_command "npm run build" "Building project"
    run_command "npm run pkg:linux" "Packaging for Linux"
    run_command "npm run pkg:win" "Packaging for Windows"
    check_file_exists "$ART_LINUX"
    check_file_exists "$ART_WIN"
    echo "Deploying both binaries to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_LINUX" "$ART_WIN" "$USER@$TARGET_HOST:$REMOTE_PATH"
    ;;
  *)
    echo "Usage: $0 {linux|win|both}"
    echo "Default: linux"
    exit 1
    ;;
esac

echo "Deploy complete"
