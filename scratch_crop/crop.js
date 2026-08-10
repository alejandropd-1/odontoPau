const sharp = require('sharp');
const path = require('path');

const inputImagePath = path.join(__dirname, '../public/images/articulos/registro-clinico-estetica-dental-caso-04/registro-03.webp');
const outputImagePath = path.join(__dirname, '../public/images/articulos/registro-clinico-estetica-dental-caso-04/registro-03_cropped.webp');

async function cropImage() {
  try {
    const metadata = await sharp(inputImagePath).metadata();
    
    // We want to crop out the top part to hide the eyes.
    // Let's crop the top 35% of the image.
    const cropTop = Math.floor(metadata.height * 0.35);
    const newHeight = metadata.height - cropTop;

    await sharp(inputImagePath)
      .extract({ left: 0, top: cropTop, width: metadata.width, height: newHeight })
      .toFile(outputImagePath);
      
    console.log('Successfully cropped the image.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

cropImage();
