const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = 'G:/Mi unidad/laburo/Pau/odonto/web/subir/ortopedia/caso-01';
const outputDir = 'c:/www/odontoPau/public/images/casos/ortopedia/caso-01';

async function processImages() {
  const files = [
    { in: '1.jpeg', out: 'foto-01.webp' },
    { in: '2.jpeg', out: 'foto-02.webp' },
    { in: '3.jpeg', out: 'foto-03.webp' },
    { in: '4.jpeg', out: 'foto-04.webp' }
  ];

  for (const file of files) {
    const inputPath = path.join(inputDir, file.in);
    const outputPath = path.join(outputDir, file.out);
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Processed ${file.in} -> ${file.out}`);
    } catch (err) {
      console.error(`Error processing ${file.in}:`, err);
    }
  }
}

processImages();
