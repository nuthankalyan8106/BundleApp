// ─────────────────────────────────────────────
//  BundleBasket Authentication
//  Uses the API first, with localStorage fallback
//  for offline prototype mode.
// ─────────────────────────────────────────────

const API_BASE = window.BUNDLEBASKET_API_BASE || 'http://localhost:3000';
let firebaseAuth = null;

function getFirebaseAuth() {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  if (!window.firebase || !window.FIREBASE_CONFIG) {
    return null;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(window.FIREBASE_CONFIG);
  }

  firebaseAuth = firebase.auth();
  return firebaseAuth;
}

// ── Simple hash (obfuscation, not cryptographic) ──
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

// ── Storage helpers ──
function getUsers()   { try { return JSON.parse(localStorage.getItem('bh_users')   || '{}');   } catch { return {}; } }
function saveUsers(u) { localStorage.setItem('bh_users',   JSON.stringify(u)); }
function getSession() { try { return JSON.parse(localStorage.getItem('bh_session') || 'null'); } catch { return null; } }
function saveSession(u) { localStorage.setItem('bh_session', JSON.stringify(u)); }
function clearSession()  { localStorage.removeItem('bh_session'); }

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    const networkError = new Error('Backend is unavailable.');
    networkError.isNetworkError = true;
    throw networkError;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiError = new Error(data.error || data.message || 'Request failed.');
    apiError.status = response.status;
    throw apiError;
  }

  return data;
}

function canUseLocalFallback(error) {
  return error?.isNetworkError || error?.status === 503;
}

// ── Validation helpers ──
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

// ── UI message helpers ──
function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('auth-success').classList.remove('show');
}
function showAuthSuccess(msg) {
  const el = document.getElementById('auth-success');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('auth-error').classList.remove('show');
}
function clearAuthMessages() {
  document.getElementById('auth-error').classList.remove('show');
  document.getElementById('auth-success').classList.remove('show');
}

// ── Open / close modal ──
function openAuth(tab = 'login') {
  document.getElementById('auth-overlay').classList.add('open');
  switchTab(tab);
  clearAuthMessages();
}
function closeAuth() {
  document.getElementById('auth-overlay').classList.remove('open');
}

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  button.textContent = isPassword ? 'Hide' : 'Show';
  button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
}

// Close on backdrop click
document.getElementById('auth-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('auth-overlay')) closeAuth();
});

// ── Switch tabs ──
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active',  tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-login').style.display  = tab === 'login'  ? 'flex' : 'none';
  document.getElementById('form-signup').style.display = tab === 'signup' ? 'flex' : 'none';
  clearAuthMessages();
}

// ── SIGN UP with email/password ──
async function signUpEmail() {
  clearAuthMessages();
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass  = document.getElementById('signup-password').value;

  if (!name)                { showAuthError('Please enter your full name.');           return; }
  if (!isValidEmail(email)) { showAuthError('Please enter a valid email address.');    return; }
  if (pass.length < 6)      { showAuthError('Password must be at least 6 characters.'); return; }

  const users = getUsers();
  if (users[email])         { showAuthError('An account with this email already exists. Sign in instead.'); return; }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  try {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ displayName: name, email, password: pass }),
    });

    const session = response.user;
    saveSession(session);
    showAuthSuccess('Account created! Welcome to BundleBasket 🎉');
    closeAuth();
    onLogin(session);
  } catch (error) {
    if (!canUseLocalFallback(error)) {
      showAuthError(error.message || 'Could not create account.');
      return;
    }

    const users = getUsers();
    if (users[email]) {
      showAuthError('An account with this email already exists. Sign in instead.');
      return;
    }

    const user = {
      uid: 'u_' + Date.now(),
      displayName: name,
      email,
      passwordHash: simpleHash(pass),
      provider: 'email',
      photoURL: null,
      createdAt: new Date().toISOString(),
    };
    users[email] = user;
    saveUsers(users);

    const session = { uid: user.uid, displayName: name, email, provider: 'email', photoURL: null };
    saveSession(session);
    showAuthSuccess('Account created locally. MongoDB is offline, so this session is saved in the browser for now.');
    closeAuth();
    onLogin(session);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create account';
  }
}

// ── SIGN IN with email/password ──
async function signInEmail() {
  clearAuthMessages();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass  = document.getElementById('login-password').value;

  if (!email || !pass) { showAuthError('Please fill in all fields.'); return; }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });

    const session = response.user;
    saveSession(session);
    closeAuth();
    onLogin(session);
  } catch (error) {
    if (!canUseLocalFallback(error)) {
      showAuthError(error.message || 'Could not sign in.');
      return;
    }

    const users = getUsers();
    const user  = users[email];

    if (!user) {
      showAuthError('No account found with this email.');
      return;
    }
    if (user.passwordHash !== simpleHash(pass)) {
      showAuthError('Incorrect password. Try again.');
      return;
    }

    const session = { uid: user.uid, displayName: user.displayName, email, provider: 'email', photoURL: null };
    saveSession(session);
    closeAuth();
    onLogin(session);
    showAuthSuccess('Signed in locally. Connect MongoDB to use the backend session store.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign in';
  }
}

