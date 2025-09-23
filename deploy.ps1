param(
  [ValidateSet("linux","win","both")]
  [string] $Platform = "linux"
)

# --- Configuration ---
$User = "cubrid"
$TargetHost = "192.168.2.36"
$RemoteBaseDir = "/home/cubrid/webca_deployment"

# --- Local Artifact Paths ---
$ArtLinux = "dist/webca-server-linux"
$ArtWin   = "dist/webca-server-win.exe"
$DocsPath = "docs"

# --- Remote Artifact Paths ---
$RemoteBinLinux = "$RemoteBaseDir/webca-server-linux"
$RemoteBinWin = "$RemoteBaseDir/webca-server-win.exe"
$RemoteDocsDir = "$RemoteBaseDir/docs"

# Function to check if file exists
function Test-FileExists {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) {
        Write-Error "File not found: $FilePath"
        exit 1
    }
}

# Function to run command with error handling
function Invoke-Command {
    param([string]$Command, [string]$Description)
    Write-Host "Running: $Description..."
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Failed: $Description"
        exit 1
    }
    Write-Host "SUCCESS: $Description completed"
}

# --- Main Execution Block ---
try {
    # --- Shared Build Steps ---
    Invoke-Command "npm run build" "Building project"
    Invoke-Command "npm run docs" "Building TypeDoc documentation"
    Test-FileExists $DocsPath

    # --- Remote Directory Preparation ---
    Write-Host "Connecting to $TargetHost to prepare directory..."
    ssh.exe "$User@$TargetHost" "mkdir -p $RemoteBaseDir"

    # --- Platform-Specific Packaging and Deployment ---
    switch ($Platform) {
        "linux" {
            Invoke-Command "npm run pkg:linux" "Packaging for Linux"
            Test-FileExists $ArtLinux
            Write-Host "Deploying Linux binary to ${User}@${TargetHost}:${RemoteBinLinux}"
            scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBinLinux}"
        }
        "win" {
            Invoke-Command "npm run pkg:win" "Packaging for Windows"
            Test-FileExists $ArtWin
            Write-Host "Deploying Windows binary to ${User}@${TargetHost}:${RemoteBinWin}"
            scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBinWin}"
        }
        "both" {
            Invoke-Command "npm run pkg:all" "Packaging for both platforms"
            Test-FileExists $ArtLinux
            Test-FileExists $ArtWin
            Write-Host "Deploying both binaries to ${User}@${TargetHost}:${RemoteBaseDir}"
            scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBinLinux}"
            scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBinWin}"
        }
    }

    # --- Deploy Documentation (Common Step) ---
    Write-Host "Deploying documentation to ${User}@${TargetHost}:${RemoteDocsDir}"
    scp.exe -r $DocsPath "${User}@${TargetHost}:${RemoteBaseDir}"

    # --- Remote Server Management (Common Steps for Linux Target) ---
    Write-Host "Checking for existing servers on ports 7777 and 8080..."
    $StopCommand = "if lsof -i :7777 >/dev/null 2>&1; then echo 'Stopping docs server...'; kill `lsof -ti :7777`; fi; if lsof -i :8080 >/dev/null 2>&1; then echo 'Stopping WebCA server...'; kill `lsof -ti :8080`; fi"
    ssh.exe "$User@$TargetHost" $StopCommand
    
    Write-Host "Adding execute permission to Linux binary..."
    ssh.exe "$User@$TargetHost" "chmod +x $RemoteBinLinux"

    Write-Host "Starting servers on remote host..."
    $StartDocsCommand = "nohup npx http-server $RemoteDocsDir -p 7777 > $RemoteBaseDir/docs.log 2>&1 &"
    ssh.exe "$User@$TargetHost" $StartDocsCommand

    $StartServerCommand = "nohup $RemoteBinLinux --SEED=seed --SALT=salt --PORT=8080 > $RemoteBaseDir/server.log 2>&1 &"
    ssh.exe "$User@$TargetHost" $StartServerCommand

    # --- Final Summary ---
    Write-Host "--- Deployment Summary ---"
    Write-Host "WebCA server available at: https://${TargetHost}:8080"
    Write-Host "Documentation available at: http://${TargetHost}:7777"
    
    Write-Host "Deploy complete"
} catch {
    Write-Error "ERROR: Deploy failed: $($_.Exception.Message)"
    exit 1
}
