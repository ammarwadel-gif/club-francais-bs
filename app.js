// ==========================================
// 1. إعدادات Firebase
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBld0r7rjg83zbrYj88t2vX6OowXSpki9E",
  authDomain: "club-francais-bs.firebaseapp.com",
  projectId: "club-francais-bs",
  storageBucket: "club-francais-bs.firebasestorage.app",
  messagingSenderId: "363775371554",
  appId: "1:363775371554:web:10cdb3eb06665df0a35d7b",
  measurementId: "G-JDBKFMHTVP"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const LOGO_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjE2IiBmaWxsPSIjMDgyYjU1Ii8+PGcgZmlsbD0iI2Q3MTkzNiI+PHBhdGggZD0iTTI0IDE1aDcydjEzSDI0ek0xNSAzM2g5MHY2SDE1ek0yNCA0NWg3MnYzMEgyNHpNMjQgODJoMjJ2MjNIMjR6TTc0IDgyaDIydjIzSDc0eiIvPjxwYXRoIGQ9Ik00NiAxMDVWNzZhMTQgMTQgMCAwIDEgMjggMHYyOWgtOVY3NmE1IDUgMCAwIDAtMTAgMHYyOXoiIGZpbGw9IiMwODJiNTUiLz48cmVjdCB4PSIzMSIgeT0iNTIiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiMwODJiNTUiLz48cmVjdCB4PSI3MSIgeT0iNTIiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiMwODJiNTUiLz48L2c+PC9zdmc+";
const OWNER_EMAIL = 'enghabiba97@gmail.com';

let currentUser = null;
let currentUserData = null;
let page = 'home';
let authMode = 'signup'; 
let adminTab = 'sessions';
let sessions = [];
let members = [];
let resources = [];
let games = [];
let certificates = [];
let challenges = [];
let leaderboardData = [];
let openSessionId = null;

let currentLang = localStorage.getItem('cfbs_lang') || 'en';
let currentTheme = localStorage.getItem('cfbs_theme') || 'light';

const translations = {
  en: { 
    home: 'Home', academic: 'My Academic Panel', gaming: 'Gaming Hub', community: 'Community', 
    revisions: 'Revisions', leaderboard: 'Leaderboard', war: 'War Arena', certificates: 'Certificates', 
    profile: 'My Profile', admin: 'Admin Panel', logout: 'Log out', login: 'Log In', signup: 'Sign Up', 
    welcome: 'Welcome back', create: 'Create your account', email: 'Email Address', password: 'Password', 
    name: 'Full Name', grade: 'Your grade', switchToLogin: 'Already have an account? Log in', 
    switchToSignup: 'New member? Create an account', editProfile: 'Edit Profile', saveChanges: 'Save Changes',
    sessionsDone: 'Sessions Completed', points: 'Total Points', certificatesEarned: 'Certificates',
    progress: 'Learning progress', notDone: 'Not Completed', done: 'Completed', forgotPass: 'Forgot Password?'
  },
  fr: { 
    home: 'Accueil', academic: 'Espace Académique', gaming: 'Espace jeux', community: 'Communauté', 
    revisions: 'Révisions', leaderboard: 'Classement', war: 'Arène', certificates: 'Certificats', 
    profile: 'Mon profil', admin: 'Panneau Admin', logout: 'Déconnexion', login: 'Se Connecter', 
    signup: "S'inscrire", welcome: 'Bon retour', create: 'Créer votre compte', email: 'Adresse e-mail', 
    password: 'Mot de passe', name: 'Nom complet', grade: 'Votre classe', switchToLogin: 'Déjà un compte ? Se connecter', 
    switchToSignup: 'Nouveau membre ? Créer un compte', editProfile: 'Modifier le profil', saveChanges: 'Enregistrer',
    sessionsDone: 'Sessions terminées', points: 'Points Totaux', certificatesEarned: 'Certificats',
    progress: 'Progrès', notDone: 'Non terminé', done: 'Terminé', forgotPass: 'Mot de passe oublié ?'
  },
  ar: {
    home: 'الرئيسية', academic: 'اللوحة الأكاديمية', gaming: 'مركز الألعاب', community: 'المجتمع', 
    revisions: 'المراجعات', leaderboard: 'المتصدرين', war: 'ساحة التحدي', certificates: 'الشهادات', 
    profile: 'ملفي الشخصي', admin: 'لوحة الإدارة', logout: 'تسجيل الخروج', login: 'تسجيل الدخول', 
    signup: 'إنشاء حساب', welcome: 'مرحباً بعودتك', create: 'أنشئ حسابك', email: 'البريد الإلكتروني', 
    password: 'كلمة المرور', name: 'الاسم بالكامل', grade: 'الصف الدراسي', switchToLogin: 'لديك حساب؟ سجل الدخول', 
    switchToSignup: 'عضو جديد؟ أنشئ حساب', editProfile: 'تعديل الملف الشخصي', saveChanges: 'حفظ التعديلات',
    sessionsDone: 'الجلسات المكتملة', points: 'إجمالي النقاط', certificatesEarned: 'الشهادات',
    progress: 'تقدمك في التعلم', notDone: 'غير مكتمل', done: 'مكتمل', forgotPass: 'نسيت كلمة المرور؟'
  }
};

function T(key) {
  if (!translations[currentLang]) return key;
  return translations[currentLang][key] || key;
}

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function getRoleLabel(role, grade) {
  if (role === 'owner') return 'Owner (المالك)';
  if (role === 'management') return 'Manager (مدير)';
  if (role === 'vice') return 'Vice Manager (نائب المدير)';
  if (grade === '10') return 'Senior 29 (Grade 10)';
  if (grade === '11') return 'Senior 28 (Grade 11)';
  return 'Member (طالب)';
}

function applyThemeAndLang() {
  document.body.dataset.theme = currentTheme;
  document.documentElement.lang = currentLang;
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cfbs_theme', currentTheme);
  applyThemeAndLang();
  renderApp();
}

function changeLang(e) {
  currentLang = e.target.value;
  localStorage.setItem('cfbs_lang', currentLang);
  applyThemeAndLang();
  renderApp();
}

// ==========================================
// 3. المصادقة والبيانات
// ==========================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists) {
      currentUserData = doc.data();
      if (user.email === OWNER_EMAIL && currentUserData.role !== 'owner') {
        await db.collection('users').doc(user.uid).update({ role: 'owner' });
        currentUserData.role = 'owner';
      }
    } else {
      const newUser = {
        email: user.email, name: user.email.split('@')[0], grade: '10',
        role: user.email === OWNER_EMAIL ? 'owner' : 'member', points: 0, completed: [], 
        customCoursesDone: 0, challengesDone: 0, certificatesDone: 0, photoUrl: ''
      };
      await db.collection('users').doc(user.uid).set(newUser);
      currentUserData = newUser;
    }
    loadData();
  } else {
    currentUser = null; currentUserData = null; renderAuth();
  }
});

async function loadData() {
  try {
    const sessSnap = await db.collection('sessions').get();
    sessions = sessSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const resSnap = await db.collection('resources').get();
    resources = resSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const gameSnap = await db.collection('games').get();
    games = gameSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const certSnap = await db.collection('certificates').get();
    certificates = certSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const chalSnap = await db.collection('challenges').get();
    challenges = chalSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const usersSnap = await db.collection('users').get();
    const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    leaderboardData = allUsers.sort((a, b) => (b.points || 0) - (a.points || 0));

    if (['owner', 'management'].includes(currentUserData.role)) {
      members = allUsers.filter(u => u.email !== OWNER_EMAIL); 
    }
    renderApp();
  } catch(e) {
    console.log("Firebase Error: ", e);
    renderApp();
  }
}