// ── SIGN IN with Google ──
// NOTE: This shows a "Coming soon" notice until you plug in Firebase.
// To enable real Google OAuth:
//   1. Create a Firebase project at https://console.firebase.google.com
//   2. Enable Google sign-in under Authentication → Sign-in method
//   3. Add your firebaseConfig and replace this function with:
//
//   import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
//   const auth = getAuth();
//   const provider = new GoogleAuthProvider();
//   async function signInWithGoogle() {
//     const result = await signInWithPopup(auth, provider);
//     // result.user has displayName, email, photoURL
//   }

function signInWithGoogle() {
  clearAuthMessages();
  const auth = getFirebaseAuth();

  if (!auth) {
    showAuthError('Firebase is not configured yet. Add the Firebase config in the page to enable Google sign-in.');
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  auth.signInWithPopup(provider)
    .then(async result => {
      const user = result.user;
      if (!user) {
        showAuthError('Google sign-in did not return a user.');
        return;
      }

      const session = {
        uid: user.uid,
        displayName: user.displayName || 'Google User',
        email: user.email || '',
        provider: 'google.com',
        photoURL: user.photoURL || null,
        token: await user.getIdToken(),
      };

      saveSession(session);
      closeAuth();
      onLogin(session);
      showAuthSuccess('Signed in with Google.');
    })
    .catch(error => {
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }

      showAuthError(error?.message || 'Google sign-in failed.');
    });
}

// ── SIGN OUT ──
function signOut() {
  clearSession();
  onLogout();
  showApp(false);
  showToast('👋 Signed out successfully');
}

function showApp(isAuthed = true) {
  const landing = document.getElementById('landing-page');
  const appShell = document.getElementById('app-shell');
  const landingChrome = document.getElementById('landing-chrome');
  const landingHeader = document.getElementById('landing-header');
  if (!landing || !appShell) return;

  landing.classList.toggle('hidden', isAuthed);
  appShell.classList.toggle('hidden', !isAuthed);
  landingChrome?.classList.toggle('hidden', isAuthed);
  landingHeader?.classList.toggle('hidden', isAuthed);
}

function applyTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('bh_theme', nextTheme);
  window.updateThemeButton?.();
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

// ── Auth state: logged IN ──
function onLogin(user) {
  window.currentUser = user;
  showApp(true);
  document.getElementById('nav-auth-out').style.display = 'none';
  document.getElementById('nav-auth-in').style.display  = 'flex';

  const initials = (user.displayName || user.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Nav avatar
  const avatarEl = document.getElementById('user-avatar');
  if (user.photoURL) {
    avatarEl.innerHTML = `<img src="${user.photoURL}" alt="avatar" onerror="this.parentElement.textContent='${initials}'">`;
  } else {
    avatarEl.textContent = initials;
  }

  // Dropdown header
  document.getElementById('dd-name').textContent  = user.displayName || 'User';
  document.getElementById('dd-email').textContent = user.email;

  // Profile page
  const profileAvatar = document.getElementById('profile-avatar-large');
  if (user.photoURL) {
    profileAvatar.innerHTML = `<img src="${user.photoURL}" alt="avatar" onerror="this.parentElement.textContent='${initials}'">`;
  } else {
    profileAvatar.textContent = initials;
  }
  document.getElementById('profile-name').textContent  = user.displayName || 'User';
  document.getElementById('profile-email').textContent = user.email;

  const isGoogle = user.provider === 'google.com';
  document.getElementById('profile-provider').innerHTML = isGoogle
    ? `<svg width="14" height="14" viewBox="0 0 24 24">
         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
       </svg>&nbsp; Connected with Google`
    : '✉️ &nbsp; Email / Password account';
}

// ── Auth state: logged OUT ──
function onLogout() {
  window.currentUser = null;
  document.getElementById('nav-auth-out').style.display = 'flex';
  document.getElementById('nav-auth-in').style.display  = 'none';
}

async function restoreSession() {
  const session = getSession();

  if (!session) {
    showApp(false);
    onLogout();
    return;
  }

  if (session.token) {
    try {
      const response = await apiRequest('/auth/me', {
        method: 'GET',
        headers: authHeaders(session.token),
      });
      onLogin(response.user);
      saveSession(response.user);
      return;
    } catch {
      // Fall back to the saved browser session when MongoDB is offline.
    }
  }

  onLogin(session);
}

// ── User dropdown toggle ──
function toggleDropdown() {
  document.getElementById('user-dropdown').classList.toggle('open');
}
document.addEventListener('click', e => {
  const menu = document.getElementById('user-menu');
  if (menu && !menu.contains(e.target)) {
    document.getElementById('user-dropdown').classList.remove('open');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  restoreSession();
  applyTheme(localStorage.getItem('bh_theme') || 'light');
});
