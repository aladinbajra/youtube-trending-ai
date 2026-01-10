# Restart Frontend Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESTARTING FRONTEND" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Kill any existing npm/node processes on port 3000
Write-Host "Stopping existing frontend processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Where-Object {$_.MainWindowTitle -like "*frontend*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting fresh frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\38349\OneDrive\Desktop\tube-virality-main\frontend'; Write-Host 'Frontend Dev Server' -ForegroundColor Green; Write-Host 'Reading .env file...' -ForegroundColor Cyan; Get-Content .env; Write-Host '`nStarting Vite...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 10

# Test if frontend is up
Write-Host "`nTesting frontend..." -ForegroundColor Cyan
$test = try { (Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3).StatusCode } catch { "OFFLINE" }

if ($test -eq 200) {
    Write-Host "[SUCCESS] Frontend RUNNING at http://localhost:3000" -ForegroundColor Green
    Write-Host "`nOpening browser..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  INSTRUKSIONE:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "1. Browser u hap automatikisht" -ForegroundColor White
    Write-Host "2. Hap DevTools (F12)" -ForegroundColor White
    Write-Host "3. Shiko Console tab" -ForegroundColor White
    Write-Host "4. Kerko per:" -ForegroundColor White
    Write-Host "   [API Service] VITE_API_URL: http://localhost:8001" -ForegroundColor Cyan
    Write-Host "   [API] Fetching REAL data from backend" -ForegroundColor Cyan
    Write-Host "5. Nese sheh 'SAMPLE data' - prit 5s dhe refresh" -ForegroundColor White
    Write-Host "`n========================================`n" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend nuk nisi - check PowerShell window" -ForegroundColor Red
}