// ==========================================
// 4. رسم الواجهات (Auth)
// ==========================================
function renderAuth() {
  applyThemeAndLang();
  $('#app').innerHTML = `
    <div class="auth">
      <section class="auth-visual">
        <div class="auth-copy">
          <div class="auth-brand">
            <img src="${LOGO_SVG}" alt="Logo">
            <h1>Club Français<span>de BS</span></h1>
          </div>
          <div style="font-size:12px;letter-spacing:1.5px;font-weight:800;color:#ffd5dc;margin-bottom:15px;">APPRENDS · JOUE · PARTAGE</div>
          <p style="max-width:470px;line-height:1.8;color:#e0e9f5;font-size:16px;">A little French every day. Learn together, discover French culture, and grow as a club — one session at a time.</p>
        </div>
      </section>
      
      <section class="auth-side">
        <div class="authbox">
          <div class="auth-header">
            <div class="auth-top-brand">
              <img src="${LOGO_SVG}" alt="Logo">
              <span>CLUB FRANÇAIS DE BS</span>
            </div>
            <div class="auth-header-controls">
              <select id="langSelector" style="border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--surface);color:var(--ink);outline:none;font-weight:600;">
                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français</option>
                <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>العربية</option>
              </select>
              <button id="themeBtn" style="border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:8px 14px;font-size:14px;font-weight:600;">
                ${currentTheme === 'dark' ? '☀ Light' : '☾ Dark'}
              </button>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <div style="color:var(--red); font-weight: 800; font-size: 12px; letter-spacing: 1.5px; margin-bottom: 10px;">YOUR CLUB SPACE</div>
            <h2 style="font-size: 34px; margin-bottom: 10px; color: var(--navy);">${authMode === 'signup' ? T('create') : T('welcome')}</h2>
            <p class="muted" style="font-size: 15px; margin-top: 5px;">Join the club and keep your French progress in one place.</p>
          </div>

          <form id="authform" style="margin-top: 20px;">
            ${authMode === 'signup' ? `<div class="field"><label>${T('name')}</label><input name="name" placeholder="e.g. Marie Hassan" required></div>` : ''}
            <div class="field"><label>${T('email')}</label><input name="email" type="email" placeholder="you@example.com" required></div>
            <div class="field"><label>${T('password')}</label><input name="password" type="password" placeholder="Enter your password" minlength="6" required></div>
            ${authMode === 'signup' ? `<div class="field"><label>${T('grade')}</label><select name="grade"><option value="10">Senior 29 (Grade 10)</option><option value="11">Senior 28 (Grade 11)</option></select></div>` : ''}
            <button class="primary full" type="submit" style="margin-top: 20px;">${authMode === 'signup' ? 'Continue →' : T('login')}</button>
          </form>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
            <button id="switchAuth" style="border:0;background:none;color:var(--red);font-weight:750;font-size:15px;">
              ${authMode === 'signup' ? T('switchToLogin') : T('switchToSignup')}
            </button>
            <button id="forgotPassBtn" style="border:0;background:none;color:var(--muted);font-weight:600;font-size:14px; display:${authMode === 'login' ? 'block' : 'none'};">
              ${T('forgotPass')}
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
  
  $('#langSelector').onchange = changeLang;
  $('#themeBtn').onclick = toggleTheme;
  $('#switchAuth').onclick = () => { authMode = authMode === 'signup' ? 'login' : 'signup'; renderAuth(); };
  $('#forgotPassBtn').onclick = window.resetPassword;
  
  $('#authform').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Processing...'; btn.disabled = true;
    try {
      if (authMode === 'signup') {
        const cred = await auth.createUserWithEmailAndPassword(f.get('email'), f.get('password'));
        await db.collection('users').doc(cred.user.uid).set({
          name: f.get('name'), email: f.get('email'), grade: f.get('grade'), 
          role: f.get('email') === OWNER_EMAIL ? 'owner' : 'member', points: 0, completed: [], 
          customCoursesDone: 0, challengesDone: 0, certificatesDone: 0, photoUrl: ''
        });
      } else {
        await auth.signInWithEmailAndPassword(f.get('email'), f.get('password'));
      }
    } catch (err) { 
      alert(err.message); btn.textContent = authMode === 'signup' ? 'Continue →' : T('login'); btn.disabled = false;
    }
  };
}

window.resetPassword = async () => {
  const email = prompt("Please enter your email address to reset your password:");
  if (!email) return;
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset email sent! Please check your inbox.");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// ==========================================
// 5. رسم الواجهة الرئيسية
// ==========================================
function renderApp() {
  applyThemeAndLang();
  if (!currentUser) return renderAuth();
  
  const isOwner = currentUserData.role === 'owner' || currentUserData.email === OWNER_EMAIL;
  const isManager = currentUserData.role === 'management';
  const isVice = currentUserData.role === 'vice';
  const canSeeAdmin = isOwner || isManager || isVice;
  
  const navItems = [
    ['home', T('home'), '⌂'], ['academic', T('academic'), '▤'], 
    ['gaming', T('gaming'), '✦'], ['community', T('community'), '◎'], 
    ['revisions', T('revisions'), '▧'], ['leaderboard', T('leaderboard'), '♛'], 
    ['war', T('war'), '⚔'], ['certificates', T('certificates'), '◇'], 
    ['profile', T('profile'), '◉']
  ];
  if (canSeeAdmin) navItems.push(['admin', T('admin'), '⚙']);

  let avatarHtml = currentUserData.photoUrl 
    ? `<img src="${currentUserData.photoUrl}" style="width:45px;height:45px;border-radius:50%;object-fit:cover;border:2px solid #fff;margin-right:12px;">` 
    : `<div style="width:45px;height:45px;border-radius:50%;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:20px;margin-right:12px;">${currentUserData.name.charAt(0).toUpperCase()}</div>`;

  $('#app').innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">
          <img src="${LOGO_SVG}" alt="Logo">
          <div><b>Club Français</b><small>de BS</small></div>
        </div>
        <div class="nav-label">YOUR SPACE</div>
        <nav class="nav">
          ${navItems.map(n => `<button class="${page === n[0] ? 'active' : ''}" data-page="${n[0]}"><span style="font-size:20px">${n[2]}</span> ${n[1]}</button>`).join('')}
        </nav>
        <div class="sidebottom">
          <div style="display:flex; align-items:center; margin-bottom:10px;">
            ${avatarHtml}
            <div>
              <b style="display:block;line-height:1.3; font-size:15px;">${esc(currentUserData.name)}</b>
              <span style="font-size:12px;color:#b5c9e0;">${getRoleLabel(currentUserData.role, currentUserData.grade)}</span>
            </div>
          </div>
          <button id="logout">${T('logout')}</button>
        </div>
      </aside>
      <main class="main">
        <header class="top">
          <div class="crumb">CLUB FRANÇAIS / ${page.toUpperCase()}</div>
          <div class="top-right" style="display:flex;gap:15px;align-items:center;">
            <select id="langSelector" style="border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--field);color:var(--ink);outline:none; font-weight:600;">
              <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
              <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français</option>
              <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>العربية</option>
            </select>
            <button class="secondary" id="themeBtn">
              ${currentTheme === 'dark' ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        </header>
        <div class="content" id="mainContent"></div>
      </main>
    </div>
    <div id="modalContainer"></div>
  `;

  $('#langSelector').onchange = changeLang;
  $('#themeBtn').onclick = toggleTheme;
  $$('.nav button').forEach(b => b.onclick = () => { page = b.dataset.page; renderApp(); });
  $('#logout').onclick = () => auth.signOut();
  
  renderPageContent();
}

