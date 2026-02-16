/**
 * Content Editor Module
 * Hanterar inlägg, sidor och stilar
 * Validerar: Krav 2, 3, 4
 */

const API_BASE_URL = 'http://localhost:3000/api';

const ContentEditor = {
  currentPost: null,

  /**
   * Hämta alla inlägg
   * Validerar: Krav 2.1
   */
  async loadPosts() {
    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/content/posts`);
      const data = await response.json();
      this.renderPosts(data.posts);
      return data.posts;
    } catch (error) {
      console.error('Load posts error:', error);
      showToast('Kunde inte ladda inlägg', 'error');
    }
  },

  /**
   * Rendera inläggslista
   */
  renderPosts(posts) {
    const postsList = document.getElementById('posts-list');
    
    if (!posts || posts.length === 0) {
      postsList.innerHTML = '<p class="info-text">Inga inlägg ännu. Skapa ditt första inlägg!</p>';
      return;
    }

    postsList.innerHTML = posts.map(post => `
      <div class="item-card" data-id="${post.id}">
        <div class="item-info">
          <h3>${post.title}</h3>
          <p>${post.category} • ${new Date(post.createdAt).toLocaleDateString('sv-SE')}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary btn-edit-post" data-id="${post.id}">Redigera</button>
          <button class="btn btn-secondary btn-delete-post" data-id="${post.id}">Radera</button>
        </div>
      </div>
    `).join('');

    // Lägg till event listeners
    document.querySelectorAll('.btn-edit-post').forEach(btn => {
      btn.addEventListener('click', (e) => this.editPost(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-delete-post').forEach(btn => {
      btn.addEventListener('click', (e) => this.deletePost(e.target.dataset.id));
    });
  },

  /**
   * Visa formulär för nytt inlägg
   * Validerar: Krav 2.2
   */
  showNewPostForm() {
    this.currentPost = null;
    document.getElementById('post-editor-title').textContent = 'Nytt inlägg';
    document.getElementById('post-title').value = '';
    document.getElementById('post-category').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-editor').classList.remove('hidden');
    document.getElementById('posts-list').classList.add('hidden');
  },

  /**
   * Redigera befintligt inlägg
   * Validerar: Krav 2.4
   */
  async editPost(postId) {
    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/content/posts/${postId}`);
      const data = await response.json();
      
      this.currentPost = data.post;
      document.getElementById('post-editor-title').textContent = 'Redigera inlägg';
      document.getElementById('post-title').value = data.post.title;
      document.getElementById('post-category').value = data.post.category;
      document.getElementById('post-content').value = data.post.content;
      document.getElementById('post-editor').classList.remove('hidden');
      document.getElementById('posts-list').classList.add('hidden');
    } catch (error) {
      console.error('Edit post error:', error);
      showToast('Kunde inte ladda inlägg', 'error');
    }
  },

  /**
   * Spara inlägg (skapa eller uppdatera)
   * Validerar: Krav 2.3, 2.5
   */
  async savePost(formData) {
    try {
      const url = this.currentPost 
        ? `${API_BASE_URL}/content/posts/${this.currentPost.id}`
        : `${API_BASE_URL}/content/posts`;
      
      const method = this.currentPost ? 'PUT' : 'POST';

      const response = await Auth.fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Kunde inte spara inlägg');
      }

      showToast(this.currentPost ? 'Inlägg uppdaterat' : 'Inlägg skapat', 'success');
      this.cancelPostEdit();
      await this.loadPosts();
    } catch (error) {
      console.error('Save post error:', error);
      showToast('Kunde inte spara inlägg', 'error');
    }
  },

  /**
   * Radera inlägg
   * Validerar: Krav 2.6, 2.7
   */
  async deletePost(postId) {
    if (!confirm('Är du säker på att du vill radera detta inlägg?')) {
      return;
    }

    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/content/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Kunde inte radera inlägg');
      }

      showToast('Inlägg raderat', 'success');
      await this.loadPosts();
    } catch (error) {
      console.error('Delete post error:', error);
      showToast('Kunde inte radera inlägg', 'error');
    }
  },

  /**
   * Avbryt redigering
   */
  cancelPostEdit() {
    this.currentPost = null;
    document.getElementById('post-editor').classList.add('hidden');
    document.getElementById('posts-list').classList.remove('hidden');
  },

  /**
   * Hämta alla sidor
   * Validerar: Krav 3.1, 6.2
   */
  async loadPages() {
    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/content/pages`);
      const data = await response.json();
      this.renderPages(data.pages);
      return data.pages;
    } catch (error) {
      console.error('Load pages error:', error);
      showToast('Kunde inte ladda sidor', 'error');
    }
  },

  /**
   * Rendera sidlista
   */
  renderPages(pages) {
    const pagesList = document.getElementById('pages-list');
    
    if (!pages || pages.length === 0) {
      pagesList.innerHTML = '<p class="info-text">Inga sidor hittades.</p>';
      return;
    }

    pagesList.innerHTML = pages.map(page => `
      <div class="item-card">
        <div class="item-info">
          <h3>${page.title || page.filename}</h3>
          <p>${page.filename} • ${new Date(page.lastModified).toLocaleDateString('sv-SE')}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary" onclick="alert('Sidredigering kommer snart!')">Redigera</button>
        </div>
      </div>
    `).join('');
  },

  /**
   * Tillämpa stiländring
   * Validerar: Krav 4.3, 4.4
   */
  async applyStyle(selector, property, value) {
    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/content/styles`, {
        method: 'PUT',
        body: JSON.stringify({ selector, property, value })
      });

      if (!response.ok) {
        throw new Error('Kunde inte tillämpa stil');
      }

      showToast('Stil uppdaterad', 'success');
    } catch (error) {
      console.error('Apply style error:', error);
      showToast('Kunde inte tillämpa stil', 'error');
    }
  }
};

// Event listeners för inläggsformulär
document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('post-title').value,
        category: document.getElementById('post-category').value,
        content: document.getElementById('post-content').value
      };

      await ContentEditor.savePost(formData);
    });
  }

  const cancelPostBtn = document.getElementById('cancel-post-btn');
  if (cancelPostBtn) {
    cancelPostBtn.addEventListener('click', () => {
      ContentEditor.cancelPostEdit();
    });
  }

  const newPostBtn = document.getElementById('new-post-btn');
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
      ContentEditor.showNewPostForm();
    });
  }

  const applyStyleBtn = document.getElementById('apply-style-btn');
  if (applyStyleBtn) {
    applyStyleBtn.addEventListener('click', async () => {
      const selector = document.getElementById('style-selector').value;
      const property = document.getElementById('style-property').value;
      const value = document.getElementById('style-value').value;

      if (!selector) {
        showToast('Ange en CSS-selektor', 'error');
        return;
      }

      await ContentEditor.applyStyle(selector, property, value);
    });
  }
});
