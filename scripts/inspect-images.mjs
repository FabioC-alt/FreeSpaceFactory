import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('Sito per Fabio', '__SITO PER FABIO');
if (!fs.existsSync(baseDir)) {
  console.log('Base dir does not exist:', baseDir);
  process.exit(1);
}

const folders = fs.readdirSync(baseDir);
console.log('Folders found:', folders);

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    console.log(`\n=== ${folder} (${files.length} files) ===`);
    for (const f of files) {
      const stats = fs.statSync(path.join(folderPath, f));
      console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  }
}
