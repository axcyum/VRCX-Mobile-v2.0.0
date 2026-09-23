const fs = require('node:fs');
const path = require('node:path');

// Capacitor 8.3 writes Windows separators into Swift string literals during sync.
// Use portable relative paths so a project prepared on Windows also opens on macOS.
const manifestPath = path.resolve(__dirname, '../ios/App/CapApp-SPM/Package.swift');
const source = fs.readFileSync(manifestPath, 'utf8');
const normalized = source.replace(/path: "([^"]+)"/g, (_, value) =>
    `path: "${value.replaceAll('\\', '/')}"`
);
if (source !== normalized) fs.writeFileSync(manifestPath, normalized);
console.log('Verified portable iOS Swift package paths.');
