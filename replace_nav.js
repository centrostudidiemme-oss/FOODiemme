const fs = require('fs');
let code = fs.readFileSync('app_v4.js', 'utf8');

// Update App object to include navigateBack
if (!code.includes('navigateBack() {')) {
  code = code.replace(/renderView\(view\) \{/, `navigateBack() {
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
    }`);
}

// Replace Indietro button onclicks
const rgx = /onclick="App\.renderView\('[^']+'\)"([^>]*>.*?)Indietro/g;
code = code.replace(rgx, 'onclick="App.navigateBack()"$1Indietro');

fs.writeFileSync('app_v4.js', code, 'utf8');
console.log('Replaced Indietro occurrences.');
