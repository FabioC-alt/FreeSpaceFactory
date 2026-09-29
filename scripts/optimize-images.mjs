import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public', 'images');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function optimizeImages() {
  console.log(`Scanning ${imagesDir} for images to optimize...`);
  const allFiles = getFiles(imagesDir);
  const imageFiles = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to process.\n`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  for (const filePath of imageFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const origStat = fs.statSync(filePath);
    const origSizeKB = origStat.size / 1024;
    totalOriginalBytes += origStat.size;

    const relPath = path.relative(process.cwd(), filePath);
    try {
      const inputBuffer = fs.readFileSync(filePath);
      const metadata = await sharp(inputBuffer).metadata();

      let pipeline = sharp(inputBuffer).rotate(); // auto-rotate based on EXIF

      // Max width 1920px for high-res web displays
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      let optimizedBuffer;
      if (ext === '.jpg' || ext === '.jpeg') {
        optimizedBuffer = await pipeline
          .jpeg({ quality: 82, mozjpeg: true, progressive: true })
          .toBuffer();
      } else if (ext === '.png') {
        optimizedBuffer = await pipeline
          .png({ quality: 85, compressionLevel: 9, palette: true })
          .toBuffer();
      }

      if (optimizedBuffer && optimizedBuffer.length < origStat.size) {
        fs.writeFileSync(filePath, optimizedBuffer);
        const newSizeKB = optimizedBuffer.length / 1024;
        totalOptimizedBytes += optimizedBuffer.length;
        const savedPercent = (((origStat.size - optimizedBuffer.length) / origStat.size) * 100).toFixed(1);
        console.log(`✓ ${relPath}: ${(origSizeKB / 1024).toFixed(2)} MB -> ${(newSizeKB / 1024).toFixed(2)} MB (-${savedPercent}%)`);
      } else {
        totalOptimizedBytes += origStat.size;
        console.log(`- ${relPath}: already optimal (${origSizeKB.toFixed(1)} KB)`);
      }
    } catch (err) {
      console.error(`✕ Error optimizing ${relPath}:`, err.message);
      totalOptimizedBytes += origStat.size;
    }
  }

  const origMB = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const optMB = (totalOptimizedBytes / (1024 * 1024)).toFixed(2);
  const totalSavedPercent = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);

  console.log(`\n========================================`);
  console.log(`Image Optimization Summary:`);
  console.log(`Original total:  ${origMB} MB`);
  console.log(`Optimized total: ${optMB} MB`);
  console.log(`Saved:           ${(origMB - optMB).toFixed(2)} MB (${totalSavedPercent}% reduction)`);
  console.log(`========================================\n`);
}

optimizeImages();
