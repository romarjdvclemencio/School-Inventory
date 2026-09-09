/**
 * Authentication & Authorization Module
 * School Inventory Management System
 */

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
import { app } from './firebase-config.js';
import { showToast, initials } from './utils.js';
export const auth = getAuth(app);
export const db = getFirestore(app);

// Role hierarchy
export const ROLES = {
  ADMIN: 'admin',
  OFFICER: 'officer',
  TEACHER: 'teacher',
  VIEWER: 'viewer'
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  officer: 'Inventory Officer',
  teacher: 'Teacher / Staff',
  viewer: 'Viewer'
};

// Permissions map
export const PERMISSIONS = {
  admin: [
    'inventory.view', 'inventory.add', 'inventory.edit', 'inventory.delete',
    'categories.manage', 'locations.manage',
    'borrowing.manage', 'maintenance.manage',
    'users.manage', 'reports.view', 'logs.view', 'settings.manage',
    'transfers.manage'
  ],
  officer: [
    'inventory.view', 'inventory.add', 'inventory.edit',
    'categories.manage', 'locations.manage',
    'borrowing.manage', 'maintenance.manage',
    'reports.view', 'transfers.manage', 'logs.view'
  ],
  teacher: [
    'inventory.view',
    'categories.view', 'locations.view',
    'borrowing.request', 'borrowing.return',
    'maintenance.view',
    'reports.view'
  ],
  viewer: [
    'inventory.view',
    'categories.view', 'locations.view',
    'reports.view'
  ]
};

// Current user state
let currentUser = null;
let currentUserData = null;

export function getCurrentUser() { return currentUser; }
export function getCurrentUserData() { return currentUserData; }

export function hasPermission(permission) {
  if (!currentUserData) return false;
  const role = currentUserData.role || 'viewer';
  return (PERMISSIONS[role] || []).includes(permission);
}

export function isAdmin() {
  return currentUserData?.role === ROLES.ADMIN;
}

export function canManageInventory() {
  return hasPermission('inventory.add') || hasPermission('inventory.edit');
}

/**
 * Require authentication — call on every protected page.
 * Returns a promise that resolves with { user, userData } or redirects to login.
 */
export function requireAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        window.location.href = 'index.html';
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Create basic user profile if it doesn't exist yet
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            role: 'viewer',
            status: 'active',
            department: '',
            createdAt: serverTimestamp()
          };
          await setDoc(doc(db, 'users', user.uid), userData);
          currentUserData = userData;
        } else {
          currentUserData = { uid: user.uid, ...userDoc.data() };
        }

        // Check if user is disabled
        if (currentUserData.status === 'disabled') {
          await signOut(auth);
          window.location.href = 'index.html?error=disabled';
          return;
        }

        currentUser = user;
        renderUserInSidebar(currentUserData);
        resolve({ user, userData: currentUserData });
      } catch (err) {
        console.error('Auth error:', err);
        // Friendly error messages instead of raw Firebase errors
        if (err.code === 'permission-denied') {
          showToast('You do not have permission to access this page.', 'error');
        } else if (err.code === 'unavailable' || err.message?.includes('network')) {
          showToast('Unable to connect. Please check your internet connection.', 'error');
        } else {
          // If offline or error, try to proceed with minimal cached data (viewer role for safety)
          currentUser = user;
          currentUserData = { uid: user.uid, email: user.email, role: 'viewer' };
          resolve({ user, userData: currentUserData });
          return;
        }
        // On unrecoverable auth error, redirect to login
        window.location.href = 'index.html';
      }
    });
  });
}

/**
 * Log out current user — logs the event then signs out
 */
