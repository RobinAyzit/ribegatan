/**
 * Media Manager Module
 * Hanterar bilduppladdning, radering och ersättning
 * Validerar: Krav 5
 */

const API_BASE_URL = 'http://localhost:3000/api';

const MediaManager = {
  /**
   * Hämta alla bilder
   * Validerar: Krav 5.1
   */
  async loadImages() {
    try {
      const response = await Auth.fetchWithAuth(`${API_BASE_URL}/media/images`);
      const data = await response.json();
      this.renderImages(data.images);
      return data.images;
    } catch (error) {
      console.error('Load images error:', error);
      showToast('Kunde inte ladda bilder', 'error');
    }
  },

  /**
   * Rendera bildgalleri
   */
  renderImages(images) {
    const imagesGrid = document.getElementById('images-grid');
    
    if (!images || images.length === 0) {
      imagesGrid.innerHTML = '<p class="info-text">Inga bilder ännu. Ladda upp din första bild!</p>';
      return;
    }

    imagesGrid.innerHTML = images.map(image => `
      <div class="image-card" data-filename="${image.filename}" data-directory="${image.directory}">
        <img src="/${image.path}" alt="${image.filename}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EBild%3C/text%3E%3C/svg%3E'">
        <div class="image-info">
          <p><strong>${image.filename}</strong></p>
          <p>${image.directory}/ • ${(image.size / 1024).toFixed(1)} KB</p>
        </div>
        <div class="image-actions">
          <button class="btn btn-secondary btn-delete-image" data-filename="${image.filename}" data-directory="${image.directory}">Radera</button>
        </div>
      </div>
    `).join('');

    // Lägg till event listeners
    document.querySelectorAll('.btn-delete-image').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.deleteImage(e.target.dataset.filename, e.target.dataset.directory);
      });
    });
  },

  /**
   * Visa uppladdningsformulär
   */
  showUploadForm() {
    document.getElementById('upload-form').classList.remove('hidden');
  },

  /**
   * Dölj uppladdningsformulär
   */
  hideUploadForm() {
    document.getElementById('upload-form').classList.add('hidden');
    document.getElementById('image-upload-form').reset();
  },

  /**
   * Ladda upp bild
   * Validerar: Krav 5.2, 5.3, 5.4
   */
  async uploadImage(file, directory) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('directory', directory);

      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Uppladdning misslyckades');
      }

      showToast('Bild uppladdad', 'success');
      this.hideUploadForm();
      await this.loadImages();
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.message || 'Kunde inte ladda upp bild', 'error');
    }
  },

  /**
   * Radera bild
   * Validerar: Krav 5.6, 5.7
   */
  async deleteImage(filename, directory) {
    if (!confirm(`Är du säker på att du vill radera ${filename}?`)) {
      return;
    }

    try {
      const response = await Auth.fetchWithAuth(
        `${API_BASE_URL}/media/images/${filename}?directory=${directory}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (!response.ok) {
        // Om bilden används, visa varning
        if (response.status === 409 && data.usedIn) {
          const usedInList = data.usedIn.join('\n- ');
          alert(`Bilden används på följande sidor:\n- ${usedInList}\n\nTa bort bildanvändningen först.`);
          return;
        }
        throw new Error(data.message || 'Radering misslyckades');
      }

      showToast('Bild raderad', 'success');
      await this.loadImages();
    } catch (error) {
      console.error('Delete error:', error);
      showToast(error.message || 'Kunde inte radera bild', 'error');
    }
  }
};

// Event listeners för bilduppladdning
document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('upload-image-btn');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      MediaManager.showUploadForm();
    });
  }

  const cancelUploadBtn = document.getElementById('cancel-upload-btn');
  if (cancelUploadBtn) {
    cancelUploadBtn.addEventListener('click', () => {
      MediaManager.hideUploadForm();
    });
  }

  const uploadForm = document.getElementById('image-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('image-file');
      const directory = document.getElementById('image-directory').value;
      
      if (!fileInput.files || !fileInput.files[0]) {
        showToast('Välj en bildfil', 'error');
        return;
      }

      await MediaManager.uploadImage(fileInput.files[0], directory);
    });
  }
});
