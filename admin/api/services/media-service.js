const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

/**
 * MediaService - Hanterar bilduppladdning, radering och ersättning
 * Validerar: Krav 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8
 */

// Tillåtna bildformat
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Bildkataloger relativt till projektets rot
const IMAGE_DIRECTORIES = ['img', 'res', 'assets'];

/**
 * Konfigurera multer för filuppladdning
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Endast JPEG, PNG, GIF och WebP stöds'), false);
    }
  }
});

/**
 * Hämta alla bilder från alla bildkataloger
 * Validerar: Krav 5.1
 */
async function getAllImages() {
  const images = [];
  
  for (const dir of IMAGE_DIRECTORIES) {
    const dirPath = path.join(process.cwd(), dir);
    
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile() && isImageFile(file)) {
          images.push({
            filename: file,
            path: `${dir}/${file}`,
            directory: dir,
            size: stats.size,
            uploadedAt: stats.mtime.toISOString()
          });
        }
      }
    } catch (error) {
      // Om katalogen inte finns, fortsätt till nästa
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  
  return images;
}

/**
 * Ladda upp en bild till angiven katalog
 * Validerar: Krav 5.2, 5.3, 5.4
 */
async function uploadImage(file, directory = 'img') {
  // Validera katalog
  if (!IMAGE_DIRECTORIES.includes(directory)) {
    throw new Error(`Ogiltig katalog. Tillåtna: ${IMAGE_DIRECTORIES.join(', ')}`);
  }
  
  // Validera filtyp
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('Endast JPEG, PNG, GIF och WebP stöds');
  }
  
  // Validera filstorlek
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Filen är för stor (max 10MB)');
  }
  
  // Säkerställ att katalogen finns
  const dirPath = path.join(process.cwd(), directory);
  await fs.mkdir(dirPath, { recursive: true });
  
  // Sanitera filnamn
  const filename = sanitizeFilename(file.originalname);
  const filePath = path.join(dirPath, filename);
  
  // Spara filen
  await fs.writeFile(filePath, file.buffer);
  
  // Returnera bildinfo
  const stats = await fs.stat(filePath);
  return {
    filename,
    path: `${directory}/${filename}`,
    directory,
    size: stats.size,
    uploadedAt: stats.mtime.toISOString()
  };
}

/**
 * Radera en bild
 * Validerar: Krav 5.7
 */
async function deleteImage(filename, directory) {
  const filePath = path.join(process.cwd(), directory, filename);
  
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Bilden kunde inte hittas');
    }
    throw error;
  }
}

/**
 * Ersätt en befintlig bild
 * Validerar: Krav 5.8
 */
async function replaceImage(filename, directory, file) {
  // Validera att bilden finns
  const filePath = path.join(process.cwd(), directory, filename);
  
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error('Bilden kunde inte hittas');
  }
  
  // Validera ny fil
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('Endast JPEG, PNG, GIF och WebP stöds');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Filen är för stor (max 10MB)');
  }
  
  // Ersätt filen (behåll samma filnamn)
  await fs.writeFile(filePath, file.buffer);
  
  // Returnera uppdaterad bildinfo
  const stats = await fs.stat(filePath);
  return {
    filename,
    path: `${directory}/${filename}`,
    directory,
    size: stats.size,
    uploadedAt: stats.mtime.toISOString()
  };
}

/**
 * Hitta var en bild används på webbplatsen
 * Validerar: Krav 5.6
 */
async function getImageUsage(filename) {
  const usedIn = [];
  const rootDir = process.cwd();
  
  // Sök i HTML-filer
  const htmlFiles = await findHtmlFiles(rootDir);
  
  for (const htmlFile of htmlFiles) {
    const content = await fs.readFile(htmlFile, 'utf-8');
    if (content.includes(filename)) {
      // Gör sökvägen relativ till projektroten
      const relativePath = path.relative(rootDir, htmlFile);
      usedIn.push(relativePath);
    }
  }
  
  return usedIn;
}

/**
 * Hjälpfunktion: Hitta alla HTML-filer i en katalog
 */
async function findHtmlFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      // Hoppa över node_modules och .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'admin') {
        await findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Hjälpfunktion: Kontrollera om en fil är en bildfil
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

/**
 * Hjälpfunktion: Sanitera filnamn
 */
function sanitizeFilename(filename) {
  // Ta bort farliga tecken och path traversal
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/_+/g, '_');
}

module.exports = {
  upload,
  getAllImages,
  uploadImage,
  deleteImage,
  replaceImage,
  getImageUsage
};