export async function logout() {
  try {
    // Log the logout activity before signing out (while we still have auth context)
    if (currentUser) {
      await logActivity('User Logout', `${currentUserData?.name || currentUser.email} signed out`);
    }
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (err) {
    showToast('Unable to sign out. Please try again.', 'error');
  }
}

/**
 * Render user info in sidebar
 */
function renderUserInSidebar(userData) {
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarUserAvatar');

  if (nameEl) nameEl.textContent = userData.name || userData.email || 'User';
  if (roleEl) roleEl.textContent = ROLE_LABELS[userData.role] || userData.role || 'User';
  if (avatarEl) avatarEl.textContent = initials(userData.name || userData.email || '?');
}

/**
 * Log an activity to Firestore
 * @param {string} action - Short action name e.g. 'Item Created'
 * @param {string} description - Human-readable description
 * @param {string|null} itemId - Firestore document ID of the affected resource
 * @param {string|null} itemName - Display name of the affected resource
 */
export async function logActivity(action, description, itemId = null, itemName = null) {
  if (!currentUser) return;
  try {
    const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js');
    await addDoc(collection(db, 'activityLogs'), {
      userId:      currentUser.uid,
      userName:    currentUserData?.name || currentUser.email || 'Unknown',
      userEmail:   currentUser.email || '',
      userRole:    currentUserData?.role || 'viewer',
      action,
      description,
      itemId:      itemId   || null,
      itemName:    itemName || null,
      timestamp:   serverTimestamp(),
      // Store page URL for context (strip sensitive query params)
      page: window.location.pathname.split('/').pop() || 'unknown'
    });
  } catch (err) {
    // Never block the main operation — logging is best-effort
    console.warn('Activity log write failed:', err.code || err.message);
  }
}

/**
 * Set up sidebar navigation links + active state
 */
export function initSidebar(activePage) {
  const menuBtn = document.getElementById('sidebarMenuBtn');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  if (menuBtn && overlay && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Set active nav item
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-page]');
  navItems.forEach(item => {
    if (item.dataset.page === activePage) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => {
      // Close drawer on mobile nav
      sidebar?.classList.remove('open');
      overlay?.classList.remove('open');
    });
  });

  // Logout btn
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Hide nav items based on permissions
  applyRoleBasedNavVisibility();

  // ── Sidebar user button → user menu popup ────────────────────────────────
  const userBtn = document.getElementById('sidebarUserBtn');
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserMenu();
    });
    userBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleUserMenu(); }
    });
  }
}

function applyRoleBasedNavVisibility() {
  // Hide nav items for pages the current role cannot access
  const navMap = {
    'users':     'users.manage',
    'settings':  'settings.manage',
    'logs':      'logs.view'
  };

  Object.entries(navMap).forEach(([page, perm]) => {
    const items = document.querySelectorAll(`[data-page="${page}"]`);
    items.forEach(item => {
      if (!hasPermission(perm)) {
        item.style.display = 'none';
      }
    });
  });
}

// ── User menu popup ───────────────────────────────────────────────────────────
let _userMenuOpen = false;

function toggleUserMenu() {
  _userMenuOpen ? closeUserMenu() : openUserMenu();
}

