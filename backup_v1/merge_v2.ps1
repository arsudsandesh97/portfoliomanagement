$root = "d:\Work And Study\Social Media And Portfolio\Websites\Sandesh Arsud\Supabase\portfoliomanagement"
$v2 = "$root\v2"
$backup = "$root\backup_v1"

Write-Host "Creating backup directory..."
if (!(Test-Path $backup)) { New-Item -ItemType Directory -Path $backup }

Write-Host "Moving old project files to backup..."
Get-ChildItem -Path $root -Exclude "v2", "backup_v1", ".git" | Move-Item -Destination $backup -Force

Write-Host "Moving v2 files to root..."
# Exclude node_modules to avoid locking issues and long move times
Get-ChildItem -Path $v2 -Exclude "node_modules" | Move-Item -Destination $root -Force

Write-Host "Merge complete. Please run 'npm install' in the root directory."
