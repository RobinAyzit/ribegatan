/**
 * Inline Editor - Redigera hemsidan direkt
 * Lägg till detta script på alla sidor som ska vara redigerbara
 */

const InlineEditor = {
  isLoggedIn: false,
  token: null,
  API_URL: 'https://ribegatan.onrender.com/api',
  
  /**
   * Initiera inline editor
   */
  init() {
    // Kolla om användaren är inloggad
    this.token = localStorage.getItem('adminToken');
    if (this.token) {
      this.verifyToken();
    }
    
    // Lägg till login-knapp i hörnet
    this.addLoginButton();
  },
  
  /**
   * Lägg till login-knapp
   */
  addLoginButton() {
    const loginBtn = document.createElement('div');
    loginBtn.id = 'admin-login-btn';
    loginBtn.innerHTML = this.isLoggedIn ? '🔓 Admin' : '🔒 Admin';
    loginBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #1f2937;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    loginBtn.onclick = () => {
      if (this.isLoggedIn) {
        this.showAdminMenu();
      } else {
        this.showLoginModal();
      }
    };
    
    document.body.appendChild(loginBtn);
  },
  
  /**
   * Visa login-modal
   */
  showLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'admin-login-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; width: 90%;">
          <h2 style="margin-top: 0; color: #1e293b;">Admin Login</h2>
          <form id="admin-login-form">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b;">Användarnamn</label>
              <input type="text" id="admin-username" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b;">Lösenord</label>
              <input type="password" id="admin-password" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px;">
            </div>
            <div id="login-error" style="color: #ef4444; font-size: 14px; margin-bottom: 10px; min-height: 20px;"></div>
            <div style="display: flex; gap: 10px;">
              <button type="submit" style="flex: 1; background: #2563eb; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Logga in</button>
              <button type="button" onclick="document.getElementById('admin-login-modal').remove()" style="flex: 1; background: #64748b; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Avbryt</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('admin-login-form').onsubmit = async (e) => {
      e.preventDefault();
      await this.login();
    };
  },
  
  /**
   * Logga in
   */
  async login() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.token = data.token;
        localStorage.setItem('adminToken', data.token);
        this.isLoggedIn = true;
        
        // Stäng modal
        document.getElementById('admin-login-modal').remove();
        
        // Uppdatera login-knapp
        document.getElementById('admin-login-btn').innerHTML = '🔓 Admin';
        
        // Aktivera redigeringsläge
        this.enableEditMode();
        
        this.showNotification('Inloggad som admin!', 'success');
      } else {
        errorDiv.textContent = data.message || 'Inloggning misslyckades';
      }
    } catch (error) {
      errorDiv.textContent = 'Kunde inte ansluta till servern';
    }
  },
  
  /**
   * Verifiera token
   */
  async verifyToken() {
    try {
      const response = await fetch(`${this.API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      if (response.ok) {
        this.isLoggedIn = true;
        document.getElementById('admin-login-btn').innerHTML = '🔓 Admin';
        this.enableEditMode();
      } else {
        localStorage.removeItem('adminToken');
        this.token = null;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  },
  
  /**
   * Aktivera redigeringsläge
   */
  enableEditMode() {
    // Lägg till admin toolbar
    this.addAdminToolbar();
    
    // Gör alla textelement redigerbara
    this.makeTextEditable();
    
    // Lägg till bildhantering
    this.enableImageEditing();
  },
  
  /**
   * Lägg till admin toolbar
   */
  addAdminToolbar() {
    if (document.getElementById('admin-toolbar')) return;
    
    const toolbar = document.createElement('div');
    toolbar.id = 'admin-toolbar';
    toolbar.innerHTML = `
      <div style="position: fixed; top: 50px; right: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: Arial, sans-serif; max-width: 200px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #1e293b;">Admin Verktyg</div>
        <button onclick="InlineEditor.showNewPostModal()" style="width: 100%; background: #2563eb; color: white; padding: 8px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 5px; font-size: 13px;">📝 Nytt inlägg</button>
        <button onclick="InlineEditor.savePage()" style="width: 100%; background: #10b981; color: white; padding: 8px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 5px; font-size: 13px;">💾 Spara ändringar</button>
        <button onclick="InlineEditor.logout()" style="width: 100%; background: #ef4444; color: white; padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-size: 13px;">🚪 Logga ut</button>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <div>✏️ Klicka på text för att redigera</div>
          <div>🖼️ Högerklicka på bilder</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toolbar);
  },
  
  /**
   * Gör textelement redigerbara
   */
  makeTextEditable() {
    // Hitta alla textelement (p, h1-h6, span, div med text)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th');
    
    textElements.forEach(element => {
      // Skippa admin-element
      if (element.closest('#admin-login-btn, #admin-toolbar, #admin-login-modal')) return;
      
      // Skippa element som redan är redigerbara
      if (element.hasAttribute('data-editable')) return;
      
      // Skippa tomma element eller element med bara andra element
      if (!element.textContent.trim() || element.children.length > 0 && !element.textContent.trim()) return;
      
      element.setAttribute('data-editable', 'true');
      element.style.cursor = 'pointer';
      element.style.outline = '1px dashed transparent';
      element.style.transition = 'outline 0.2s';
      
      element.addEventListener('mouseenter', () => {
        element.style.outline = '2px dashed #2563eb';
      });
      
      element.addEventListener('mouseleave', () => {
        if (!element.hasAttribute('contenteditable')) {
          element.style.outline = '1px dashed transparent';
        }
      });
      
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editText(element);
      });
    });
    
    // Lägg till raderingsknappar på inlägg i Aktuellt
    this.addDeleteButtons();
  },
  
  /**
   * Lägg till raderingsknappar på inlägg
   */
  addDeleteButtons() {
    // Hitta alla inlägg i Aktuellt-sektionen
    const aktueltContent = document.querySelector('.aktuellt-content');
    if (!aktueltContent) return;
    
    // Hitta alla div-element som ser ut som inlägg (har padding och border-radius)
    const posts = aktueltContent.querySelectorAll('div[style*="padding"][style*="border-radius"]');
    
    posts.forEach(post => {
      // Skippa om knappen redan finns
      if (post.querySelector('.admin-delete-btn')) return;
      
      // Skapa raderingskn app
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'admin-delete-btn';
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.title = 'Radera inlägg';
      deleteBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s;
        z-index: 100;
      `;
      
      deleteBtn.onmouseover = () => {
        deleteBtn.style.background = '#dc2626';
        deleteBtn.style.transform = 'scale(1.1)';
      };
      
      deleteBtn.onmouseout = () => {
        deleteBtn.style.background = '#ef4444';
        deleteBtn.style.transform = 'scale(1)';
      };
      
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.deletePost(post);
      };
      
      // Gör inlägget relativt positionerat så knappen kan placeras absolut
      post.style.position = 'relative';
      
      // Lägg till knappen
      post.appendChild(deleteBtn);
    });
  },
  
  /**
   * Radera inlägg
   */
  deletePost(postElement) {
    // Dubbelkolla att användaren är inloggad
    if (!this.isLoggedIn) return;
    
    if (confirm('Är du säker på att du vill radera detta inlägg?')) {
      postElement.style.opacity = '0.5';
      postElement.style.transition = 'opacity 0.3s';
      
      setTimeout(() => {
        postElement.remove();
        this.showNotification('Inlägg raderat. Klicka "Spara ändringar" för att spara.', 'success');
      }, 300);
    }
  },
  
  /**
   * Redigera text
   */
  editText(element) {
    const originalText = element.textContent;
    
    element.setAttribute('contenteditable', 'true');
    element.focus();
    element.style.outline = '2px solid #2563eb';
    element.style.background = '#eff6ff';
    
    // Spara vid Enter eller när man klickar utanför
    const saveEdit = () => {
      element.removeAttribute('contenteditable');
      element.style.outline = '1px dashed transparent';
      element.style.background = '';
      
      if (element.textContent !== originalText) {
        this.showNotification('Text ändrad. Klicka "Spara ändringar" för att spara.', 'info');
      }
    };
    
    element.addEventListener('blur', saveEdit, { once: true });
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
      if (e.key === 'Escape') {
        element.textContent = originalText;
        element.blur();
      }
    });
  },
  
  /**
   * Aktivera bildredigering
   */
  enableImageEditing() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Skippa admin-element
      if (img.closest('#admin-login-btn, #admin-toolbar')) return;
      
      img.style.cursor = 'pointer';
      img.style.outline = '1px dashed transparent';
      img.style.transition = 'outline 0.2s';
      
      img.addEventListener('mouseenter', () => {
        img.style.outline = '2px dashed #10b981';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.outline = '1px dashed transparent';
      });
      
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.showImageMenu(img, e.clientX, e.clientY);
      });
    });
  },
  
  /**
   * Visa bildmeny
   */
  showImageMenu(img, x, y) {
    // Ta bort befintlig meny
    const existingMenu = document.getElementById('image-context-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'image-context-menu';
    menu.innerHTML = `
      <div style="position: fixed; left: ${x}px; top: ${y}px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px; z-index: 10002; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: Arial, sans-serif;">
        <button onclick="InlineEditor.replaceImage(this)" data-img-src="${img.src}" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; border-radius: 4px;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">🔄 Byt bild</button>
        <button onclick="InlineEditor.deleteImage(this)" data-img-src="${img.src}" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #ef4444; border-radius: 4px;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='none'">🗑️ Ta bort bild</button>
      </div>
    `;
    
    document.body.appendChild(menu);
    
    // Stäng meny vid klick utanför
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 100);
  },
  
  /**
   * Byt bild
   */
  replaceImage(button) {
    const imgSrc = button.getAttribute('data-img-src');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Visa förhandsvisning
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.querySelector(`img[src="${imgSrc}"]`);
        if (img) {
          img.src = e.target.result;
          img.setAttribute('data-new-image', 'true');
          img.setAttribute('data-image-file', file.name);
          this.showNotification('Bild ändrad. Klicka "Spara ändringar" för att spara.', 'info');
        }
      };
      reader.readAsDataURL(file);
      
      // Spara filen för senare uppladdning
      if (!window.pendingImageUploads) window.pendingImageUploads = [];
      window.pendingImageUploads.push({ src: imgSrc, file });
    };
    
    input.click();
    document.getElementById('image-context-menu').remove();
  },
  
  /**
   * Ta bort bild
   */
  deleteImage(button) {
    const imgSrc = button.getAttribute('data-img-src');
    
    if (confirm('Är du säker på att du vill ta bort denna bild?')) {
      const img = document.querySelector(`img[src="${imgSrc}"]`);
      if (img) {
        img.style.opacity = '0.3';
        img.setAttribute('data-deleted', 'true');
        this.showNotification('Bild markerad för radering. Klicka "Spara ändringar" för att spara.', 'info');
      }
    }
    
    document.getElementById('image-context-menu').remove();
  },
  
  /**
   * Spara sida
   */
  async savePage() {
    try {
      // Klona dokumentet för att rensa admin-element
      const clonedDoc = document.cloneNode(true);
      
      // Ta bort alla admin-element från klonen
      const adminElements = clonedDoc.querySelectorAll(
        '#admin-login-btn, #admin-toolbar, #admin-login-modal, #new-post-modal, #image-context-menu, .admin-delete-btn'
      );
      adminElements.forEach(el => el.remove());
      
      // Ta bort data-editable attribut
      const editableElements = clonedDoc.querySelectorAll('[data-editable]');
      editableElements.forEach(el => {
        el.removeAttribute('data-editable');
        el.style.cursor = '';
        el.style.outline = '';
        el.style.transition = '';
      });
      
      // Ta bort inline styles från bilder som lagts till av admin
      const images = clonedDoc.querySelectorAll('img');
      images.forEach(img => {
        img.style.cursor = '';
        img.style.outline = '';
        img.style.transition = '';
      });
      
      // Hämta den rensade HTML:en
      const html = clonedDoc.documentElement.outerHTML;
      const filename = window.location.pathname.split('/').pop() || 'index.html';
      
      console.log('Sparar sida:', filename);
      console.log('HTML-storlek:', html.length, 'bytes');
      
      const response = await fetch(`${this.API_URL}/content/pages/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: html })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        this.showNotification('Sidan sparad!', 'success');
        
        // Ladda om sidan efter 1 sekund
        setTimeout(() => location.reload(), 1000);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        this.showNotification('Kunde inte spara sidan: ' + (errorData.error || 'Okänt fel'), 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      this.showNotification('Fel vid sparande: ' + error.message, 'error');
    }
  },
  
  /**
   * Logga ut
   */
  async logout() {
    try {
      await fetch(`${this.API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('adminToken');
    this.token = null;
    this.isLoggedIn = false;
    
    location.reload();
  },
  
  /**
   * Visa modal för nytt inlägg
   */
  showNewPostModal() {
    const modal = document.createElement('div');
    modal.id = 'new-post-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
          <h2 style="margin-top: 0; color: #1e293b;">📝 Skapa nytt inlägg</h2>
          <form id="new-post-form">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b; font-weight: 500;">Rubrik *</label>
              <input type="text" id="post-title" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b; font-weight: 500;">Text *</label>
              <textarea id="post-content" required rows="6" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; resize: vertical; font-family: inherit; box-sizing: border-box;"></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b; font-weight: 500;">Bild (valfritt)</label>
              <input type="file" id="post-image" accept="image/*" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; box-sizing: border-box;">
              <div id="image-preview" style="margin-top: 10px;"></div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b; font-weight: 500;">Länk (valfritt)</label>
              <input type="url" id="post-link" placeholder="https://exempel.se" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #64748b; font-weight: 500;">Länktext (om länk anges)</label>
              <input type="text" id="post-link-text" placeholder="Läs mer" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
              <button type="submit" style="flex: 1; background: #2563eb; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 500;">Publicera inlägg</button>
              <button type="button" onclick="document.getElementById('new-post-modal').remove()" style="flex: 1; background: #64748b; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Avbryt</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Förhandsvisning av bild
    document.getElementById('post-image').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('image-preview').innerHTML = `
            <img src="${e.target.result}" style="max-width: 100%; border-radius: 5px; border: 1px solid #e2e8f0;">
          `;
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Hantera formulär
    document.getElementById('new-post-form').onsubmit = async (e) => {
      e.preventDefault();
      await this.createPost();
    };
  },
  
  /**
   * Skapa nytt inlägg
   */
  async createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const imageFile = document.getElementById('post-image').files[0];
    const link = document.getElementById('post-link').value;
    const linkText = document.getElementById('post-link-text').value || 'Läs mer';
    
    try {
      // Ladda upp bild om det finns en
      let imagePath = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('directory', 'img');
        
        const uploadResponse = await fetch(`${this.API_URL}/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imagePath = uploadData.image.path;
        }
      }
      
      // Skapa HTML för inlägget
      const postHTML = this.generatePostHTML(title, content, imagePath, link, linkText);
      
      // Hitta Aktuellt-sektionen
      const aktueltContent = document.querySelector('.aktuellt-content');
      if (aktueltContent) {
        // Lägg till inlägget längst upp
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = postHTML;
        const newPost = tempDiv.firstElementChild;
        aktueltContent.insertBefore(newPost, aktueltContent.firstChild);
        
        // Lägg till raderingsknapp på det nya inlägget
        this.addDeleteButtons();
        
        // Stäng modal
        document.getElementById('new-post-modal').remove();
        
        this.showNotification('Inlägg skapat! Klicka "Spara ändringar" för att spara.', 'success');
      } else {
        this.showNotification('Kunde inte hitta Aktuellt-sektionen', 'error');
      }
    } catch (error) {
      console.error('Create post error:', error);
      this.showNotification('Kunde inte skapa inlägg', 'error');
    }
  },
  
  /**
   * Generera HTML för inlägg
   */
  generatePostHTML(title, content, imagePath, link, linkText) {
    const date = new Date().toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let html = `
      <div style="background: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid var(--primary-color);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <h3 style="color: var(--primary-color); margin: 0;">${title}</h3>
          <span style="color: #64748b; font-size: 0.9rem;">${date}</span>
        </div>
    `;
    
    if (imagePath) {
      html += `
        <div style="margin-bottom: 1rem;">
          <img src="/${imagePath}" alt="${title}" style="max-width: 100%; border-radius: 0.5rem; height: auto;">
        </div>
      `;
    }
    
    html += `
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">${content}</p>
    `;
    
    if (link) {
      html += `
        <a href="${link}" style="display: inline-block; background: var(--primary-color); color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; transition: background 0.3s;" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary-color)'">${linkText} →</a>
      `;
    }
    
    html += `
      </div>
    `;
    
    return html;
  },
  
  /**
   * Visa notifikation
   */
  showNotification(message, type = 'info') {
    // Visa bara notifikationer om användaren är inloggad
    if (!this.isLoggedIn) return;
    
    const notification = document.createElement('div');
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#2563eb'
    };
    
    notification.innerHTML = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10003;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Initiera när sidan laddas
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => InlineEditor.init());
} else {
  InlineEditor.init();
}
