$content = Get-Content -Path "app_v4.js" -Encoding utf8
$corruptLines = @()
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -like "*Ã*") {
        $corruptLines += [PSCustomObject]@{
            LineNumber = $i + 1
            Text = $content[$i]
        }
    }
}
$corruptLines | Format-Table -AutoSize | Out-String -Width 500 | Out-File -FilePath "lines_with_tilde.txt" -Encoding utf8
Write-Host "Found $($corruptLines.Count) lines containing Ã. Written to lines_with_tilde.txt"
