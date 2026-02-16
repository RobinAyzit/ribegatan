const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth-middleware');
const {
  upload,
  getAllImages,
  uploadImage,
  deleteImage,
  replaceImage,
  getImageUsage
} = require('../services/media-service');

/**
 * GET /api/media/images
 * Hämta alla bilder från alla bildkataloger
 * Validerar: Krav 5.1
 */
router.get('/images', authenticateToken, async (req, res) => {
  try {
    const images = await getAllImages();
    res.json({ images });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Kunde inte hämta bilder'
    });
  }
});

/**
 * POST /api/media/upload
 * Ladda upp en ny bild
 * Validerar: Krav 5.2, 5.3, 5.4
 */
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Ingen fil uppladdad',
        message: 'Vänligen välj en bildfil att ladda upp'
      });
    }

    const directory = req.body.directory || 'img';
    const image = await uploadImage(req.file, directory);

    res.status(201).json({
      success: true,
      image,
      message: 'Bilden laddades upp'
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error.message.includes('Endast JPEG')) {
      return res.status(400).json({
        error: 'Ogiltig filtyp',
        message: error.message
      });
    }

    if (error.message.includes('för stor')) {
      return res.status(413).json({
        error: 'Fil för stor',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Kunde inte ladda upp bilden'
    });
  }
});

/**
 * DELETE /api/media/images/:filename
 * Radera en bild
 * Validerar: Krav 5.6, 5.7
 */
router.delete('/images/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const { directory } = req.query;

    if (!directory) {
      return res.status(400).json({
        error: 'Katalog saknas',
        message: 'Ange vilken katalog bilden finns i'
      });
    }

    // Kontrollera om bilden används
    const usedIn = await getImageUsage(filename);

    if (usedIn.length > 0) {
      return res.status(409).json({
        error: 'Bilden används',
        message: `Bilden används på följande sidor: ${usedIn.join(', ')}`,
        usedIn
      });
    }

    await deleteImage(filename, directory);

    res.json({
      success: true,
      message: 'Bilden raderades'
    });
  } catch (error) {
    console.error('Delete error:', error);

    if (error.message.includes('kunde inte hittas')) {
      return res.status(404).json({
        error: 'Bilden kunde inte hittas',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Kunde inte radera bilden'
    });
  }
});

/**
 * PUT /api/media/images/:filename
 * Ersätt en befintlig bild
 * Validerar: Krav 5.8
 */
router.put('/images/:filename', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { filename } = req.params;
    const { directory } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: 'Ingen fil uppladdad',
        message: 'Vänligen välj en bildfil att ladda upp'
      });
    }

    if (!directory) {
      return res.status(400).json({
        error: 'Katalog saknas',
        message: 'Ange vilken katalog bilden finns i'
      });
    }

    const image = await replaceImage(filename, directory, req.file);

    res.json({
      success: true,
      image,
      message: 'Bilden ersattes'
    });
  } catch (error) {
    console.error('Replace error:', error);

    if (error.message.includes('kunde inte hittas')) {
      return res.status(404).json({
        error: 'Bilden kunde inte hittas',
        message: error.message
      });
    }

    if (error.message.includes('Endast JPEG')) {
      return res.status(400).json({
        error: 'Ogiltig filtyp',
        message: error.message
      });
    }

    if (error.message.includes('för stor')) {
      return res.status(413).json({
        error: 'Fil för stor',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Kunde inte ersätta bilden'
    });
  }
});

module.exports = router;
