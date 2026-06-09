$path = "c:\Users\Studiodiemme\Desktop\Antigravity\app_v4.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$pattern = 'originModule: ''Ambienti e Strutture'',\s*description: `Anomalie riscontrate nel Controllo Ambiente: \${envName}\. Elementi non conformi: \${ncItems}\.`,\s*correctiveAction: '''',\s*isClosed: false,'

if ($content -match $pattern) {
    Write-Host "Match found!"
    $replacement = 'originModule: ''Ambienti e Strutture'',
                description: `Anomalie riscontrate nel Controllo Ambiente: ${envName}. Elementi non conformi: ${ncItems}.`,
                correctiveAction: '''',
                dueDate: date,
                isClosed: false,'
    $newContent = $content -replace $pattern, $replacement
    [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced successfully!"
} else {
    Write-Host "No match found."
}