function openUserMenu() {
  // Remove existing
  document.getElementById('userMenuPopup')?.remove();

  const u = currentUserData;
  const initial = (u?.name || u?.email || '?')[0].toUpperCase();
  const role    = ROLE_LABELS[u?.role] || u?.role || 'User';
  const email   = u?.email || '';
  const name    = u?.name || email;

  const popup = document.createElement('div');
  popup.id = 'userMenuPopup';
  popup.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 12px;
    width: 256px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,.18);
    z-index: 9999;
    overflow: hidden;
    animation: fadeInUp .15s ease-out;
  `;

  popup.innerHTML = `
    <style>
      @keyframes fadeInUp {
        from { opacity:0; transform:translateY(8px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .um-item {
        display: flex; align-items: center; gap: 12px;
        padding: 11px 16px; font-size: .875rem; font-weight: 500;
        color: var(--text-secondary); cursor: pointer;
        transition: background .12s;
        border: none; background: none; width: 100%; text-align: left;
        text-decoration: none;
      }
      .um-item:hover { background: var(--surface-2); color: var(--text-primary); }
      .um-item svg { width: 16px; height: 16px; flex-shrink: 0; }
      .um-item.danger { color: var(--danger); }
      .um-item.danger:hover { background: var(--danger-light); }
      .um-sep { height: 1px; background: var(--border); margin: 4px 0; }
    </style>

    <!-- Profile header -->
    <div style="padding:16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border);">
      <div style="width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0;">${initial}</div>
      <div style="min-width:0;">
        <div style="font-size:.875rem;font-weight:700;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escStr(name)}</div>
        <div style="font-size:.775rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escStr(email)}</div>
        <span style="display:inline-block;margin-top:3px;padding:1px 8px;background:var(--primary-light);color:var(--primary);border-radius:99px;font-size:.72rem;font-weight:700;">${escStr(role)}</span>
      </div>
    </div>

    <!-- Menu items -->
    <div style="padding:4px 0;">
      ${u?.role === 'admin' ? `
      <a class="um-item" href="users.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Manage Users
      </a>
      <a class="um-item" href="settings.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Settings
      </a>
      <div class="um-sep"></div>` : ''}

      <button class="um-item" id="umChangePassBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Change Password
      </button>

      <div class="um-sep"></div>
      <button class="um-item danger" id="umSignOutBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </div>
  `;

  document.body.appendChild(popup);
  _userMenuOpen = true;

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeUserMenuOnOutside);
  }, 10);

  // Wire buttons
  document.getElementById('umSignOutBtn')?.addEventListener('click', () => {
    closeUserMenu();
    logout();
  });

  document.getElementById('umChangePassBtn')?.addEventListener('click', () => {
    closeUserMenu();
    showChangePasswordDialog();
  });
}

function closeUserMenu() {
  document.getElementById('userMenuPopup')?.remove();
  document.removeEventListener('click', closeUserMenuOnOutside);
  _userMenuOpen = false;
}

function closeUserMenuOnOutside(e) {
  const popup = document.getElementById('userMenuPopup');
  if (popup && !popup.contains(e.target)) closeUserMenu();
}

function escStr(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Change Password dialog ────────────────────────────────────────────────────
async function showChangePasswordDialog() {
  // Dynamically import Firebase Auth functions
  const { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } =
    await import('https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js');

  const dialog = document.createElement('div');
  dialog.id = 'changePassDialog';
  dialog.style.cssText = `
    position:fixed;inset:0;z-index:10000;
    background:rgba(0,0,0,.45);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
  `;
  dialog.innerHTML = `
    <div style="background:var(--surface);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.2);width:100%;max-width:380px;overflow:hidden;">
      <div style="padding:18px 20px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <div style="font-size:.9375rem;font-weight:700;color:var(--text-primary);">Change Password</div>
        <button id="cpClose" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px;display:flex;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px;">
        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:.875rem;font-weight:600;color:var(--text-primary);margin-bottom:6px;" for="cpCurrent">Current Password</label>
          <input type="password" id="cpCurrent" autocomplete="current-password" style="width:100%;padding:9px 14px;font-size:.9375rem;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text-primary);box-sizing:border-box;" placeholder="Enter current password" />
        </div>
        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:.875rem;font-weight:600;color:var(--text-primary);margin-bottom:6px;" for="cpNew">New Password</label>
          <input type="password" id="cpNew" autocomplete="new-password" style="width:100%;padding:9px 14px;font-size:.9375rem;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text-primary);box-sizing:border-box;" placeholder="At least 8 characters" />
        </div>
        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:.875rem;font-weight:600;color:var(--text-primary);margin-bottom:6px;" for="cpConfirm">Confirm New Password</label>
          <input type="password" id="cpConfirm" autocomplete="new-password" style="width:100%;padding:9px 14px;font-size:.9375rem;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text-primary);box-sizing:border-box;" placeholder="Repeat new password" />
        </div>
        <div id="cpError" style="display:none;padding:10px 14px;background:var(--danger-light);color:var(--danger);border-radius:8px;font-size:.875rem;margin-bottom:14px;font-weight:600;"></div>
        <div style="display:flex;gap:10px;">
          <button id="cpCancel" style="flex:1;padding:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;font-size:.875rem;font-weight:600;cursor:pointer;color:var(--text-secondary);">Cancel</button>
          <button id="cpSave" style="flex:1;padding:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-size:.875rem;font-weight:600;cursor:pointer;">Update Password</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(dialog);

  const close = () => dialog.remove();
  document.getElementById('cpClose').addEventListener('click', close);
  document.getElementById('cpCancel').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });

  document.getElementById('cpSave').addEventListener('click', async () => {
    const current = document.getElementById('cpCurrent').value;
    const newPass  = document.getElementById('cpNew').value;
    const confirm  = document.getElementById('cpConfirm').value;
    const errEl    = document.getElementById('cpError');
    const saveBtn  = document.getElementById('cpSave');

    errEl.style.display = 'none';

    if (!current) { errEl.textContent = 'Enter your current password.'; errEl.style.display = 'block'; return; }
    if (newPass.length < 8) { errEl.textContent = 'New password must be at least 8 characters.'; errEl.style.display = 'block'; return; }
    if (newPass !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }

    saveBtn.textContent = 'Updating…'; saveBtn.disabled = true;

    try {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
      showToast('Password updated successfully.', 'success');
      close();
    } catch(e) {
      const msg = e.code === 'auth/wrong-password' ? 'Current password is incorrect.'
                : e.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
                : e.message;
      errEl.textContent = msg; errEl.style.display = 'block';
      saveBtn.textContent = 'Update Password'; saveBtn.disabled = false;
    }
  });

  // Focus first field
  document.getElementById('cpCurrent').focus();
}
