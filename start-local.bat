@echo off
setlocal
cd /d "%~dp0"
title Mhtrian Uebersetzungen - Lokale Vorschau
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\local-server.ps1"
if errorlevel 1 (
  echo.
  echo Die lokale Vorschau konnte nicht gestartet werden.
  echo Bitte machen Sie einen Screenshot dieser Meldung und senden Sie ihn im Chat.
  echo.
  pause
)
endlocal
