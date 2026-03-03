// ============================================================
// TINKAL — Firebase Config + Global Data Functions
// ============================================================

// ▸ REPLACE THESE with your own Firebase project values
//   (Instructions at bottom of this file)
const firebaseConfig = {
  apiKey: "AIzaSyBQJZpHkCPJD6txJzp0AL8L66jeKWosIXg",
  authDomain: "tinkal-website.firebaseapp.com",
  projectId: "tinkal-website",
  storageBucket: "tinkal-website.firebasestorage.app",
  messagingSenderId: "159898910075",
  appId: "1:159898910075:web:362e724e74252ae35391de"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── PROJECTS ──────────────────────────────────────────────

async function getProjects(limitCount = null, filterCategory = null) {
  try {
    let query = db.collection('projects').where('published', '==', true).orderBy('createdAt', 'desc');
    if (limitCount) query = query.limit(limitCount);
    const snap = await query.get();
    let projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (filterCategory && filterCategory !== 'all') {
      projects = projects.filter(p => p.category === filterCategory);
    }
    return projects;
  } catch (e) {
    console.error('getProjects error:', e);
    return [];
  }
}

async function getProjectById(id) {
  try {
    const doc = await db.collection('projects').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (e) { return null; }
}

async function saveProject(data, id = null) {
  const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  if (!id) payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  if (id) {
    await db.collection('projects').doc(id).update(payload);
    return id;
  } else {
    const ref = await db.collection('projects').add(payload);
    return ref.id;
  }
}

async function deleteProject(id) {
  await db.collection('projects').doc(id).delete();
}

async function getAllProjects() {
  try {
    const snap = await db.collection('projects').orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { return []; }
}

// ── REVIEWS ──────────────────────────────────────────────

async function getReviews(limitCount = null) {
  try {
    let query = db.collection('reviews').where('published', '==', true).orderBy('createdAt', 'desc');
    if (limitCount) query = query.limit(limitCount);
    const snap = await query.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { return []; }
}

async function getReviewById(id) {
  try {
    const doc = await db.collection('reviews').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (e) { return null; }
}

async function saveReview(data, id = null) {
  const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  if (!id) payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  if (id) {
    await db.collection('reviews').doc(id).update(payload);
    return id;
  } else {
    const ref = await db.collection('reviews').add(payload);
    return ref.id;
  }
}

async function deleteReview(id) {
  await db.collection('reviews').doc(id).delete();
}

async function getAllReviews() {
  try {
    const snap = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { return []; }
}

// ── ADMIN AUTH (Hardcoded – single admin) ────────────────

const ADMIN_ID = 'Kaushik._nitin';
const ADMIN_PASS = 'suku_nitin';
const SESSION_KEY = 'tinkal_admin_session';

function adminLogin(username, password) {
  if (username === ADMIN_ID && password === ADMIN_PASS) {
    localStorage.setItem(SESSION_KEY, btoa(username + ':' + Date.now()));
    return true;
  }
  return false;
}

function isAdminLoggedIn() {
  return !!localStorage.getItem(SESSION_KEY);
}

function adminLogout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = '/admin/login.html';
}

function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = '/admin/login.html';
  }
}
