// Content Routes
const express = require('express');
const router = express.Router();
const contentService = require('../services/content-service');
const { authenticateToken } = require('../middleware/auth-middleware');

// Alla routes kräver autentisering
router.use(authenticateToken);

// ============ Inlägg (Posts) ============

// GET /api/content/posts - Hämta alla inlägg
router.get('/posts', async (req, res) => {
  try {
    const posts = await contentService.getAllPosts();
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// GET /api/content/posts/:id - Hämta specifikt inlägg
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await contentService.getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Inlägget kunde inte hittas' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// POST /api/content/posts - Skapa nytt inlägg
router.post('/posts', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Titel och innehåll krävs' });
    }
    
    const post = await contentService.createPost({ title, content, category });
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// PUT /api/content/posts/:id - Uppdatera inlägg
router.put('/posts/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await contentService.updatePost(req.params.id, { title, content, category });
    
    if (!post) {
      return res.status(404).json({ error: 'Inlägget kunde inte hittas' });
    }
    
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// DELETE /api/content/posts/:id - Radera inlägg
router.delete('/posts/:id', async (req, res) => {
  try {
    const deleted = await contentService.deletePost(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Inlägget kunde inte hittas' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// ============ Sidor (Pages) ============

// GET /api/content/pages - Hämta alla sidor
router.get('/pages', async (req, res) => {
  try {
    const pages = await contentService.getAllPages();
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// GET /api/content/pages/:filename - Hämta specifik sida
router.get('/pages/:filename', async (req, res) => {
  try {
    const page = await contentService.getPage(req.params.filename);
    
    if (!page) {
      return res.status(404).json({ error: 'Sidan kunde inte hittas' });
    }
    
    res.json({ page });
  } catch (error) {
    if (error.message.includes('Ogiltigt filnamn')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

// PUT /api/content/pages/:filename - Uppdatera sida
router.put('/pages/:filename', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Innehåll krävs' });
    }
    
    const page = await contentService.updatePage(req.params.filename, content);
    
    if (!page) {
      return res.status(404).json({ error: 'Sidan kunde inte hittas' });
    }
    
    res.json({ page });
  } catch (error) {
    console.error('Error updating page:', error);
    if (error.message.includes('Ogiltigt')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Ett internt serverfel inträffade', details: error.message });
  }
});

// ============ Stilar (Styles) ============

// PUT /api/content/styles - Uppdatera CSS-stilar
router.put('/styles', async (req, res) => {
  try {
    const { selector, property, value, cssFile } = req.body;
    
    if (!selector || !property || value === undefined) {
      return res.status(400).json({ error: 'Selektor, egenskap och värde krävs' });
    }
    
    await contentService.updateStyle(selector, property, value, cssFile);
    res.json({ success: true });
  } catch (error) {
    if (error.message.includes('Ogiltig')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('kunde inte hittas')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Ett internt serverfel inträffade' });
  }
});

module.exports = router;
