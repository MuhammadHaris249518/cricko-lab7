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

// ===== AUTH NAV =====
function initAuthNav() {
  const userStr = localStorage.getItem('cricko_user');
  if (!userStr) return;

  let user;
  try { user = JSON.parse(userStr); } catch(e) { return; }

  const initial  = (user.firstName || 'U')[0].toUpperCase();
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  // Hide login + signup buttons in nav and mobile menu
  document.querySelectorAll(
    'a[href="login.html"], a[href="signup.html"]'
  ).forEach(el => { el.style.display = 'none'; });

  // Build profile widget
  const widget = document.createElement('div');
  widget.id = 'navProfileWidget';
  widget.style.cssText = 'position:relative;display:flex;align-items:center;gap:8px;cursor:pointer;z-index:200;';
  widget.innerHTML = `
    <div id="navAvatar" style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f0a500,#e8385a);display:flex;align-items:center;justify-content:center;font-family:Syne,sans-serif;font-weight:800;font-size:15px;color:#06070f;box-shadow:0 4px 14px rgba(240,165,0,0.35);flex-shrink:0;">${initial}</div>
    <span style="font-family:Syne,sans-serif;font-weight:700;font-size:13px;color:#f0f2ff;letter-spacing:0.5px;">${user.firstName || 'User'}</span>
    <i class="fas fa-chevron-down" style="font-size:10px;color:#6b7280;transition:transform 0.2s;" id="navChevron"></i>
    <div id="navDropdown" style="display:none;position:absolute;top:calc(100% + 14px);right:0;background:#0d0f1e;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:8px;min-width:200px;box-shadow:0 24px 48px rgba(0,0,0,0.6);z-index:999;">
      <div style="padding:12px 16px 10px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:6px;">
        <div style="font-family:Syne,sans-serif;font-size:14px;font-weight:700;color:#f0f2ff;">${fullName}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">${user.email || ''}</div>
      </div>
      <a href="tournament.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:8px;text-decoration:none;color:#f0f2ff;font-size:13px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
        <i class="fas fa-trophy" style="color:#f0a500;width:16px;text-align:center;"></i>Tournaments
      </a>
      <a href="players.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:8px;text-decoration:none;color:#f0f2ff;font-size:13px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
        <i class="fas fa-users" style="color:#0dd6c0;width:16px;text-align:center;"></i>Players
      </a>
      <div style="height:1px;background:rgba(255,255,255,0.06);margin:6px 0;"></div>
      <button onclick="logoutUser()" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:8px;background:none;border:none;color:#f87171;font-size:13px;cursor:pointer;width:100%;text-align:left;font-family:DM Sans,sans-serif;" onmouseover="this.style.background='rgba(248,113,113,0.08)'" onmouseout="this.style.background='none'">
        <i class="fas fa-right-from-bracket" style="width:16px;text-align:center;"></i>Logout
      </button>
    </div>
  `;

  // Insert before the theme toggle button
  const nav = document.querySelector('nav');
  if (!nav) return;
  const themeBtn = nav.querySelector('#theme-toggle');
  themeBtn ? nav.insertBefore(widget, themeBtn) : nav.appendChild(widget);

  // Toggle dropdown on click
  widget.addEventListener('click', function(e) {
    e.stopPropagation();
    const dd       = document.getElementById('navDropdown');
    const chevron  = document.getElementById('navChevron');
    const isOpen   = dd.style.display !== 'none';
    dd.style.display     = isOpen ? 'none' : 'block';
    chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    const dd = document.getElementById('navDropdown');
    const ch = document.getElementById('navChevron');
    if (dd) dd.style.display = 'none';
    if (ch) ch.style.transform = 'rotate(0deg)';
  });
}

function logoutUser() {
  localStorage.removeItem('cricko_token');
  localStorage.removeItem('cricko_user');
  window.location.href = 'login.html';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthNav);
} else {
  initAuthNav();
}
