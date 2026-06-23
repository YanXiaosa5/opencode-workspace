#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'src', 'i18n', 'messages');
const enFile = path.join(messagesDir, 'en.json');

if (!fs.existsSync(enFile)) {
  console.error('en.json not found, skipping sync.');
  process.exit(0);
}

const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const enKeys = Object.keys(en);

const files = fs.readdirSync(messagesDir).filter(
  f => f.endsWith('.json') && f !== 'en.json'
);

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let added = 0;

  for (const key of enKeys) {
    if (!locale[key]) {
      locale[key] = { defaultMessage: en[key].defaultMessage };
      added++;
    }
  }

  if (added > 0) {
    fs.writeFileSync(filePath, JSON.stringify(locale, null, 2) + '\n');
    console.log(`Synced ${added} missing key(s) to ${file}`);
  } else {
    console.log(`${file} is up to date.`);
  }
}
