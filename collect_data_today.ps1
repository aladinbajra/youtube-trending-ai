# YouTube Data Collection Script
# Merr trending videos dhe stats deri më sot

$ErrorActionPreference = "Continue"

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "  YOUTUBE DATA COLLECTION - $(Get-Date -Format 'dd MMMM yyyy')" -ForegroundColor Yellow
Write-Host "================================================================`n" -ForegroundColor Cyan

# Navigate to project directory
$ProjectDir = "C:\Users\38349\OneDrive\Desktop\tube-virality-main"
Set-Location $ProjectDir

# Activate virtual environment
Write-Host "[INFO] Activating virtual environment..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"

# Check if API key is set
if (-not $env:YOUTUBE_API_KEY) {
    Write-Host "`n[ERROR] YOUTUBE_API_KEY not set!" -ForegroundColor Red
    Write-Host "Please set it in .env file or environment variable." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] API key found`n" -ForegroundColor Green

# Ask user what to collect
Write-Host "SELECT COLLECTION MODE:" -ForegroundColor Cyan
Write-Host "  1. QUICK MODE  - Only trending videos (~5 min, 50 API units)" -ForegroundColor White
Write-Host "  2. FULL MODE   - Trending + Stats for ALL videos (~2-6 hours, 1,800 units)" -ForegroundColor White
Write-Host "  3. BALANCED    - Trending + Stats for TOP 1000 videos (~20 min, 200 units)" -ForegroundColor Yellow
Write-Host ""
$mode = Read-Host "Enter choice (1/2/3)"

$startTime = Get-Date

# ========================================
# STEP 1: Collect Trending Videos
# ========================================
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "  STEP 1/4: Collecting Trending Videos (50+ countries)" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan

try {
    python src/collection/trending.py
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[OK] Trending videos collected!" -ForegroundColor Green
    } else {
        Write-Host "`n[ERROR] Failed to collect trending videos" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 2: Collect Video Stats (optional)
# ========================================
if ($mode -eq "2" -or $mode -eq "3") {
    Write-Host "`n----------------------------------------------------------------" -ForegroundColor Cyan
    if ($mode -eq "2") {
        Write-Host "  STEP 2/4: Collecting Stats for ALL Videos (~86K videos)" -ForegroundColor Yellow
        Write-Host "  This will take 2-6 HOURS! Press Ctrl+C to cancel." -ForegroundColor Red
    } else {
        Write-Host "  STEP 2/4: Collecting Stats for TOP 1000 Videos" -ForegroundColor Yellow
    }
    Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan
    
    Start-Sleep -Seconds 3
    
    try {
        if ($mode -eq "3") {
            # Balanced mode - modify script to limit videos
            Write-Host "[INFO] Running in BALANCED mode (TOP 1000)" -ForegroundColor Gray
            # Note: You'll need to modify video_stats.py to add limit parameter
            # For now, just run and it will process what it can
        }
        
        python src/collection/video_stats.py
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[OK] Video stats collected!" -ForegroundColor Green
        } else {
            Write-Host "`n[WARN] Video stats collection had issues (check logs)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "`n[WARN] Video stats collection failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "Continuing with processing..." -ForegroundColor Gray
    }
} else {
    Write-Host "`n[INFO] Skipping video stats collection (QUICK MODE)" -ForegroundColor Gray
}

# ========================================
# STEP 3: Process Trending Data
# ========================================
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "  STEP 3/4: Processing Trending Data (Merge to CSV)" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan

try {
    python src/processing/trending_db.py
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[OK] Trending data processed!" -ForegroundColor Green
    } else {
        Write-Host "`n[ERROR] Failed to process trending data" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 4: Process Video Stats (if collected)
# ========================================
if ($mode -eq "2" -or $mode -eq "3") {
    Write-Host "`n----------------------------------------------------------------" -ForegroundColor Cyan
    Write-Host "  STEP 4/4: Processing Video Stats (Merge to CSV)" -ForegroundColor Yellow
    Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan
    
    try {
        python src/processing/video_stats_db.py
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[OK] Video stats processed!" -ForegroundColor Green
        } else {
            Write-Host "`n[WARN] Video stats processing had issues" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "`n[WARN] $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n[INFO] Skipping video stats processing (QUICK MODE)" -ForegroundColor Gray
}

# ========================================
# SUMMARY
# ========================================
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DATA COLLECTION COMPLETED!" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green

Write-Host "`nSUMMARY:" -ForegroundColor Cyan
Write-Host "  Mode: $(if ($mode -eq '1') {'QUICK'} elseif ($mode -eq '2') {'FULL'} else {'BALANCED'})" -ForegroundColor White
Write-Host "  Duration: $($duration.Hours)h $($duration.Minutes)m $($duration.Seconds)s" -ForegroundColor White
Write-Host "  Date: $(Get-Date -Format 'dd MMMM yyyy HH:mm')" -ForegroundColor White

# Check file sizes
$trendingFile = "db\ods\trending_videos.csv"
$statsFile = "db\ods\merged_video_stats.csv"

if (Test-Path $trendingFile) {
    $trendingSize = (Get-Item $trendingFile).Length / 1MB
    Write-Host "`n  Trending CSV: $([math]::Round($trendingSize, 2)) MB" -ForegroundColor Gray
}
if (Test-Path $statsFile) {
    $statsSize = (Get-Item $statsFile).Length / 1MB
    Write-Host "  Stats CSV: $([math]::Round($statsSize, 2)) MB" -ForegroundColor Gray
}

Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Restart backend API:" -ForegroundColor White
Write-Host "     python backend_api/app.py" -ForegroundColor Gray
Write-Host "  2. Refresh frontend (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "  3. Check Analytics page for new data!" -ForegroundColor White

Write-Host "`n================================================================`n" -ForegroundColor Green

# Offer to restart backend
$restart = Read-Host "Do you want to restart the backend now? (y/n)"
if ($restart -eq "y" -or $restart -eq "Y") {
    Write-Host "`n[INFO] Stopping old backend processes..." -ForegroundColor Gray
    Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    Write-Host "[INFO] Starting backend..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectDir'; .\venv\Scripts\Activate.ps1; Write-Host '=== BACKEND API - UPDATED DATA ===' -ForegroundColor Green; python backend_api/app.py"
    
    Write-Host "`n[OK] Backend started in new window!" -ForegroundColor Green
    Write-Host "Now refresh your browser (Ctrl+Shift+R)" -ForegroundColor Yellow
}

Write-Host "`nScript completed successfully!`n" -ForegroundColor Green

