$content = Get-Content app_v4.js -Raw

# Update renderView to handle history
if ($content -notmatch "navigateBack\(\) \{") {
    $content = $content -replace "renderView\(view\) \{", "navigateBack() {
    if (this.viewHistory && this.viewHistory.length > 0) {
      const prevView = this.viewHistory.pop();
      this.renderView(prevView, true);
    } else {
      this.renderView('dashboard');
    }
  },

  renderView(view, skipHistory = false) {
    if (!skipHistory && this.currentView && this.currentView !== view) {
      if (!this.viewHistory) this.viewHistory = [];
      this.viewHistory.push(this.currentView);
    }"
}

# Replace onclick handlers for Indietro
$content = [regex]::Replace($content, "onclick=`"App\.renderView\('[^']+'\)`"([^>]*>.*?)Indietro", "onclick=`"App.navigateBack()`"$1Indietro")

Set-Content -Path app_v4.js -Value $content -Encoding UTF8
Write-Host "Replaced occurrences."
