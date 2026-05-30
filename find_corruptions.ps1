$content = Get-Content -Path "app_v4.js" -Raw -Encoding utf8
$matches = [RegEx]::Matches($content, '\b\w*Ã[^\s"''`{<>]*\w*\b')
$unique = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
$unique | Out-File -FilePath "corruptions.txt" -Encoding utf8
Write-Host "Found $($unique.Count) unique corruptions. Written to corruptions.txt"
