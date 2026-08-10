const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const stats = fs.statSync(fullPath);
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      // Use exact birthtime/ctime and mtime
      content.createdAt = stats.birthtime.toISOString();
      content.updatedAt = stats.mtime.toISOString();

      if (content.status === 'published' || content.status === 'approved') {
        content.publishedAt = stats.mtime.toISOString();
      }

      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2), 'utf8');
      console.log(`Updated ${entry.name} -> Created: ${content.createdAt}, Modified: ${content.updatedAt}`);
    }
  }
}

const articulosDir = path.join(__dirname, '..', 'src', 'data', 'articulos');
const instruccionesDir = path.join(__dirname, '..', 'src', 'data', 'instrucciones');

processDir(articulosDir);
processDir(instruccionesDir);
