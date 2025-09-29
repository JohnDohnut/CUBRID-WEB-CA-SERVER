# Deployment Scripts

This project includes two deployment scripts for different platforms:
- `deploy.ps1` - PowerShell script for Windows
- `deploy.sh` - Bash script for Linux/macOS

## Usage

### PowerShell (Windows)
```powershell
# Deploy both docs and server for Linux platform (default)
.\deploy.ps1

# Deploy only documentation
.\deploy.ps1 -Deploy docs

# Deploy only server
.\deploy.ps1 -Deploy server

# Deploy both with specific platform
.\deploy.ps1 -Platform both -Deploy both

# Available options:
# -Platform: linux, win, both (default: linux)
# -Deploy: docs, server, both (default: both)
```

### Bash (Linux/macOS)
```bash
# Deploy both docs and server for Linux platform (default)
./deploy.sh

# Deploy only documentation
./deploy.sh --deploy docs

# Deploy only server
./deploy.sh --deploy server

# Deploy both with specific platform
./deploy.sh --platform both --deploy both

# Show help
./deploy.sh --help

# Available options:
# --platform: linux, win, both (default: linux)
# --deploy: docs, server, both (default: both)
```

## Deployment Options

### Deploy Types
- **`docs`**: Only builds and deploys TypeDoc documentation
  - Builds documentation using `npm run docs:build`
  - Deploys to remote server
  - Starts documentation server on port 7777
  
- **`server`**: Only builds and deploys the WebCA server
  - Builds project using `npm run build`
  - Packages binary based on platform
  - Deploys binary to remote server
  - Starts WebCA server on port 8080
  
- **`both`**: Full deployment (default)
  - Builds both project and documentation
  - Deploys both server and docs
  - Starts both servers

### Platform Types
- **`linux`**: Packages and deploys Linux binary (default)
- **`win`**: Packages and deploys Windows binary
- **`both`**: Packages and deploys both Linux and Windows binaries

## Server Configuration

- **Documentation Server**: http://192.168.2.36:7777
- **WebCA Server**: https://192.168.2.36:8080
- **Remote Directory**: `/home/cubrid/web_ca_server`
- **Remote User**: `cubrid`

## Examples

```bash
# Quick documentation update
./deploy.sh --deploy docs

# Deploy new server version only
./deploy.sh --deploy server --platform linux

# Full deployment for production
./deploy.sh --deploy both --platform both
```

```powershell
# Quick documentation update
.\deploy.ps1 -Deploy docs

# Deploy new server version only
.\deploy.ps1 -Deploy server -Platform linux

# Full deployment for production
.\deploy.ps1 -Deploy both -Platform both
```
