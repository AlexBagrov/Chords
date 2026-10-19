@echo off
setlocal
cd /d "%~dp0.."

rem Node from typical install paths (double-click may not inherit user PATH)
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LOCALAPPDATA%\Programs\node;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found. Install LTS from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Chords - local launch (files on disk, no git/Pages).
echo Close this window when finished. Browser opens automatically.
echo.
call npm run start:local
if errorlevel 1 pause
