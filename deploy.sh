#!/usr/bin/env bash
set -euo pipefail

USER="cubrid"
TARGET_HOST="192.168.2.36"
REMOTE_PATH="/home/cubrid/web_ca_server"

ART_LINUX="dist/webca-server-linux"
ART_WIN="dist/webca-server-win.exe"
DOCS_PATH="docs"

# Function to check if file exists
check_file_exists() {
    local file_path="$1"
    if [[ ! -f "$file_path" ]]; then
        echo "ERROR: File not found: $file_path"
        exit 1
    fi
}

# Function to check if directory exists
check_dir_exists() {
    local dir_path="$1"
    if [[ ! -d "$dir_path" ]]; then
        echo "ERROR: Directory not found: $dir_path"
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

# Function to kill processes by PID on ports 7777 and 8080
kill_servers() {
    echo "Checking for existing servers on ports 7777 and 8080..."
    ssh "$USER@$TARGET_HOST" "
        if pgrep -f 'http-server.*7777' >/dev/null 2>&1; then
            echo 'Stopping existing documentation server on port 7777...'
            pkill -f 'http-server.*7777'
            sleep 1
        fi
        if pgrep -f 'webca-server.*8080' >/dev/null 2>&1; then
            echo 'Stopping existing WebCA server on port 8080...'
            pkill -f 'webca-server.*8080'
            sleep 1
        fi
    "
}

# Function to start servers
start_servers() {
    local platform="$1"
    echo "Starting documentation server with Node.js http-server on port 7777..."
    ssh "$USER@$TARGET_HOST" "
        cd $REMOTE_PATH && 
        nohup npx http-server docs -p 7777 --cors --gzip > docs.log 2>&1 &
        echo 'Documentation server started'
    "
    echo "Documentation available at: http://$TARGET_HOST:7777"
    
    if [ "$platform" != "win" ]; then
        echo "Starting WebCA server on port 8080..."
        ssh "$USER@$TARGET_HOST" "cd $REMOTE_PATH && chmod +x webca-server-linux && nohup ./webca-server-linux --SEED=seed --SALT=salt --PORT=8080 > server.log 2>&1 & echo 'WebCA server started'"
        echo "WebCA server available at: http://$TARGET_HOST:8080"
    else
        echo "Starting WebCA server on port 8080..."
        ssh "$USER@$TARGET_HOST" "cd $REMOTE_PATH && nohup ./webca-server-win.exe --SEED=seed --SALT=salt --PORT=8080 > server.log 2>&1 & echo 'WebCA server started'"
        echo "WebCA server available at: http://$TARGET_HOST:8080"
    fi
}

case "${1:-linux}" in
  linux)
    # 1. Build and package
    run_command "npm run build" "Building project"
    run_command "npm run pkg:linux" "Packaging for Linux"
    run_command "npm run docs:build" "Building TypeDoc documentation"
    check_file_exists "$ART_LINUX"
    check_dir_exists "$DOCS_PATH"
    
    # 2. Deploy (sequential)
    echo "Preparing remote directory..."
    ssh "$USER@$TARGET_HOST" "mkdir -p $REMOTE_PATH"
    
    echo "Deploying Linux binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_LINUX" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "Deploying documentation to $USER@$TARGET_HOST:$REMOTE_PATH/docs"
    scp -r "$DOCS_PATH" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "All file transfers completed"
    
    # 3. Kill existing servers by PID
    kill_servers
    
    # 4. Start servers (docs on 7777, server on 8080)
    start_servers "linux"
    ;;
  win)
    # 1. Build and package
    run_command "npm run build" "Building project"
    run_command "npm run pkg:win" "Packaging for Windows"
    run_command "npm run docs:build" "Building TypeDoc documentation"
    check_file_exists "$ART_WIN"
    check_dir_exists "$DOCS_PATH"
    
    # 2. Deploy (sequential)
    echo "Preparing remote directory..."
    ssh "$USER@$TARGET_HOST" "mkdir -p $REMOTE_PATH"
    
    echo "Deploying Windows binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_WIN" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "Deploying documentation to $USER@$TARGET_HOST:$REMOTE_PATH/docs"
    scp -r "$DOCS_PATH" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "All file transfers completed"
    
    # 3. Kill existing servers by PID
    kill_servers
    
    # 4. Start servers (docs on 7777, server on 8080)
    start_servers "win"
    ;;
  both)
    # 1. Build and package
    run_command "npm run build" "Building project"
    run_command "npm run pkg:linux" "Packaging for Linux"
    run_command "npm run pkg:win" "Packaging for Windows"
    run_command "npm run docs:build" "Building TypeDoc documentation"
    check_file_exists "$ART_LINUX"
    check_file_exists "$ART_WIN"
    check_dir_exists "$DOCS_PATH"
    
    # 2. Deploy (sequential)
    echo "Deploying Linux binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_LINUX" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "Deploying Windows binary to $USER@$TARGET_HOST:$REMOTE_PATH"
    scp "$ART_WIN" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "Deploying documentation to $USER@$TARGET_HOST:$REMOTE_PATH/docs"
    scp -r "$DOCS_PATH" "$USER@$TARGET_HOST:$REMOTE_PATH"
    
    echo "All file transfers completed"
    
    # 3. Kill existing servers by PID
    kill_servers
    
    # 4. Start servers (docs on 7777, server on 8080)
    start_servers "linux"
    ;;
  *)
    echo "Usage: $0 {linux|win|both}"
    echo "Default: linux"
    exit 1
    ;;
esac

echo "Deploy complete"
