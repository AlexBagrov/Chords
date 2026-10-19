# Creates/updates a Desktop shortcut that launches local Chords (no git needed).
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$batPath = Join-Path $PSScriptRoot 'start-local.bat'
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Chords.lnk'

if (-not (Test-Path $batPath)) {
  throw "Not found: $batPath"
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = $projectRoot
$shortcut.WindowStyle = 1
$shortcut.Description = 'Chords - local launch (files from disk, no git)'
$iconCandidate = Join-Path $projectRoot 'public\icons\app-icon.ico'
if (-not (Test-Path $iconCandidate)) {
  $iconCandidate = Join-Path $projectRoot 'public\icons\pwa-192.png'
}
if (Test-Path $iconCandidate) {
  $shortcut.IconLocation = if ($iconCandidate -like '*.ico') { "$iconCandidate,0" } else { $iconCandidate }
}
$shortcut.Save()

Write-Host "Shortcut created: $shortcutPath"
