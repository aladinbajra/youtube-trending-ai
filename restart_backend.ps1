# Restart Backend API Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESTARTING BACKEND API" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop any running backend processes
Write-Host "[1] Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*python*" -and $_.CommandLine -like "*app.py*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "    Done`n" -ForegroundColor Green

# Activate virtual environment
Write-Host "[2] Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
Write-Host "    Done`n" -ForegroundColor Green

# Start backend
Write-Host "[3] Starting FastAPI backend..." -ForegroundColor Yellow
Write-Host "    Server will run on: http://localhost:8001`n" -ForegroundColor Cyan

cd backend_api
python app.py

