import fs from 'fs';
import path from 'path';

const sourceBase = path.resolve('Sito per Fabio', '__SITO PER FABIO');
const targetBase = path.resolve('public', 'images', 'projects');

const projectMappings = [
  {
    folder: '1_FONTI DEL CLITUNNO',
    slug: 'clitunno',
    mdFile: 'src/content/projects/clitunno.md',
    title: 'Clitunno',
    order: 1,
    category: 'Lavoro completato',
  },
  {
    folder: '2_PARIOLI',
    slug: 'parioli',
    mdFile: 'src/content/projects/parioli.md',
    title: 'Parioli',
    order: 2,
    category: 'Lavoro completato',
  },
  {
    folder: '3_MONTE MARIO',
    slug: 'monte-mario',
    mdFile: 'src/content/projects/monte-mario.md',
    title: 'Monte Mario',
    order: 3,
    category: 'Lavoro completato',
  },
  {
    folder: '4_MONTE SACRO',
    slug: 'monte-sacro',
    mdFile: 'src/content/projects/monte-sacro.md',
    title: 'Monte Sacro',
    order: 4,
    category: 'Lavoro completato',
  },
  {
    folder: '5_NOMENTANO',
    slug: 'nomentano',
    mdFile: 'src/content/projects/nomentano.md',
    title: 'Nomentano',
    order: 5,
    category: 'Lavoro completato',
  },
  {
    folder: '6_PRIMAVALLE',
    slug: 'primavalle',
    mdFile: 'src/content/projects/primavalle.md',
    title: 'Primavalle',
    order: 6,
    category: 'Render',
  },
  {
    folder: '7_Golfo di Gaeta',
    slug: 'golfo-di-gaeta',
    mdFile: 'src/content/projects/golfo-di-gaeta.md',
    title: 'Golfo di Gaeta',
    order: 7,
    category: 'Lavoro completato',
  },
  {
    folder: '8_BALDUINA',
    slug: 'balduina',
    mdFile: 'src/content/projects/balduina.md',
    title: 'Balduina',
    order: 8,
    category: 'Render',
  },
];

console.log('Starting sync of project images from Sito per Fabio...');

for (const mapping of projectMappings) {
  const srcFolder = path.join(sourceBase, mapping.folder);
  const destFolder = path.join(targetBase, mapping.slug);

  if (!fs.existsSync(srcFolder)) {
    console.warn(`Source folder does not exist: ${srcFolder}`);
    continue;
  }

  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  // Filter out non-image files (.dng, .pdf)
  const files = fs.readdirSync(srcFolder).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  console.log(`Processing ${mapping.folder} -> ${mapping.slug} (${files.length} images)`);

  // Preserve existing cover file if present, but clear out old project gallery files
  const existingFiles = fs.readdirSync(destFolder);
  const coverFile = existingFiles.find((f) => f.startsWith('cover.'));

  const newCopiedFiles = new Set();

  for (const file of files) {
    const srcPath = path.join(srcFolder, file);
    // clean filename: remove "Copia di ", "Copia di Copia di ", spaces
    let cleanName = file
      .replace(/^Copia di Copia di\s*/i, '')
      .replace(/^Copia di\s*/i, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    const destPath = path.join(destFolder, cleanName);
    fs.copyFileSync(srcPath, destPath);
    newCopiedFiles.add(cleanName);
    console.log(`  Copied ${file} -> ${cleanName}`);
  }

  // Remove old files in destFolder that are not in the new set and not cover.*
  for (const file of existingFiles) {
    if (file === coverFile) continue;
    if (!newCopiedFiles.has(file)) {
      fs.unlinkSync(path.join(destFolder, file));
      console.log(`  Removed obsolete file: ${file}`);
    }
  }
}

console.log('Finished syncing images.');
