/**
 * Authentication Module
 * Hanterar inloggning, utloggning och token-hantering
 * Validerar: Krav 1.2, 1.4, 1.5, 1.6
 */

const API_BASE_URL = 'http://localhost:3000/api';

const Auth = {
  token: null,
  user: null,

  /**
   * Initiera autentiseringsmodul
   */
  init() {
    // Hämta token från localStorage
    this.token = localStorage.getItem('adminToken');
    
    // Om token finns, verifiera den
    if (this.token) {
      this.verifyToken();
    }
  },

  /**
   * Logga in användare
   * Validerar: Krav 1.2, 1.3
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Inloggning misslyckades');
      }

      // Spara token och användarinfo
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('adminToken', data.token);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logga ut användare
   * Validerar: Krav 1.6
   */
  async logout() {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Rensa token och användarinfo
      this.token = null;
      this.user = null;
      localStorage.removeItem('adminToken');
    }
  },

  /**
   * Verifiera token
   * Validerar: Krav 1.4, 1.5
   */
  async verifyToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token ogiltig');
      }

      const data = await response.json();
      this.user = data.user;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Rensa ogiltig token
      this.token = null;
      this.user = null;
      localStorage.removeItem('adminToken');
      return false;
    }
  },

  /**
   * Kontrollera om användare är inloggad
   */
  isAuthenticated() {
    return this.token !== null && this.user !== null;
  },

  /**
   * Hämta token för API-anrop
   */
  getToken() {
    return this.token;
  },

  /**
   * Hämta användarinfo
   */
  getUser() {
    return this.user;
  },

  /**
   * Gör autentiserat API-anrop
   */
  async fetchWithAuth(url, options = {}) {
    if (!this.token) {
      throw new Error('Inte inloggad');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Om 401, token har gått ut
    if (response.status === 401) {
      await this.logout();
      window.location.reload();
      throw new Error('Session har gått ut');
    }

    return response;
  }
};

// Initiera vid sidladdning
Auth.init();
