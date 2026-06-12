// ─── ESports App - LocalStorage DB ───────────────────────────────────────────

const DB = {
  get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  init() {
    if (!this.get('installed')) return false;
    return true;
  }
};

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
const Auth = {
  currentUser() { return DB.get('currentUser'); },
  currentAdmin() { return DB.get('currentAdmin'); },
  requireUser() {
    if (!this.currentUser()) { window.location.href = '/login.html'; return false; }
    return true;
  },
  requireAdmin() {
    if (!this.currentAdmin()) { window.location.href = '/admin/login.html'; return false; }
    return true;
  },
  logout() { DB.set('currentUser', null); window.location.href = '/login.html'; },
  adminLogout() { DB.set('currentAdmin', null); window.location.href = '/admin/login.html'; }
};

// ─── Users ────────────────────────────────────────────────────────────────────
const Users = {
  all() { return DB.get('users') || []; },
  save(users) { DB.set('users', users); },
  find(username) { return this.all().find(u => u.username === username); },
  findById(id) { return this.all().find(u => u.id === id); },
  create(username, email, password) {
    const users = this.all();
    if (users.find(u => u.username === username)) return { error: 'Username already taken!' };
    if (users.find(u => u.email === email)) return { error: 'Email already registered!' };
    const user = { id: Date.now(), username, email, password, wallet_balance: 100, created_at: new Date().toISOString(), blocked: false };
    users.push(user);
    this.save(users);
    return { user };
  },
  update(id, data) {
    const users = this.all();
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return false;
    users[i] = { ...users[i], ...data };
    this.save(users);
    return users[i];
  }
};

// ─── Tournaments ──────────────────────────────────────────────────────────────
const Tournaments = {
  all() { return DB.get('tournaments') || []; },
  save(t) { DB.set('tournaments', t); },
  find(id) { return this.all().find(t => t.id === id); },
  create(data) {
    const tournaments = this.all();
    const t = { id: Date.now(), ...data, status: 'upcoming', room_id: '', room_password: '', winner_id: null, created_at: new Date().toISOString() };
    tournaments.push(t);
    this.save(tournaments);
    return t;
  },
  update(id, data) {
    const tournaments = this.all();
    const i = tournaments.findIndex(t => t.id === id);
    if (i === -1) return false;
    tournaments[i] = { ...tournaments[i], ...data };
    this.save(tournaments);
    return tournaments[i];
  },
  delete(id) {
    const tournaments = this.all().filter(t => t.id !== id);
    this.save(tournaments);
    Participants.removeByTournament(id);
  }
};

// ─── Participants ─────────────────────────────────────────────────────────────
const Participants = {
  all() { return DB.get('participants') || []; },
  save(p) { DB.set('participants', p); },
  forTournament(tid) { return this.all().filter(p => p.tournament_id === tid); },
  forUser(uid) { return this.all().filter(p => p.user_id === uid); },
  joined(uid, tid) { return this.all().some(p => p.user_id === uid && p.tournament_id === tid); },
  add(uid, tid) {
    const parts = this.all();
    parts.push({ id: Date.now(), user_id: uid, tournament_id: tid, result: 'Participated' });
    this.save(parts);
  },
  removeByTournament(tid) {
    this.save(this.all().filter(p => p.tournament_id !== tid));
  },
  setResult(uid, tid, result) {
    const parts = this.all();
    const i = parts.findIndex(p => p.user_id === uid && p.tournament_id === tid);
    if (i !== -1) { parts[i].result = result; this.save(parts); }
  }
};

// ─── Transactions ─────────────────────────────────────────────────────────────
const Transactions = {
  all() { return DB.get('transactions') || []; },
  save(t) { DB.set('transactions', t); },
  forUser(uid) { return this.all().filter(t => t.user_id === uid).reverse(); },
  add(uid, amount, type, description) {
    const txns = this.all();
    txns.push({ id: Date.now(), user_id: uid, amount, type, description, created_at: new Date().toISOString() });
    this.save(txns);
  }
};

// ─── Format helpers ───────────────────────────────────────────────────────────
const fmt = {
  inr: (n) => '₹' + Number(n).toLocaleString('en-IN'),
  date: (s) => new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  status: (s) => ({ upcoming: '🟡 Upcoming', live: '🔴 Live', completed: '✅ Completed' }[s] || s)
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'toast';
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

// ─── Anti-inspect JS ─────────────────────────────────────────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) e.preventDefault();
});