// ==========================================
// 6. محتوى الصفحات
// ==========================================
function renderPageContent() {
  if (page === 'admin' && !['owner', 'management', 'vice'].includes(currentUserData.role) && currentUserData.email !== OWNER_EMAIL) {
    page = 'home'; renderApp(); return;
  }

  const content = $('#mainContent');
  
  if (page === 'home') {
    const completedCount = (currentUserData.completed || []).length;
    const progress = Math.min(100, Math.round(completedCount / Math.max(1, sessions.length) * 100));
    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:30px;">
        <div>
          <div style="font-size:13px;letter-spacing:1.5px;font-weight:800;color:var(--muted);margin-bottom:10px;">YOUR LEARNING SPACE</div>
          <h1 style="margin:0;font-size:38px;color:var(--navy); font-weight:800;">Bonjour, <span style="color:var(--red);font-style:italic">${esc(currentUserData.name.split(' ')[0])}.</span></h1>
          <p class="muted" style="margin-top:8px; font-size:16px;">Your French learning journey starts here.</p>
        </div>
        <div class="tag" style="font-size:15px; padding:8px 15px;">${new Date().toLocaleDateString()}</div>
      </div>
      
      <div style="background:linear-gradient(120deg,#082b55,#123d70);color:#fff;border-radius:20px;padding:40px;position:relative;overflow:hidden; margin-bottom:40px; box-shadow: 0 10px 30px rgba(8,43,85,0.2);">
         <div style="font-size:13px;letter-spacing:1.5px;font-weight:800;color:#ffb3be;margin-bottom:15px;">PETITS PAS, GRANDS PROGRÈS</div>
         <h2 style="margin:0 0 15px;font-size:42px;line-height:1.1; font-weight:800;">Learn French.<br><em style="color:#ff899b;font-style:italic">Enjoy the journey.</em></h2>
         <p style="margin:0 0 25px;font-size:17px;color:#d1deed; max-width:500px; line-height:1.6;">Practice French, discover culture, and collect points as you go.</p>
         <button class="primary" style="padding:15px 25px; font-size:16px;" onclick="window.go('academic')">Explore sessions →</button>
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:25px;">
           <div>
              <div style="font-size:13px;letter-spacing:1.5px;font-weight:800;color:var(--muted);">YOUR PROGRESS</div>
              <h2 style="margin:5px 0 0;color:var(--navy);font-size:28px; font-weight:800;">Your learning snapshot</h2>
           </div>
           <span class="tag" style="font-size:15px; padding:8px 15px;">${progress}% complete</span>
        </div>
        
        <div class="admin-stats">
          <div class="admin-stat">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <small>${T('points')}</small>
              <span style="font-size:28px; color:var(--red);">♛</span>
            </div>
            <b>${currentUserData.points || 0}</b>
            <small style="margin-top:10px;">Earn 20 pts per session</small>
          </div>
          
          <div class="admin-stat">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <small>${T('sessionsDone')}</small>
              <span style="font-size:28px; color:var(--navy);">▤</span>
            </div>
            <b>${completedCount} / ${sessions.length}</b>
            <div style="width:100%;height:8px;background:var(--line);border-radius:4px;margin-top:15px;">
              <div style="width:${progress}%;height:100%;background:var(--red);border-radius:4px;"></div>
            </div>
          </div>
          
          <div class="admin-stat">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <small>${T('certificatesEarned')}</small>
              <span style="font-size:28px; color:var(--success);">◇</span>
            </div>
            <b>${certificates.length}</b>
            <small style="margin-top:10px;">Published by management</small>
          </div>
        </div>
      </div>
    `;
  }
  
  if (page === 'academic') {
    content.innerHTML = `
      <div style="margin-bottom:30px;">
        <div style="font-size:13px;letter-spacing:1.5px;font-weight:800;color:var(--muted);">LEARN & PRACTICE · ${getRoleLabel(currentUserData.role, currentUserData.grade)}</div>
        <h1 style="color:var(--navy);font-size:36px;margin:10px 0; font-weight:800;">${T('academic')}</h1>
        <p class="muted" style="font-size:16px;">Showing sessions for your grade. Every session has four clear parts: lesson video, reading material, quiz, and your reflection video.</p>
      </div>
      
      <div>
        ${sessions.map((s, index) => {
          const isDone = (currentUserData.completed || []).includes(s.id);
          return `
            <div class="session-card">
              <div class="session-header">
                <div style="display:flex;">
                  <div class="session-num">${String(index+1).padStart(2, '0')}</div>
                  <div>
                    <div style="font-size:13px;font-weight:800;color:var(--muted);margin-bottom:8px;">${esc(s.theme||'SESSION')} · ${esc(s.duration||'Self-paced')}</div>
                    <h3 class="session-title">${esc(s.title)}</h3>
                    <p class="muted" style="margin:0;font-size:15px;">${esc(s.description)}</p>
                  </div>
                </div>
                ${isDone ? `<span class="tag success" style="font-size:14px; padding:10px 15px;">✓ ${T('done')}</span>` : `<button class="primary" onclick="window.completeSession('${s.id}')">Mark complete · +20 pts</button>`}
              </div>
              
              <div class="step">
                <div class="step-head">1. Session video</div>
                ${s.videoUrl ? `<video src="${esc(s.videoUrl)}" controls style="width:100%; border-radius:12px; max-height:450px; background:#000;"></video>` : `<p class="muted" style="font-size:15px;">The session video will appear here when management uploads the MP4.</p>`}
              </div>
              
              <div class="step">
                <div class="step-head">2. Reading material (File)</div>
                ${s.fileUrl ? `<a href="${esc(s.fileUrl)}" target="_blank" class="primary" style="display:inline-block;">📄 Download Summary File</a>` : `<p class="muted" style="font-size:15px;">Reading material will be published here by management.</p>`}
              </div>

              <div class="step">
                <div class="step-head">3. Quiz</div>
                ${s.quizUrl ? `<a href="${esc(s.quizUrl)}" target="_blank" class="secondary" style="display:inline-block;">Open Quiz →</a>` : `<p class="muted" style="font-size:15px;">The quiz link will appear here when management adds it.</p>`}
              </div>

              <div class="step">
                <div class="step-head">4. Your reflection video (Optional · +25 pts)</div>
                <p class="muted" style="font-size:15px; margin-bottom:15px;">Record a short video explaining what you learned from this session.</p>
                <input type="file" id="ref_${s.id}" accept="video/mp4,video/*" style="display:block; margin-bottom:15px; font-size:15px;">
                <button class="secondary" onclick="window.uploadReflection('${s.id}')">Upload Reflection</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  if (page === 'profile') {
    const completedCount = (currentUserData.completed || []).length;
    const progress = Math.min(100, Math.round(completedCount / Math.max(1, sessions.length) * 100));
    const completedSessions = sessions.filter(s => (currentUserData.completed || []).includes(s.id));
    const pendingSessions = sessions.filter(s => !(currentUserData.completed || []).includes(s.id));

    let avatarHtml = currentUserData.photoUrl 
      ? `<img src="${currentUserData.photoUrl}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid var(--line); margin-bottom:15px;">` 
      : `<div style="width:120px;height:120px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:50px;font-weight:bold;text-transform:uppercase; margin-bottom:15px;">${esc(currentUserData.name.charAt(0))}</div>`;

    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('profile')}</h1><p class="muted" style="font-size:16px;">Your personal information and progress.</p></div>
      
      <div style="display:grid; grid-template-columns: 1fr 2fr; gap:30px; align-items:start;">
        <div class="session-card" style="padding:40px; text-align:center;">
          ${avatarHtml}
          <div style="margin-bottom:25px;">
            <input type="file" id="profilePicInput" accept="image/*" style="display:none;">
            <button class="secondary" onclick="document.getElementById('profilePicInput').click()">📷 Upload Picture</button>
          </div>
          
          <h2 style="margin:0 0 8px; color:var(--navy); font-size:28px;">${esc(currentUserData.name)}</h2>
          <p class="muted" style="margin:0 0 20px; font-size:16px;">${esc(currentUserData.email)}</p>
          <span class="tag" style="display:inline-block; background:var(--red); color:#fff; font-size:14px; padding:8px 15px;">${getRoleLabel(currentUserData.role, currentUserData.grade)}</span>
          
          <div style="margin-top:25px; border-top:1px solid var(--line); padding-top:25px;">
            <button class="primary full" onclick="window.editMyProfile()">✎ ${T('editProfile')}</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:25px;">
          <!-- إحصائيات الـ Owner -->
          <div class="admin-stats" style="margin-bottom:0; grid-template-columns: repeat(4, 1fr);">
            <div class="admin-stat" style="padding:20px;">
               <small class="muted">${T('points')}</small><b style="color:var(--red); font-size:32px;">${currentUserData.points || 0}</b>
            </div>
            <div class="admin-stat" style="padding:20px;">
               <small class="muted">Courses Done</small><b style="font-size:32px;">${(currentUserData.completed||[]).length + (currentUserData.customCoursesDone||0)}</b>
            </div>
            <div class="admin-stat" style="padding:20px;">
               <small class="muted">Challenges</small><b style="font-size:32px;">${currentUserData.challengesDone || 0}</b>
            </div>
            <div class="admin-stat" style="padding:20px;">
               <small class="muted">Certificates</small><b style="font-size:32px;">${currentUserData.certificatesDone || 0}</b>
            </div>
          </div>

          <div class="session-card" style="padding:25px;">
            <h3 style="margin-top:0; color:var(--navy); font-size:20px; border-bottom:1px solid var(--line); padding-bottom:15px;">✓ ${T('done')} (${completedSessions.length})</h3>
            ${completedSessions.length === 0 ? '<p class="muted">No completed sessions yet.</p>' : ''}
            ${completedSessions.map(s => `<div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:15px;"><span class="tag success" style="margin-right:10px;">✓</span> ${esc(s.title)}</div>`).join('')}
          </div>

          <div class="session-card" style="padding:25px;">
            <h3 style="margin-top:0; color:var(--navy); font-size:20px; border-bottom:1px solid var(--line); padding-bottom:15px;">○ ${T('notDone')} (${pendingSessions.length})</h3>
            ${pendingSessions.length === 0 ? '<p class="muted">All sessions are completed!</p>' : ''}
            ${pendingSessions.map(s => `<div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:15px;"><span class="tag warn" style="margin-right:10px;">○</span> ${esc(s.title)}</div>`).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('profilePicInput').onchange = window.uploadProfilePic;
  }

  if (page === 'admin' && ['owner', 'management', 'vice'].includes(currentUserData.role)) {
    const isOwner = currentUserData.role === 'owner' || currentUserData.email === OWNER_EMAIL;
    const isOwnerOrManager = isOwner || currentUserData.role === 'management';
    
    content.innerHTML = `
      <div style="margin-bottom:30px; display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <h1 style="font-size:36px; font-weight:800; color:var(--navy); margin:0;">${T('admin')}</h1>
          <p class="muted" style="font-size:16px; margin-top:5px;">Manage club content, members, and settings.</p>
        </div>
        <!-- زرار خاص بالمالك فقط لتعديل الأرقام -->
        ${isOwner ? `<button class="primary" onclick="window.openOwnerSettings()">⚙ Owner Settings</button>` : ''}
      </div>
      
      <div class="admin-stats">
        <div class="admin-stat"><small>Sessions</small><b>${sessions.length}</b></div>
        <div class="admin-stat"><small>Members</small><b>${members.length}</b></div>
        <div class="admin-stat"><small>Challenges</small><b>${challenges.length}</b></div>
        <div class="admin-stat"><small>Certificates</small><b>${certificates.length}</b></div>
      </div>
      
      <div class="admin-tabs" style="flex-wrap:wrap;">
        <button class="admin-tab ${adminTab === 'sessions' ? 'active' : ''}" onclick="window.setTab('sessions')">📹 Sessions</button>
        ${isOwnerOrManager ? `<button class="admin-tab ${adminTab === 'members' ? 'active' : ''}" onclick="window.setTab('members')">👥 Members</button>` : ''}
        <button class="admin-tab ${adminTab === 'resources' ? 'active' : ''}" onclick="window.setTab('resources')">📚 Resources</button>
        <button class="admin-tab ${adminTab === 'gaming' ? 'active' : ''}" onclick="window.setTab('gaming')">🎮 Games</button>
        <button class="admin-tab ${adminTab === 'certificates' ? 'active' : ''}" onclick="window.setTab('certificates')">🏅 Certificates</button>
        <button class="admin-tab ${adminTab === 'war' ? 'active' : ''}" onclick="window.setTab('war')">⚔ Challenges</button>
      </div>
      <div id="adminTabContent">${renderAdminTab()}</div>
    `;
  }

  if (page === 'revisions') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('revisions')}</h1><p class="muted" style="font-size:16px;">Download resources, files, and videos shared by management.</p></div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px,1fr)); gap:25px; margin-top:20px;">
        ${resources.length === 0 ? '<div class="empty" style="grid-column: 1/-1; text-align:center; padding:40px; border:1px dashed var(--line); border-radius:14px; color:var(--muted); font-size:16px;">No resources published yet.</div>' : ''}
        ${resources.map(r => `
          <div class="session-card" style="padding:25px; display:flex; flex-direction:column;">
            <h3 style="margin-top:0; color:var(--navy); font-size:22px;">${esc(r.title)}</h3>
            <p class="muted" style="font-size:15px; flex-grow:1;">${esc(r.description || 'No description')}</p>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
              ${r.fileUrl ? `<a href="${esc(r.fileUrl)}" target="_blank" class="primary" style="text-align:center;">📄 Download File</a>` : ''}
              ${r.videoUrl ? `<a href="${esc(r.videoUrl)}" target="_blank" class="primary" style="text-align:center; background:#082b55;">🎥 Watch Video</a>` : ''}
              ${r.linkUrl ? `<a href="${esc(r.linkUrl)}" target="_blank" class="secondary" style="text-align:center;">🔗 Open Link</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (page === 'gaming') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('gaming')}</h1><p class="muted" style="font-size:16px;">Play fun games to improve your French while having a break!</p></div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:25px; margin-top:20px;">
        ${games.length === 0 ? '<div class="empty" style="grid-column: 1/-1; text-align:center; padding:40px; border:1px dashed var(--line); border-radius:14px; color:var(--muted); font-size:16px;">No games added yet.</div>' : ''}
        ${games.map(g => `
          <div class="session-card" style="padding:25px; text-align:center;">
            <div style="font-size:50px; margin-bottom:15px;">🎮</div>
            <h3 style="margin:0 0 10px; color:var(--navy); font-size:22px;">${esc(g.title)}</h3>
            <p class="muted" style="font-size:15px;">${esc(g.description || 'Fun French game')}</p>
            <a href="${esc(g.url)}" target="_blank" class="primary" style="display:inline-block; margin-top:20px;">Play Now</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (page === 'certificates') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('certificates')}</h1><p class="muted" style="font-size:16px;">View and claim your certificates here!</p></div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px,1fr)); gap:25px; margin-top:20px;">
        ${certificates.length === 0 ? '<div class="empty" style="grid-column: 1/-1; text-align:center; padding:40px; border:1px dashed var(--line); border-radius:14px; color:var(--muted); font-size:16px;">No certificates published yet.</div>' : ''}
        ${certificates.map(c => `
          <div class="session-card" style="padding:25px; text-align:center;">
            <div style="font-size:50px; margin-bottom:15px;">🏅</div>
            <h3 style="margin:0 0 10px; color:var(--navy); font-size:22px;">${esc(c.title)}</h3>
            <p class="muted" style="font-size:15px;">${esc(c.description)}</p>
            <button onclick="window.claimCertificate('${esc(c.url)}', '${esc(c.title)}')" class="primary" style="display:inline-block; margin-top:20px;">Claim Certificate</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (page === 'war') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('war')}</h1><p class="muted" style="font-size:16px;">Compete with your friends in the next challenge.</p></div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px,1fr)); gap:25px; margin-top:20px;">
        ${challenges.length === 0 ? '<div class="empty" style="grid-column: 1/-1; text-align:center; padding:40px; border:1px dashed var(--line); border-radius:14px; color:var(--muted); font-size:16px;">No challenges available right now.</div>' : ''}
        ${challenges.map(c => `
          <div class="session-card" style="padding:25px; text-align:center;">
            <div style="font-size:50px; margin-bottom:15px;">⚔️</div>
            <h3 style="margin:0 0 10px; color:var(--navy); font-size:22px;">${esc(c.title)}</h3>
            <p class="muted" style="font-size:15px;">${esc(c.description)}</p>
            <a href="${esc(c.url)}" target="_blank" class="primary" style="display:inline-block; margin-top:20px; background:var(--red);">Accept Challenge</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (page === 'leaderboard') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('leaderboard')}</h1><p class="muted" style="font-size:16px;">See who is leading the club in points!</p></div>
      <div class="admin-table" style="max-width:900px; margin:auto;">
        <div class="admin-table-head" style="grid-template-columns: 100px 2fr 1.5fr 1fr;"><div>RANK</div><div>NAME</div><div>ROLE</div><div>POINTS</div></div>
        ${leaderboardData.map((u, i) => `
          <div class="admin-table-row" style="grid-template-columns: 100px 2fr 1.5fr 1fr;">
            <div style="font-weight:bold; color:${i===0?'#fbbf24':i===1?'#9ca3af':i===2?'#b45309':'inherit'}; font-size:20px;">
              #${i+1} ${i===0?'🥇':i===1?'🥈':i===2?'🥉':''}
            </div>
            <div><b style="font-size:16px;">${esc(u.name)}</b></div>
            <div><span class="tag" style="font-size:12px;">${getRoleLabel(u.role, u.grade)}</span></div>
            <div><b style="color:var(--red); font-size:18px;">${u.points || 0} pts</b></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (page === 'community') {
    content.innerHTML = `
      <div style="margin-bottom:30px;"><h1 style="font-size:36px; font-weight:800; color:var(--navy);">${T('community')}</h1><p class="muted" style="font-size:16px;">Share your French learning journey with the club!</p></div>
      <div class="session-card" style="max-width:800px; margin:0 auto 30px auto; padding:30px;">
         <div class="field" style="margin-top:0;">
           <label>Write a new post</label>
           <textarea id="postContent" placeholder="Quoi de neuf aujourd'hui ?" style="width:100%; height:100px; padding:15px; border-radius:10px; border:1px solid var(--line); background:var(--field); color:var(--ink); font-size:16px;"></textarea>
         </div>
         <button class="primary" onclick="window.addPost()">Post to Community</button>
      </div>
      <div id="postsFeed" style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">
         <div class="muted" style="text-align:center;">Loading posts...</div>
      </div>
    `;
    window.loadPosts();
  }
}

window.go = (p) => { page = p; renderApp(); };
window.setTab = (tab) => { adminTab = tab; renderPageContent(); };

// ==========================================
// 7. لوحة التحكم (Admin)
// ==========================================
function renderAdminTab() {
  if (adminTab === 'sessions') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Academic sessions (${sessions.length})</h2>
        <button class="primary" onclick="window.openSessionBuilder()">＋ New session</button>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 1fr 1fr 1fr 120px;"><div>SESSION</div><div>VIDEO</div><div>FILE</div><div>QUIZ</div><div>ACTIONS</div></div>
        ${sessions.map(s => `
          <div class="admin-table-row" style="grid-template-columns: 2fr 1fr 1fr 1fr 120px;">
            <div><b>${esc(s.title)}</b></div>
            <div>${s.videoUrl ? '<span class="tag success">✓ MP4</span>' : '<span class="tag warn">None</span>'}</div>
            <div>${s.fileUrl ? '<span class="tag success">✓ Yes</span>' : '<span class="tag warn">None</span>'}</div>
            <div>${s.quizUrl ? '<span class="tag success">✓ Link</span>' : '<span class="tag warn">None</span>'}</div>
            <div><button class="danger" onclick="window.deleteSession('${s.id}')">🗑 Delete</button></div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (adminTab === 'members' && ['owner', 'management'].includes(currentUserData.role)) {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Club members (${members.length})</h2>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 1.5fr 1fr 1fr 220px;"><div>NAME</div><div>ROLE</div><div>GRADE</div><div>POINTS</div><div>ACTIONS</div></div>
        ${members.map(m => `
          <div class="admin-table-row" style="grid-template-columns: 2fr 1.5fr 1fr 1fr 220px;">
            <div><b>${esc(m.name)}</b><small style="display:block;color:var(--muted); font-size:13px;">${esc(m.email)}</small></div>
            <div><span class="tag" style="font-size:12px;">${getRoleLabel(m.role, m.grade)}</span></div>
            <div>Grade ${esc(m.grade)}</div>
            <div><b style="color:var(--red);">${m.points || 0} pts</b></div>
            <div style="display:flex; gap:8px;">
              <button class="secondary" onclick="window.viewMemberStats('${m.id}')">👁 View</button>
              <button class="secondary" onclick="window.editMember('${m.id}')">✎ Edit</button>
              <button class="danger" onclick="window.removeMember('${m.id}')">🗑 Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (adminTab === 'resources') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Resources (${resources.length})</h2>
        <button class="primary" onclick="window.openResourceBuilder()">＋ Add Resource</button>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 1fr 120px;"><div>TITLE</div><div>FILES/LINKS</div><div>ACTIONS</div></div>
        ${resources.map(r => {
          let filesCount = (r.fileUrl?1:0) + (r.videoUrl?1:0) + (r.linkUrl?1:0);
          return `
          <div class="admin-table-row" style="grid-template-columns: 2fr 1fr 120px;">
            <div><b>${esc(r.title)}</b></div>
            <div><span class="tag">${filesCount} Attached</span></div>
            <div><button class="danger" onclick="window.deleteResource('${r.id}')">🗑 Delete</button></div>
          </div>
        `}).join('')}
      </div>
    `;
  }

  if (adminTab === 'gaming') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Gaming Hub (${games.length})</h2>
        <button class="primary" onclick="window.openGameBuilder()">＋ Add Game</button>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 120px;"><div>TITLE</div><div>ACTIONS</div></div>
        ${games.map(g => `
          <div class="admin-table-row" style="grid-template-columns: 2fr 120px;">
            <div><b>${esc(g.title)}</b></div>
            <div><button class="danger" onclick="window.deleteGame('${g.id}')">🗑 Delete</button></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (adminTab === 'certificates') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Certificates (${certificates.length})</h2>
        <button class="primary" onclick="window.openCertificateBuilder()">＋ Add Certificate</button>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 120px;"><div>TITLE</div><div>ACTIONS</div></div>
        ${certificates.map(c => `
          <div class="admin-table-row" style="grid-template-columns: 2fr 120px;">
            <div><b>${esc(c.title)}</b></div>
            <div><button class="danger" onclick="window.deleteCertificate('${c.id}')">🗑 Delete</button></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (adminTab === 'war') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0; font-size:24px;">Challenges (${challenges.length})</h2>
        <button class="primary" onclick="window.openWarBuilder()">＋ Add Challenge</button>
      </div>
      <div class="admin-table">
        <div class="admin-table-head" style="grid-template-columns: 2fr 120px;"><div>TITLE</div><div>ACTIONS</div></div>
        ${challenges.map(c => `
          <div class="admin-table-row" style="grid-template-columns: 2fr 120px;">
            <div><b>${esc(c.title)}</b></div>
            <div><button class="danger" onclick="window.deleteWar('${c.id}')">🗑 Delete</button></div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ==========================================
// 8. الدوال (Modals & Actions)
// ==========================================
window.viewMemberStats = async (id) => {
  const m = members.find(x => x.id === id);
  if(!m) return;
  
  const completedSessions = sessions.filter(s => (m.completed || []).includes(s.id));
  const progress = Math.min(100, Math.round(completedSessions.length / Math.max(1, sessions.length) * 100));

  $('#modalContainer').innerHTML = `
    <div class="session-modal">
      <div class="session-modal-inner" style="max-width: 600px;">
        <div class="session-modal-head" style="background:var(--navy);">
          <div>
            <h2 style="margin:0; font-size:22px;">${esc(m.name)}'s Statistics</h2>
            <p style="margin:5px 0 0; color:#d1deed; font-size:14px;">${esc(m.email)}</p>
          </div>
          <button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button>
        </div>
        <div class="session-modal-body">
          <div class="admin-stats" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 20px;">
             <div class="admin-stat" style="padding:15px;">
               <small class="muted">Total Points</small><b style="color:var(--red); font-size:28px;">${m.points || 0}</b>
             </div>
             <div class="admin-stat" style="padding:15px;">
               <small class="muted">Overall Progress</small><b style="font-size:28px;">${progress}%</b>
             </div>
             <div class="admin-stat" style="padding:15px;">
               <small class="muted">Courses Done</small><b style="font-size:28px;">${(m.completed||[]).length + (m.customCoursesDone||0)}</b>
             </div>
             <div class="admin-stat" style="padding:15px;">
               <small class="muted">Challenges Done</small><b style="font-size:28px;">${m.challengesDone || 0}</b>
             </div>
          </div>

          <h3 style="margin-top:0; color:var(--navy); font-size:18px; border-bottom:1px solid var(--line); padding-bottom:10px;">✓ Completed Sessions (${completedSessions.length})</h3>
          ${completedSessions.length === 0 ? '<p class="muted" style="font-size:14px;">No completed sessions.</p>' : ''}
          ${completedSessions.map(s => `<div style="padding:8px 0; border-bottom:1px solid var(--line); font-size:14px;"><span class="tag success" style="margin-right:8px;">✓</span> ${esc(s.title)}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
};

window.openOwnerSettings = () => {
  // دالة خاصة بالمالك فقط عشان يعدل الأرقام لأي حد
  let options = `<option value="${currentUser.uid}">${esc(currentUserData.name)} (Myself)</option>`;
  members.forEach(m => {
    options += `<option value="${m.id}">${esc(m.name)} (${m.email})</option>`;
  });

  $('#modalContainer').innerHTML = `
    <div class="session-modal">
      <div class="session-modal-inner">
        <div class="session-modal-head">
          <h2 style="margin:0; font-size:24px;">Owner Settings (Full Control)</h2>
          <button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button>
        </div>
        <div class="session-modal-body">
          <form id="ownerSettingsForm">
            <div class="field">
              <label>Select User to Modify *</label>
              <select name="targetUser" id="targetUserSelect" required style="font-size: 16px;">
                ${options}
              </select>
            </div>
            <div class="field"><label>Points</label><input name="points" type="number" id="setPoints" required></div>
            <div class="field"><label>Extra Courses Done (Number only)</label><input name="customCourses" type="number" id="setCourses" required></div>
            <div class="field"><label>Challenges Done</label><input name="challengesDone" type="number" id="setChallenges" required></div>
            <div class="field"><label>Certificates Earned</label><input name="certificatesDone" type="number" id="setCertificates" required></div>
            
            <p class="muted" style="font-size:12px;">Note: Normal Courses are calculated automatically from the "Mark Complete" button. If you want to add extra numbers, just put them in "Extra Courses Done".</p>
            
            <button class="primary full" type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // دالة عشان تجيب أرقام اليوزر الحالي أول ما يختاره
  const populateFields = async (uid) => {
    if (uid === currentUser.uid) {
      $('#setPoints').value = currentUserData.points || 0;
      $('#setCourses').value = currentUserData.customCoursesDone || 0;
      $('#setChallenges').value = currentUserData.challengesDone || 0;
      $('#setCertificates').value = currentUserData.certificatesDone || 0;
    } else {
      const doc = await db.collection('users').doc(uid).get();
      if(doc.exists) {
        const data = doc.data();
        $('#setPoints').value = data.points || 0;
        $('#setCourses').value = data.customCoursesDone || 0;
        $('#setChallenges').value = data.challengesDone || 0;
        $('#setCertificates').value = data.certificatesDone || 0;
      }
    }
  };

  const targetSelect = $('#targetUserSelect');
  targetSelect.onchange = (e) => populateFields(e.target.value);
  populateFields(targetSelect.value); // تنفيذ أولي

  $('#ownerSettingsForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const targetUid = f.get('targetUser');
    
    try {
      await db.collection('users').doc(targetUid).update({
        points: parseInt(f.get('points')),
        customCoursesDone: parseInt(f.get('customCourses')),
        challengesDone: parseInt(f.get('challengesDone')),
        certificatesDone: parseInt(f.get('certificatesDone'))
      });
      
      if (targetUid === currentUser.uid) {
        currentUserData.points = parseInt(f.get('points'));
        currentUserData.customCoursesDone = parseInt(f.get('customCourses'));
        currentUserData.challengesDone = parseInt(f.get('challengesDone'));
        currentUserData.certificatesDone = parseInt(f.get('certificatesDone'));
      }
      
      alert('User statistics updated successfully!');
      window.closeModal();
      loadData();
    } catch(err) {
      alert("Error: " + err.message);
    }
  };
};

window.editMyProfile = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal">
      <div class="session-modal-inner">
        <div class="session-modal-head">
          <h2 style="margin:0; font-size:24px;">${T('editProfile')}</h2>
          <button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button>
        </div>
        <div class="session-modal-body">
          <form id="editMyProfileForm">
            <div class="field"><label>${T('name')}</label><input name="name" value="${esc(currentUserData.name)}" required></div>
            <div class="field"><label>${T('email')}</label><input name="email" value="${esc(currentUserData.email)}" type="email" required></div>
            <div class="field"><label>${T('grade')}</label>
              <select name="grade">
                <option value="10" ${currentUserData.grade==='10'?'selected':''}>Senior 29 (Grade 10)</option>
                <option value="11" ${currentUserData.grade==='11'?'selected':''}>Senior 28 (Grade 11)</option>
              </select>
            </div>
            <button class="primary full" type="submit">${T('saveChanges')}</button>
          </form>
        </div>
      </div>
    </div>
  `;

  $('#editMyProfileForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await db.collection('users').doc(currentUser.uid).update({
        name: f.get('name'),
        email: f.get('email'),
        grade: f.get('grade')
      });
      currentUserData.name = f.get('name');
      currentUserData.email = f.get('email');
      currentUserData.grade = f.get('grade');
      
      window.closeModal();
      loadData(); 
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };
};

window.uploadProfilePic = async () => {
  const fileInput = document.getElementById('profilePicInput');
  const file = fileInput.files[0];
  if(!file) return;

  const btn = fileInput.nextElementSibling;
  const originalText = btn.textContent;
  btn.textContent = 'Uploading...';
  btn.disabled = true;

  try {
    const storageRef = storage.ref(`profiles/${currentUser.uid}_${Date.now()}`);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    
    await db.collection('users').doc(currentUser.uid).update({ photoUrl: url });
    currentUserData.photoUrl = url;
    
    alert('Profile picture updated successfully!');
    loadData();
  } catch(err) {
    alert("Error uploading picture: " + err.message);
    btn.textContent = originalText;
    btn.disabled = false;
  }
};

window.claimCertificate = (url, title) => {
  let name = prompt(`Enter your full name as it should appear on the certificate (${title}):`);
  if(name && name.trim() !== '') {
    window.open(url, '_blank');
    alert(`Congratulations ${name}! Your certificate is downloading.`);
  }
};

window.addPost = async () => {
  const text = $('#postContent').value.trim();
  if(!text) return alert('Write something first!');
  await db.collection('posts').add({
    text: text, author: currentUserData.name, role: getRoleLabel(currentUserData.role, currentUserData.grade),
    uid: currentUser.uid, likes: [], createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  $('#postContent').value = ''; window.loadPosts();
};

window.loadPosts = async () => {
  const feed = $('#postsFeed');
  if(!feed) return;
  const snap = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
  const postsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  if(postsData.length === 0) {
    feed.innerHTML = `<div class="muted" style="text-align:center; font-size:16px; padding:20px;">No posts yet. Be the first!</div>`;
    return;
  }
  
  const isAdmin = ['owner', 'management', 'vice'].includes(currentUserData.role);

  feed.innerHTML = postsData.map(p => {
    const hasLiked = p.likes && p.likes.includes(currentUser.uid);
    const likesCount = p.likes ? p.likes.length : 0;
    return `
    <div class="session-card" style="padding:25px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
        <b style="color:var(--navy); font-size:18px;">${esc(p.author)}</b>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="tag" style="font-size:12px;">${esc(p.role)}</span>
          ${isAdmin ? `<button onclick="window.deletePost('${p.id}')" style="background:none;border:none;color:red;cursor:pointer; font-size:18px;">🗑</button>` : ''}
        </div>
      </div>
      <p style="margin:0 0 15px; font-size:16px; white-space:pre-wrap;">${esc(p.text)}</p>
      <button onclick="window.toggleLike('${p.id}', ${JSON.stringify(p.likes || [])})" style="background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:8px; color:${hasLiked ? 'var(--red)' : 'var(--muted)'}; font-weight:bold; font-size:15px;">
        ${hasLiked ? '❤️' : '🤍'} ${likesCount} Likes
      </button>
    </div>
  `}).join('');
};

window.toggleLike = async (postId, currentLikes) => {
  const likes = currentLikes || [];
  const index = likes.indexOf(currentUser.uid);
  if(index === -1) { likes.push(currentUser.uid); } else { likes.splice(index, 1); }
  await db.collection('posts').doc(postId).update({ likes: likes });
  window.loadPosts();
};

window.deletePost = async (id) => {
  if (!confirm('Delete this post?')) return;
  await db.collection('posts').doc(id).delete(); window.loadPosts();
};

// دوال الأدمن
window.editMember = (id) => {
  const m = members.find(x => x.id === id);
  if (!m) return;
  
  if (m.email === OWNER_EMAIL) return alert('You cannot edit the Owner account.');

  const isOwner = currentUserData.role === 'owner' || currentUserData.email === OWNER_EMAIL;
  const isManager = currentUserData.role === 'management';

  let roleOptions = `<option value="member" ${m.role==='member'?'selected':''}>Member (طالب عادي)</option>`;
  if (isOwner || isManager) {
    roleOptions += `<option value="vice" ${m.role==='vice'?'selected':''}>Vice Manager (نائب المدير)</option>`;
    roleOptions += `<option value="management" ${m.role==='management'?'selected':''}>Manager (مدير)</option>`;
  }

  $('#modalContainer').innerHTML = `
    <div class="session-modal">
      <div class="session-modal-inner">
        <div class="session-modal-head">
          <h2 style="margin:0; font-size:24px;">Edit Member</h2>
          <button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button>
        </div>
        <div class="session-modal-body">
          <form id="editMemberForm">
            <div class="field"><label>Name</label><input name="name" value="${esc(m.name)}" required></div>
            <div class="field"><label>Email</label><input name="email" value="${esc(m.email)}" type="email" required></div>
            <div class="field"><label>Role</label>
              <select name="role">${roleOptions}</select>
            </div>
            <div class="field"><label>Grade</label>
              <select name="grade">
                <option value="10" ${m.grade==='10'?'selected':''}>Senior 29 (Grade 10)</option>
                <option value="11" ${m.grade==='11'?'selected':''}>Senior 28 (Grade 11)</option>
              </select>
            </div>
            <button class="primary full" type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  `;

  $('#editMemberForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await db.collection('users').doc(id).update({
      name: f.get('name'), email: f.get('email'), role: f.get('role'),
      grade: f.get('grade')
    });
    window.closeModal(); loadData();
  };
};

window.removeMember = async (id) => {
  if (!confirm('Are you sure you want to remove this member?')) return;
  await db.collection('users').doc(id).delete(); loadData();
};

window.openResourceBuilder = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal"><div class="session-modal-inner">
      <div class="session-modal-head"><h2 style="margin:0; font-size:24px;">New Resource</h2><button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button></div>
      <div class="session-modal-body">
        <form id="resourceForm">
          <div class="field"><label>Title *</label><input name="title" required></div>
          <div class="field"><label>Description</label><textarea name="description"></textarea></div>
          <div style="background:var(--surface2); padding:20px; border-radius:12px; margin-bottom:20px;">
            <p class="muted" style="margin-top:0; font-size:14px;">You can add a link, a file, or a video.</p>
            <div class="field"><label>1. External Link (URL)</label><input name="linkUrl" type="url" placeholder="https://..."></div>
            <div class="field"><label>2. Upload File (PDF/Image)</label><input name="fileUpload" type="file"></div>
            <div class="field" style="margin-bottom:0;"><label>3. Upload Video (MP4)</label><input name="videoUpload" type="file" accept="video/mp4"></div>
          </div>
          <button class="primary full" type="submit" id="resBtn">Publish Resource</button>
        </form>
      </div>
    </div></div>
  `;
  $('#resourceForm').onsubmit = async (e) => {
    e.preventDefault(); const f = new FormData(e.target); const btn = $('#resBtn');
    btn.textContent = 'Publishing...'; btn.disabled = true;
    try {
      let fileUrl = '', videoUrl = '';
      const linkUrl = f.get('linkUrl') || '';
      if (f.get('fileUpload').size > 0) { const fRef = storage.ref(`resources/${Date.now()}_${f.get('fileUpload').name}`); await fRef.put(f.get('fileUpload')); fileUrl = await fRef.getDownloadURL(); }
      if (f.get('videoUpload').size > 0) { const vRef = storage.ref(`resources/${Date.now()}_${f.get('videoUpload').name}`); await vRef.put(f.get('videoUpload')); videoUrl = await vRef.getDownloadURL(); }
      if(!linkUrl && !fileUrl && !videoUrl) throw new Error("Please provide at least one link or file.");
      await db.collection('resources').add({ title: f.get('title'), description: f.get('description'), linkUrl, fileUrl, videoUrl });
      window.closeModal(); loadData();
    } catch(err) { alert("Error: " + err.message); btn.textContent = 'Publish Resource'; btn.disabled = false; }
  };
};
window.deleteResource = async (id) => { if (!confirm('Delete this resource?')) return; await db.collection('resources').doc(id).delete(); loadData(); };

window.openGameBuilder = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal"><div class="session-modal-inner">
      <div class="session-modal-head"><h2 style="margin:0; font-size:24px;">Add Game</h2><button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button></div>
      <div class="session-modal-body">
        <form id="gameForm">
          <div class="field"><label>Game Title *</label><input name="title" required></div>
          <div class="field"><label>Description</label><textarea name="description"></textarea></div>
          <div class="field"><label>Game Link *</label><input name="url" type="url" required placeholder="https://..."></div>
          <button class="primary full" type="submit">Add Game</button>
        </form>
      </div>
    </div></div>
  `;
  $('#gameForm').onsubmit = async (e) => { e.preventDefault(); const f = new FormData(e.target); await db.collection('games').add({ title: f.get('title'), description: f.get('description'), url: f.get('url') }); window.closeModal(); loadData(); };
};
window.deleteGame = async (id) => { if (!confirm('Delete this game?')) return; await db.collection('games').doc(id).delete(); loadData(); };

window.openCertificateBuilder = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal"><div class="session-modal-inner">
      <div class="session-modal-head"><h2 style="margin:0; font-size:24px;">Add Certificate</h2><button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button></div>
      <div class="session-modal-body">
        <form id="certForm">
          <div class="field"><label>Certificate Title *</label><input name="title" required></div>
          <div class="field"><label>Description</label><textarea name="description"></textarea></div>
          <div class="field"><label>Upload Certificate (Image/PDF) *</label><input name="file" type="file" required></div>
          <button class="primary full" type="submit" id="certBtn">Publish Certificate</button>
        </form>
      </div>
    </div></div>
  `;
  $('#certForm').onsubmit = async (e) => {
    e.preventDefault(); const f = new FormData(e.target); const btn = $('#certBtn');
    btn.textContent = 'Uploading...'; btn.disabled = true;
    try {
      const cRef = storage.ref(`certificates/${Date.now()}_${f.get('file').name}`); await cRef.put(f.get('file')); const url = await cRef.getDownloadURL();
      await db.collection('certificates').add({ title: f.get('title'), description: f.get('description'), url: url });
      window.closeModal(); loadData();
    } catch(err) { alert(err.message); btn.textContent = 'Publish Certificate'; btn.disabled = false; }
  };
};
window.deleteCertificate = async (id) => { if (!confirm('Delete this certificate?')) return; await db.collection('certificates').doc(id).delete(); loadData(); };

window.openWarBuilder = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal"><div class="session-modal-inner">
      <div class="session-modal-head"><h2 style="margin:0; font-size:24px;">Add Challenge</h2><button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button></div>
      <div class="session-modal-body">
        <form id="warForm">
          <div class="field"><label>Challenge Title *</label><input name="title" required></div>
          <div class="field"><label>Description</label><textarea name="description"></textarea></div>
          <div class="field"><label>Challenge Link *</label><input name="url" type="url" required placeholder="https://..."></div>
          <button class="primary full" type="submit">Add Challenge</button>
        </form>
      </div>
    </div></div>
  `;
  $('#warForm').onsubmit = async (e) => { e.preventDefault(); const f = new FormData(e.target); await db.collection('challenges').add({ title: f.get('title'), description: f.get('description'), url: f.get('url') }); window.closeModal(); loadData(); };
};
window.deleteWar = async (id) => { if (!confirm('Delete this challenge?')) return; await db.collection('challenges').doc(id).delete(); loadData(); };

window.openSessionBuilder = () => {
  $('#modalContainer').innerHTML = `
    <div class="session-modal"><div class="session-modal-inner">
      <div class="session-modal-head"><div><h2 style="margin:0 0 5px; font-size:24px;">New Session</h2></div><button onclick="window.closeModal()" style="background:none;border:0;color:#fff;font-size:32px">×</button></div>
      <div class="session-modal-body">
        <form id="builderForm">
          <div class="field"><label>Session Title *</label><input name="title" required></div>
          <div class="field"><label>Theme</label><input name="theme"></div>
          <div class="field"><label>Description</label><textarea name="description"></textarea></div>
          <div class="field"><label>Duration</label><input name="duration"></div>
          <div class="field"><label>Video Lesson (MP4)</label><input type="file" name="videoFile" accept="video/mp4"></div>
          <div class="field"><label>Summary File (PDF)</label><input type="file" name="file" accept="application/pdf"></div>
          <div class="field"><label>Quiz URL</label><input name="quizUrl" type="url" placeholder="https://..."></div>
          <button class="primary full" type="submit" id="pubBtn">Publish Session</button>
        </form>
      </div>
    </div></div>
  `;
  $('#builderForm').onsubmit = async (e) => {
    e.preventDefault(); const f = new FormData(e.target); const btn = $('#pubBtn');
    btn.textContent = 'Publishing...'; btn.disabled = true;
    try {
      let videoUrl = '', fileUrl = '';
      if (f.get('videoFile').size > 0) { const vRef = storage.ref(`sessions/${Date.now()}_${f.get('videoFile').name}`); await vRef.put(f.get('videoFile')); videoUrl = await vRef.getDownloadURL(); }
      if (f.get('file').size > 0) { const fRef = storage.ref(`sessions/${Date.now()}_${f.get('file').name}`); await fRef.put(f.get('file')); fileUrl = await fRef.getDownloadURL(); }
      await db.collection('sessions').add({ title: f.get('title'), theme: f.get('theme'), description: f.get('description'), duration: f.get('duration'), videoUrl, fileUrl, quizUrl: f.get('quizUrl') });
      alert('Session published!'); window.closeModal(); loadData();
    } catch (err) { alert('Error: ' + err.message); btn.textContent = 'Publish Session'; btn.disabled = false; }
  };
};

window.closeModal = () => { $('#modalContainer').innerHTML = ''; };
window.deleteSession = async (id) => { if (!confirm('Are you sure you want to delete this session?')) return; await db.collection('sessions').doc(id).delete(); loadData(); };

window.uploadReflection = window.uploadReflectionModal = async (sessionId) => {
  const isModal = !!$(`#modal_ref_${sessionId}`);
  const fileInput = isModal ? $(`#modal_ref_${sessionId}`) : $(`#ref_${sessionId}`);
  const file = fileInput.files[0];
  if (!file) return alert('Please choose a video file first.');
  if (file.size > 50 * 1024 * 1024) return alert('File too large. Max 50MB.');
  try {
    const btn = fileInput.nextElementSibling; btn.textContent = 'Uploading...'; btn.disabled = true;
    const storageRef = storage.ref(`reflections/${currentUser.uid}/${sessionId}_${Date.now()}.mp4`);
    await storageRef.put(file);
    const newPoints = (currentUserData.points || 0) + 25;
    await db.collection('users').doc(currentUser.uid).update({ points: newPoints });
    currentUserData.points = newPoints;
    alert('Reflection video uploaded! +25 points added.');
    window.closeModal(); loadData();
  } catch (err) {
    alert('Error uploading video: ' + err.message);
    const btn = fileInput.nextElementSibling; btn.textContent = 'Upload Reflection'; btn.disabled = false;
  }
};

window.completeSession = async (id) => {
  if (!currentUserData.completed) currentUserData.completed = [];
  if (currentUserData.completed.includes(id)) return;
  currentUserData.completed.push(id);
  currentUserData.points = (currentUserData.points || 0) + 20;
  await db.collection('users').doc(currentUser.uid).update({ completed: currentUserData.completed, points: currentUserData.points });
  alert('Session completed! +20 points.'); loadData();
};

applyThemeAndLang();