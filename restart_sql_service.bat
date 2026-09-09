@echo off
echo =======================================================
echo Restarting SQL Server (SQLEXPRESS) with Administrator privileges...
echo =======================================================
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -Command Restart-Service MSSQL\$SQLEXPRESS; Write-Host \"SQL Server (SQLEXPRESS) restarted successfully on port 1433!\"; Start-Sleep -Seconds 3'"
