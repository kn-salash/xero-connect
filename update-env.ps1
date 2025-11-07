# Update .env file with Cloudflare tunnel URL
$tunnelUrl = "https://myers-professional-develops-ted.trycloudflare.com"
$redirectUri = "$tunnelUrl/callback"

$envFile = ".env"
$content = Get-Content $envFile

$newContent = @()
$redirectUpdated = $false
$frontendUpdated = $false

foreach ($line in $content) {
    if ($line -match "^XERO_REDIRECT_URI=") {
        $newContent += "XERO_REDIRECT_URI=$redirectUri"
        $redirectUpdated = $true
    }
    elseif ($line -match "^FRONTEND_URL=") {
        $newContent += "FRONTEND_URL=$tunnelUrl"
        $frontendUpdated = $true
    }
    else {
        $newContent += $line
    }
}

if (-not $redirectUpdated) {
    $newContent += "XERO_REDIRECT_URI=$redirectUri"
}

if (-not $frontendUpdated) {
    $newContent += "FRONTEND_URL=$tunnelUrl"
}

$newContent | Set-Content $envFile

Write-Host ".env file updated successfully!"
Write-Host "XERO_REDIRECT_URI=$redirectUri"
Write-Host "FRONTEND_URL=$tunnelUrl"
