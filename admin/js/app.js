/**
 * Main Admin Application
 * Huvudapplikation som koordinerar alla moduler
 * Validerar: Krav 1, 6
 */

const App = {
  currentView: 'dashboard',

  /**
   * Initiera applikationen
   */
  async init() {
    // Kontrollera autentisering
    if (Auth.isAuthenticated()) {
      const isValid = await Auth.verifyToken();
      if (isValid) {
        this.showAdminView();
        this.loadDashboard();
      } else {
        this.showLoginView();
      }
    } else {
      this.showLoginView();
    }

    // Sätt upp event listeners
    this.setupEventListeners();
  },

  /**
   * Visa inloggningsvy
   * Validerar: Krav 1.1
   */
  showLoginView() {
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('admin-view').classList.add('hidden');
  },

  /**
   * Visa admin-vy
   * Validerar: Krav 1.4, 6.1
   */
  showAdminView() {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('admin-view').classList.remove('hidden');
    
    // Visa användarinfo
    const user = Auth.getUser();
    if (user) {
      document.getElementById('user-info').textContent = `Inloggad som ${user.username}`;
    }
  },

  /**
   * Sätt upp event listeners
   */
  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await this.handleLogout();
      });
    }

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
  },

  /**
   * Hantera inloggning
   * Validerar: Krav 1.2, 1.3, 1.4
   */
  async handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
      errorDiv.textContent = '';
      const result = await Auth.login(username, password);
      
      if (result.success) {
        // Krav 1.4: Omdirigera till administratörspanelen
        this.showAdminView();
        this.loadDashboard();
      }
    } catch (error) {
      // Krav 1.3: Visa felmeddelande
      errorDiv.textContent = error.message || 'Inloggning misslyckades';
    }
  },

  /**
   * Hantera utloggning
   * Validerar: Krav 1.6
   */
  async handleLogout() {
    await Auth.logout();
    this.showLoginView();
    showToast('Du har loggats ut', 'success');
  },

  /**
   * Byt vy
   * Validerar: Krav 6.1, 6.4
   */
  switchView(viewName) {
    // Uppdatera navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      }
    });

    // Uppdatera innehåll
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${viewName}-view`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    this.currentView = viewName;

    // Ladda data för vyn
    this.loadViewData(viewName);
  },

  /**
   * Ladda data för specifik vy
   */
  async loadViewData(viewName) {
    switch (viewName) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'posts':
        await ContentEditor.loadPosts();
        break;
      case 'pages':
        await ContentEditor.loadPages();
        break;
      case 'media':
        await MediaManager.loadImages();
        break;
      case 'styles':
        // Stilvy behöver ingen initial data
        break;
    }
  },

  /**
   * Ladda dashboard med statistik
   * Validerar: Krav 6.5
   */
  async loadDashboard() {
    try {
      // Hämta statistik
      const [posts, pages, images] = await Promise.all([
        ContentEditor.loadPosts(),
        ContentEditor.loadPages(),
        MediaManager.loadImages()
      ]);

      // Uppdatera räknare
      document.getElementById('posts-count').textContent = posts?.length || 0;
      document.getElementById('pages-count').textContent = pages?.length || 0;
      document.getElementById('images-count').textContent = images?.length || 0;
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
  }
};

/**
 * Toast notification helper
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Ta bort efter 3 sekunder
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}

// Initiera applikationen när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
