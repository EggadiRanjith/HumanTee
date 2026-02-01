$har = Get-Content "c:\Users\Ranjith\Downloads\humantee.in.har" -Raw | ConvertFrom-Json

Write-Host "`n=== PRODUCTION API ANALYSIS ===" -ForegroundColor Cyan
Write-Host "Total Requests: $($har.log.entries.Count)" -ForegroundColor White

# Filter API calls
$apiCalls = $har.log.entries | Where-Object { 
    $_.request.url -match 'api\.humantee\.in' 
} | ForEach-Object {
    $url = $_.request.url -replace 'https?://api\.humantee\.in', ''
    $url = $url -replace '\?.*$', '' # Remove query params
    
    [PSCustomObject]@{
        Endpoint  = $url
        Method    = $_.request.method
        Status    = $_.response.status
        TotalTime = [math]::Round($_.time, 0)
        TTFB      = [math]::Round($_.timings.wait, 0)
        DNS       = [math]::Round($_.timings.dns, 0)
        Connect   = [math]::Round($_.timings.connect, 0)
        SSL       = [math]::Round($_.timings.ssl, 0)
        Send      = [math]::Round($_.timings.send, 0)
        Receive   = [math]::Round($_.timings.receive, 0)
    }
}

# RSC (React Server Component) calls
$rscCalls = $har.log.entries | Where-Object { 
    $_.request.url -match '\?_rsc=' 
} | ForEach-Object {
    $url = $_.request.url -replace 'https?://humantee\.in', ''
    $url = $url -replace '\?_rsc=.*$', ''
    
    [PSCustomObject]@{
        Page      = $url
        TotalTime = [math]::Round($_.time, 0)
        TTFB      = [math]::Round($_.timings.wait, 0)
    }
}

Write-Host "`n--- API CALLS (api.humantee.in) ---" -ForegroundColor Yellow
Write-Host "Total API Calls: $($apiCalls.Count)" -ForegroundColor White
$apiCalls | Format-Table Endpoint, Method, Status, TotalTime, TTFB -AutoSize

Write-Host "`n--- DUPLICATE API ENDPOINTS ---" -ForegroundColor Red
$apiCalls | Group-Object Endpoint | Where-Object { $_.Count -gt 1 } | ForEach-Object {
    Write-Host "`n$($_.Name) - Called $($_.Count) times" -ForegroundColor Red
    $_.Group | Format-Table Method, Status, TotalTime, TTFB -AutoSize
}

Write-Host "`n--- RSC (React Server Component) CALLS ---" -ForegroundColor Cyan
Write-Host "Total RSC Calls: $($rscCalls.Count)" -ForegroundColor White
$rscCalls | Group-Object Page | ForEach-Object {
    Write-Host "`n$($_.Name) - Loaded $($_.Count) times" -ForegroundColor Yellow
    $_.Group | Format-Table TotalTime, TTFB -AutoSize
}

Write-Host "`n--- PERFORMANCE BREAKDOWN ---" -ForegroundColor Green
if ($apiCalls.Count -gt 0) {
    Write-Host "`nAPI Calls:" -ForegroundColor White
    $apiCalls | Measure-Object -Property TotalTime, TTFB -Average -Maximum | 
    Select-Object Property, @{N = 'Avg (ms)'; E = { [math]::Round($_.Average, 0) } }, @{N = 'Max (ms)'; E = { $_.Maximum } } | 
    Format-Table -AutoSize
}

if ($rscCalls.Count -gt 0) {
    Write-Host "`nRSC Calls:" -ForegroundColor White
    $rscCalls | Measure-Object -Property TotalTime, TTFB -Average -Maximum | 
    Select-Object Property, @{N = 'Avg (ms)'; E = { [math]::Round($_.Average, 0) } }, @{N = 'Max (ms)'; E = { $_.Maximum } } | 
    Format-Table -AutoSize
}

Write-Host "`n--- SLOWEST ENDPOINTS ---" -ForegroundColor Red
$apiCalls | Sort-Object TotalTime -Descending | Select-Object -First 5 | Format-Table Endpoint, Method, TotalTime, TTFB -AutoSize
