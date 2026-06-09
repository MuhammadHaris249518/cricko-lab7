// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'cricko-theme-preference';
    this.DARK_MODE = 'dark';
    this.LIGHT_MODE = 'light';
    this.init();
  }

  init() {
    // Get saved preference or use system preference
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const systemPreference = this.getSystemTheme();
    const theme = savedTheme || systemPreference;
    
    this.applyTheme(theme);
    this.setupThemeToggle();
  }

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK_MODE;
    }
    return this.LIGHT_MODE;
  }

  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === this.LIGHT_MODE) {
      html.setAttribute('data-theme', this.LIGHT_MODE);
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      html.setAttribute('data-theme', this.DARK_MODE);
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
    
    // Save preference
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // Update toggle button if it exists
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (theme === this.LIGHT_MODE) {
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        if (icon) icon.className = 'fas fa-moon';
      } else {
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        if (icon) icon.className = 'fas fa-sun';
      }
    }
  }

  toggleTheme() {
    const currentTheme = localStorage.getItem(this.STORAGE_KEY) || this.getSystemTheme();
    const newTheme = currentTheme === this.DARK_MODE ? this.LIGHT_MODE : this.DARK_MODE;
    this.applyTheme(newTheme);
  }

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
