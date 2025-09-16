param(
  [ValidateSet("linux","win","both")]
  [string] $Platform = "linux"
)

$User = "cubrid"
$TargetHost = "192.168.2.36"
$RemotePath = "/home/cubrid"

$ArtLinux = "dist/webca-server-linux"
$ArtWin   = "dist/webca-server-win.exe"

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
    $result = Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Failed: $Description"
        exit 1
    }
    Write-Host "SUCCESS: $Description completed"
}

try {
    switch ($Platform) {
        "linux" {
            Invoke-Command "npm run build" "Building project"
            Invoke-Command "npm run pkg:linux" "Packaging for Linux"
            Test-FileExists $ArtLinux
            Write-Host "Deploying Linux binary to $User@$TargetHost`:$RemotePath"
            scp.exe $ArtLinux "$User@$TargetHost`:$RemotePath"
        }
        "win" {
            Invoke-Command "npm run build" "Building project"
            Invoke-Command "npm run pkg:win" "Packaging for Windows"
            Test-FileExists $ArtWin
            Write-Host "Deploying Windows binary to $User@$TargetHost`:$RemotePath"
            scp.exe $ArtWin "$User@$TargetHost`:$RemotePath"
        }
        "both" {
            Invoke-Command "npm run build" "Building project"
            Invoke-Command "npm run pkg:linux" "Packaging for Linux"
            Invoke-Command "npm run pkg:win" "Packaging for Windows"
            Test-FileExists $ArtLinux
            Test-FileExists $ArtWin
            Write-Host "Deploying both binaries to $User@$TargetHost`:$RemotePath"
            scp.exe $ArtLinux $ArtWin "$User@$TargetHost`:$RemotePath"
        }
    }
    
    Write-Host "Deploy complete"
} catch {
    Write-Error "ERROR: Deploy failed: $($_.Exception.Message)"
    exit 1
}
