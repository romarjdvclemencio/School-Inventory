/**
 * Shared Layout - generates sidebar + header HTML
 * School Inventory Management System
 */

export function renderLayout(pageTitle, activePage, breadcrumb = '') {
  const sidebarHTML = `
  <div id="sidebarOverlay" class="sidebar-overlay" aria-hidden="true"></div>
  <aside id="sidebar" class="sidebar" aria-label="Main navigation">
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18V18h2v-5.82L9 13.4V18H7v2h10v-2h-2v-4.6l2-1.22V18h2v-6.82L23 9 12 3zm0 2.24L19.64 9 12 12.76 4.36 9 12 5.24z"/></svg>
      </div>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-title" id="schoolNameSidebar">School Inventory</div>
        <div class="sidebar-brand-sub">Management System</div>
      </div>
    </div>

    <nav class="sidebar-nav" role="navigation">
      <div class="sidebar-section-title">Main</div>
      <a class="sidebar-nav-item" data-page="dashboard" href="dashboard.html" aria-label="Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </a>

      <div class="sidebar-section-title">Inventory</div>
      <a class="sidebar-nav-item" data-page="inventory" href="inventory.html" aria-label="Inventory">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        Inventory
      </a>
      <a class="sidebar-nav-item" data-page="categories" href="categories.html" aria-label="Categories">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        Categories
      </a>
      <a class="sidebar-nav-item" data-page="locations" href="locations.html" aria-label="Locations">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Locations
      </a>

      <div class="sidebar-section-title">Operations</div>
      <a class="sidebar-nav-item" data-page="borrowing" href="borrowing.html" aria-label="Borrowing">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Borrowing
        <span class="sidebar-nav-badge" id="overdueCount" style="display:none">0</span>
      </a>
      <a class="sidebar-nav-item" data-page="maintenance" href="maintenance.html" aria-label="Maintenance">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Maintenance
      </a>

      <div class="sidebar-section-title">Management</div>
      <a class="sidebar-nav-item" data-page="reports" href="reports.html" aria-label="Reports">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 18 12 12"/><polyline points="9 15 12 12 15 15"/></svg>
        Reports
      </a>
      <a class="sidebar-nav-item" data-page="logs" href="logs.html" aria-label="Activity Logs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Activity Logs
      </a>
      <a class="sidebar-nav-item" data-page="users" href="users.html" aria-label="Users">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Users
      </a>
      <a class="sidebar-nav-item" data-page="settings" href="settings.html" aria-label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Settings
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user" id="sidebarUserBtn" role="button" tabindex="0" aria-label="User menu">
        <div class="sidebar-avatar" id="sidebarUserAvatar" aria-hidden="true">U</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name" id="sidebarUserName">Loading…</div>
          <div class="sidebar-user-role" id="sidebarUserRole"></div>
        </div>
        <div class="sidebar-user-action" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </div>
      </div>
    </div>
  </aside>`;

  const headerHTML = `
  <header class="header" role="banner">
    <button class="header-menu-btn" id="sidebarMenuBtn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <div class="header-title">
      <h1>${pageTitle}</h1>
      ${breadcrumb ? `<div class="breadcrumb" aria-label="Breadcrumb">${breadcrumb}</div>` : ''}
    </div>
    <div class="header-actions">
      <button class="header-btn" id="headerNotifBtn" aria-label="Notifications" title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="header-notif-dot" id="notifDot" style="display:none" aria-hidden="true"></span>
      </button>
      <button class="header-btn" id="logoutBtn" aria-label="Sign out" title="Sign out">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  </header>`;

  return { sidebarHTML, headerHTML };
}
