const fs = require('fs');
const path = require('path');
const repo = '/Users/dustyncochrane/Documents/GeminiFork';
const file = path.join(repo,'gemini.js');
const backup = file + '.bak';
if(!fs.existsSync(file)){
  console.error('gemini.js not found at', file); process.exit(2);
}
try{
  // backup
  fs.copyFileSync(file, backup);
  const content = fs.readFileSync(file,'utf8');
  const len = content.length;
  const partSize = Math.ceil(len/3);
  const p1 = content.slice(0, partSize);
  const p2 = content.slice(partSize, partSize*2);
  const p3 = content.slice(partSize*2);
  fs.writeFileSync(path.join(repo,'gemini.part1.js'), p1, 'utf8');
  fs.writeFileSync(path.join(repo,'gemini.part2.js'), p2, 'utf8');
  fs.writeFileSync(path.join(repo,'gemini.part3.js'), p3, 'utf8');
  // write combined ES module (.mjs)
  fs.writeFileSync(path.join(repo,'gemini.combined.mjs'), p1 + '\n' + p2 + '\n' + p3, 'utf8');
  // write launcher (ESM) to gemini.js
  const launcher = `#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const child = spawn(process.execPath, [path.join(__dirname,'gemini.combined.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
child.on('error', err => { console.error(err); process.exit(1); });
`;
  fs.writeFileSync(file, launcher, {encoding:'utf8', mode:0o755});
  console.log('Created parts and launcher. Backup saved to', backup);
}catch(err){
  console.error('Error:', err);
  process.exit(1);
}
