import fs from 'fs';
import path from 'path';

const projectsDir = 'src/content/projects';
const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.md'));
const projects = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
  const titleMatch = content.match(/title:\s*"(.*)"/);
  const orderMatch = content.match(/order:\s*(\d+)/);
  const coverMatch = content.match(/coverImage:\s*"(.*)"/);
  const galleryMatches = [...content.matchAll(/src:\s*"(.*)"/g)].map((m) => m[1]);
  projects.push({
    file,
    title: titleMatch ? titleMatch[1] : 'unknown',
    order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
    cover: coverMatch ? coverMatch[1] : 'none',
    galleryCount: galleryMatches.length,
    gallery: galleryMatches,
  });
}

projects.sort((a, b) => a.order - b.order);
console.log('Final Projects Order & Galleries:');
let allValid = true;
for (const p of projects) {
  console.log(`#${p.order}: ${p.title} (${p.file}) - ${p.galleryCount} gallery images, cover: ${p.cover}`);
  const coverPath = path.join('public', p.cover.replace(/^\//, ''));
  if (!fs.existsSync(coverPath)) {
    console.error(`   ❌ [MISSING COVER!] ${p.cover}`);
    allValid = false;
  }
  for (const src of p.gallery) {
    const fullPath = path.join('public', src.replace(/^\//, ''));
    if (!fs.existsSync(fullPath)) {
      console.error(`   ❌ [MISSING GALLERY FILE!] ${src}`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log('\n✅ All projects, orders, covers, and gallery files are verified and exist on disk!');
}
