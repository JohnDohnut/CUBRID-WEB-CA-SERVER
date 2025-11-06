param(
    [ValidateSet("linux", "win", "both")]
    [string] $Platform = "linux",
  
    [ValidateSet("docs", "server", "both")]
    [string] $Deploy = "both"
)

# --- Configuration ---
$User = "cubrid"
$TargetHost = "192.168.2.36"
$RemoteBaseDir = "/home/cubrid/webca_deployment"

# --- Local Artifact Paths ---
$ArtLinux = "dist/webca-server-linux"
$ArtWin = "dist/webca-server-win.exe"
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
    # --- Remote Directory Preparation ---
    Write-Host "Connecting to $TargetHost to prepare directory..."
    ssh.exe "$User@$TargetHost" "mkdir -p $RemoteBaseDir"

    # --- Deploy Based on Options ---
    switch ($Deploy) {
        "docs" {
            Write-Host "=== DOCS ONLY DEPLOYMENT ==="
            
            # Build docs
            Invoke-Command "npm run docs" "Building TypeDoc documentation"
            Test-FileExists $DocsPath
            
            # Deploy docs
            Write-Host "Deploying documentation to ${User}@${TargetHost}:${RemoteDocsDir}"
            scp.exe -r $DocsPath "${User}@${TargetHost}:${RemoteBaseDir}"
            
            # Stop and Start docs server
            Write-Host "Stopping and starting documentation server on port 7777..."
            $DocsCommands = "if pgrep -f 'http-server.*7777' >/dev/null 2>&1; then echo 'Stopping docs server...'; pkill -f 'http-server.*7777'; fi; nohup npx http-server $RemoteDocsDir -p 7777 > $RemoteBaseDir/docs.log 2>&1 &"
            ssh.exe "$User@$TargetHost" $DocsCommands
            
            Write-Host "Documentation available at: http://${TargetHost}:7777"
        }
        
        "server" {
            Write-Host "=== SERVER ONLY DEPLOYMENT ==="
            
            # Build project
            Invoke-Command "npm run build" "Building project"
            
            # Platform-specific packaging and deployment
            switch ($Platform) {
                "linux" {
                    Invoke-Command "npm run pkg:linux" "Packaging for Linux"
                    Test-FileExists $ArtLinux
                    Write-Host "Deploying Linux binary to ${User}@${TargetHost}:${RemoteBinLinux}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinLinux"
                    scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
                "win" {
                    Invoke-Command "npm run pkg:win" "Packaging for Windows"
                    Test-FileExists $ArtWin
                    Write-Host "Deploying Windows binary to ${User}@${TargetHost}:${RemoteBinWin}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinWin"
                    scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
                "both" {
                    Invoke-Command "npm run pkg:all" "Packaging for both platforms"
                    Test-FileExists $ArtLinux
                    Test-FileExists $ArtWin
                    Write-Host "Deploying both binaries to ${User}@${TargetHost}:${RemoteBaseDir}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinLinux $RemoteBinWin"
                    scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBaseDir}/"
                    scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
            }
            
            # Stop and Start server (Linux only for now)
            if ($Platform -eq "linux" -or $Platform -eq "both") {
                Write-Host "Stopping and starting WebCA server on port 8080..."
                $ServerCommands = "if pgrep -f 'webca-server-linux.*8080' >/dev/null 2>&1; then echo 'Stopping WebCA server...'; pkill -f 'webca-server-linux.*8080'; fi; chmod +x $RemoteBinLinux; nohup $RemoteBinLinux --SEED=seed --SALT=salt --PORT=8080 > $RemoteBaseDir/server.log 2>&1 &"
                ssh.exe "$User@$TargetHost" $ServerCommands
                
                Write-Host "WebCA server available at: https://${TargetHost}:8080"
            }
        }
        
        "both" {
            Write-Host "=== FULL DEPLOYMENT (DOCS + SERVER) ==="
            
            # Build everything
            Invoke-Command "npm run build" "Building project"
            Invoke-Command "npm run docs" "Building TypeDoc documentation"
            Test-FileExists $DocsPath
            
            # Platform-specific packaging and deployment
            switch ($Platform) {
                "linux" {
                    Invoke-Command "npm run pkg:linux" "Packaging for Linux"
                    Test-FileExists $ArtLinux
                    Write-Host "Deploying Linux binary to ${User}@${TargetHost}:${RemoteBinLinux}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinLinux"
                    scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
                "win" {
                    Invoke-Command "npm run pkg:win" "Packaging for Windows"
                    Test-FileExists $ArtWin
                    Write-Host "Deploying Windows binary to ${User}@${TargetHost}:${RemoteBinWin}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinWin"
                    scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
                "both" {
                    Invoke-Command "npm run pkg:all" "Packaging for both platforms"
                    Test-FileExists $ArtLinux
                    Test-FileExists $ArtWin
                    Write-Host "Deploying both binaries to ${User}@${TargetHost}:${RemoteBaseDir}"
                    ssh.exe "$User@$TargetHost" "rm -f $RemoteBinLinux $RemoteBinWin"
                    scp.exe $ArtLinux "${User}@${TargetHost}:${RemoteBaseDir}/"
                    scp.exe $ArtWin "${User}@${TargetHost}:${RemoteBaseDir}/"
                }
            }
            
            # Deploy documentation
            Write-Host "Deploying documentation to ${User}@${TargetHost}:${RemoteDocsDir}"
            scp.exe -r $DocsPath "${User}@${TargetHost}:${RemoteBaseDir}"
            
            # Stop existing servers
            Write-Host "Stopping existing servers on ports 7777 and 8080..."
            $StopCommands = "if pgrep -f 'http-server.*7777' >/dev/null 2>&1; then echo 'Stopping docs server...'; pkill -f 'http-server.*7777'; fi; if pgrep -f 'webca-server-linux.*8080' >/dev/null 2>&1; then echo 'Stopping WebCA server...'; pkill -f 'webca-server-linux.*8080'; fi"
            ssh.exe "$User@$TargetHost" $StopCommands
            
            # Start servers
            Write-Host "Starting documentation server on port 7777 and WebCA server on port 8080..."
            if ($Platform -eq "linux" -or $Platform -eq "both") {
                $StartCommands = "nohup npx http-server $RemoteDocsDir -p 7777 > $RemoteBaseDir/docs.log 2>&1 & chmod +x $RemoteBinLinux; nohup $RemoteBinLinux --SEED=seed --SALT=salt --PORT=8080 > $RemoteBaseDir/server.log 2>&1 &"
            } else {
                $StartCommands = "nohup npx http-server $RemoteDocsDir -p 7777 > $RemoteBaseDir/docs.log 2>&1 &"
            }
            ssh.exe "$User@$TargetHost" $StartCommands
            
            # Final Summary
            Write-Host "--- Deployment Summary ---"
            if ($Platform -eq "linux" -or $Platform -eq "both") {
                Write-Host "WebCA server available at: https://${TargetHost}:8080"
            }
            Write-Host "Documentation available at: http://${TargetHost}:7777"
        }
    }
    
    Write-Host "Deploy complete"
}
catch {
    Write-Error "ERROR: Deploy failed: $($_.Exception.Message)"
    exit 1
}
