const fs = require('fs');
const content = fs.readFileSync('app_v4.js', 'utf8');

const regex = /[\w]*Ã[^\s"'{<>]*[\w]*/g;
const matches = content.match(regex);
const unique = Array.from(new Set(matches));

console.log('Found', unique.length, 'unique corrupted patterns:');
console.log(JSON.stringify(unique, null, 2));
