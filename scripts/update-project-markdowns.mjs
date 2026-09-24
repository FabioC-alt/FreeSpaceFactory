import fs from 'fs';
import path from 'path';

const projectUpdates = {
  'monte-mario.md': {
    gallery: [
      { src: '/images/projects/monte-mario/1.jpg', alt: 'Monte Mario, atrio e ingresso', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/2.jpg', alt: 'Monte Mario, corridoio', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/3.jpg', alt: 'Monte Mario, soggiorno', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/4.jpg', alt: 'Monte Mario, salone e libreria continua', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/5.jpg', alt: 'Monte Mario, dettaglio libreria', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/6.jpg', alt: 'Monte Mario, passaggio verso zona notte', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/7.jpg', alt: 'Monte Mario, zona giorno', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/8.jpg', alt: 'Monte Mario, vista d\'insieme', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/9.jpg', alt: 'Monte Mario, zona notte', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/10.jpg', alt: 'Monte Mario, camera', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/11.jpg', alt: 'Monte Mario, bagno', category: 'Lavoro completato' },
      { src: '/images/projects/monte-mario/12.jpg', alt: 'Monte Mario, dettaglio finiture', category: 'Lavoro completato' },
    ],
  },
  'nomentano.md': {
    gallery: [
      { src: '/images/projects/nomentano/1.jpg', alt: 'Nomentano, zona giorno open space', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/2.jpg', alt: 'Nomentano, libreria e mobile TV', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/3.jpg', alt: 'Nomentano, vista soggiorno', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/4_mod.jpg', alt: 'Nomentano, corridoio e illuminazione', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/5_mod.jpg', alt: 'Nomentano, zona notte', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/6.jpg', alt: 'Nomentano, camera da letto', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/7_mod.jpg', alt: 'Nomentano, bagno', category: 'Lavoro completato' },
      { src: '/images/projects/nomentano/8.jpg', alt: 'Nomentano, dettaglio arredi su misura', category: 'Lavoro completato' },
    ],
  },
  'clitunno.md': {
    gallery: [
      { src: '/images/projects/clitunno/1.jpg', alt: 'Clitunno, zona giorno open space', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/2.jpg', alt: 'Clitunno, dettaglio struttura e travi a vista', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/2a.jpg', alt: 'Clitunno, prospettiva zona giorno', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/2b.jpg', alt: 'Clitunno, scala e soppalco', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/2c.jpg', alt: 'Clitunno, vista dall\'alto', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/3.jpg', alt: 'Clitunno, cucina e bancone', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/4.jpg', alt: 'Clitunno, finiture in legno di castagno', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/4a.jpg', alt: 'Clitunno, camera da letto', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/4b.jpg', alt: 'Clitunno, dettaglio zona notte', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/5.jpg', alt: 'Clitunno, bagno con accenti di colore', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/6.jpg', alt: 'Clitunno, secondo bagno', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/6a.jpg', alt: 'Clitunno, dettaglio rivestimenti', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/7.jpg', alt: 'Clitunno, illuminazione industriale', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/7b.jpg', alt: 'Clitunno, elementi metallici e cemento', category: 'Lavoro completato' },
      { src: '/images/projects/clitunno/8.jpg', alt: 'Clitunno, panoramica loft', category: 'Lavoro completato' },
    ],
  },
  'parioli.md': {
    gallery: [
      { src: '/images/projects/parioli/1_ant5224.png', alt: 'Parioli, pavimenti storici recuperati e zona giorno', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/2_ant5105.png', alt: 'Parioli, salone con porte originali', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/3_ant5091.png', alt: 'Parioli, scorcio living', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/4_ant5045_marmo.png', alt: 'Parioli, dettaglio isola e marmo', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/5_ant5058.png', alt: 'Parioli, cucina contemporanea', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/6_ant5127.png', alt: 'Parioli, zona pranzo', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/7_ant5141.png', alt: 'Parioli, disimpegno e dettagli d\'epoca', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/8_ant5157.png', alt: 'Parioli, camera padronale', category: 'Lavoro completato' },
      { src: '/images/projects/parioli/9_ant5162.png', alt: 'Parioli, bagno con finiture eleganti', category: 'Lavoro completato' },
    ],
  },
  'monte-sacro.md': {
    gallery: [
      { src: '/images/projects/monte-sacro/1.jpg', alt: 'Monte Sacro, linee curve concentriche', category: 'Lavoro completato' },
      { src: '/images/projects/monte-sacro/2.jpg', alt: 'Monte Sacro, distribuzione degli spazi', category: 'Lavoro completato' },
      { src: '/images/projects/monte-sacro/3.jpg', alt: 'Monte Sacro, vista prospettica', category: 'Lavoro completato' },
      { src: '/images/projects/monte-sacro/4.jpg', alt: 'Monte Sacro, dettaglio arredi e finiture', category: 'Lavoro completato' },
      { src: '/images/projects/monte-sacro/5.jpg', alt: 'Monte Sacro, zona notte', category: 'Lavoro completato' },
    ],
  },
  'primavalle.md': {
    gallery: [
      { src: '/images/projects/primavalle/01a_sala-1.png', alt: 'Primavalle, render della sala e boiserie', category: 'Render' },
      { src: '/images/projects/primavalle/01b_sala-2.png', alt: 'Primavalle, prospettiva alternativa zona giorno', category: 'Render' },
      { src: '/images/projects/primavalle/02a_camera.png', alt: 'Primavalle, render della camera padronale', category: 'Render' },
      { src: '/images/projects/primavalle/02b_camera.png', alt: 'Primavalle, vista dettagli camera', category: 'Render' },
      { src: '/images/projects/primavalle/03a_studio.jpeg', alt: 'Primavalle, studio/cameretta', category: 'Render' },
      { src: '/images/projects/primavalle/03b_studio.png', alt: 'Primavalle, render dello studio', category: 'Render' },
      { src: '/images/projects/primavalle/04e_bagno.png', alt: 'Primavalle, render del bagno', category: 'Render' },
      { src: '/images/projects/primavalle/04f_bagno.png', alt: 'Primavalle, prospettiva bagno', category: 'Render' },
    ],
  },
  'balduina.md': {
    gallery: [
      { src: '/images/projects/balduina/1.png', alt: 'Balduina, render dello studio distributivo', category: 'Render' },
      { src: '/images/projects/balduina/2.jpg', alt: 'Balduina, tavola di progetto', category: 'Render' },
      { src: '/images/projects/balduina/3.jpg', alt: 'Balduina, studio distributivo', category: 'Render' },
      { src: '/images/projects/balduina/sala-1.2.png', alt: 'Balduina, vista soggiorno e arredi', category: 'Render' },
      { src: '/images/projects/balduina/sala-2.2.png', alt: 'Balduina, studio della zona giorno', category: 'Render' },
    ],
  },
};

const baseDir = path.resolve('src/content/projects');

for (const [filename, data] of Object.entries(projectUpdates)) {
  const filePath = path.join(baseDir, filename);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  // Replace the gallery: section
  const galleryYaml = 'gallery:\n' + data.gallery.map(item => `  - src: "${item.src}"\n    alt: "${item.alt}"\n    category: "${item.category}"`).join('\n');
  
  const updatedContent = content.replace(/gallery:\s*(\n\s+-\s+src:[\s\S]*?)(?=---\n)/, galleryYaml + '\n');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Updated ${filename} with ${data.gallery.length} images`);
}
