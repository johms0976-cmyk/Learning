@echo off
REM ============================================================
REM   RECORD-VOICE  .  double-click this file
REM ------------------------------------------------------------
REM   Fills in the missing audio with the Ryan GB voice, then
REM   rebuilds the manifest so the games can find it.
REM
REM   Keep this file in the same folder as index.html.
REM ============================================================
setlocal
cd /d "%~dp0"

echo.
echo   Word Land - voice generator
echo   ===========================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo   X Node is not installed. Get it from https://nodejs.org then run this again.
  goto :end
)

set PY=
where python >nul 2>&1 && set PY=python
if "%PY%"=="" ( where py >nul 2>&1 && set PY=py )
if "%PY%"=="" (
  echo   X Python is not installed. Get it from https://python.org then run this again.
  echo     During install, tick "Add Python to PATH".
  goto :end
)

for /f "tokens=*" %%v in ('node --version') do set NODEV=%%v
echo   node %NODEV%
%PY% --version

if not exist "index.html" (
  echo   X This file must sit in the same folder as index.html.
  goto :end
)
if not exist "tools\tts-spec.js" (
  echo   X tools\tts-spec.js is missing.
  goto :end
)
if not exist "tools\tts-generate.py" (
  echo   X tools\tts-generate.py is missing.
  goto :end
)

%PY% -c "import edge_tts" >nul 2>&1
if errorlevel 1 (
  echo.
  echo   Installing edge-tts ^(one time only^)...
  %PY% -m pip install edge-tts --quiet
  if errorlevel 1 (
    echo   X Could not install edge-tts. Try:  %PY% -m pip install edge-tts
    goto :end
  )
)

echo.
echo   Working out what to say...
node tools\tts-spec.js
if errorlevel 1 (
  echo   X tools\tts-spec.js failed - see the message above.
  goto :end
)

echo.
echo   ------------------------------------------------------
echo   1^) Make 10 files first, so you can listen  [recommended]
echo   2^) Make all of them ^(about 10 minutes^)
echo   3^) Just rebuild the manifest
echo   4^) Quit
echo   ------------------------------------------------------
set /p choice=  Choose 1-4: 
echo.

if "%choice%"=="1" %PY% tools\tts-generate.py --only phrases --limit 10
if "%choice%"=="2" %PY% tools\tts-generate.py
if "%choice%"=="4" goto :end
if "%choice%"=="" goto :end

echo.
node tools\make-manifest.js

echo.
echo   Done. The new files are in audio\wordland\
echo   Commit and push them, then reload the app on the iPad.

:end
echo.
pause
endlocal
