// Custom cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
(function animRing(){ rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12; cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px'; requestAnimationFrame(animRing); })();
document.querySelectorAll('a, button, .skill-category, .stat-card, .road-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width='20px'; cursor.style.height='20px'; cursorRing.style.width='52px'; cursorRing.style.height='52px'; cursorRing.style.borderColor='#ff6a9b'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='12px'; cursor.style.height='12px'; cursorRing.style.width='36px'; cursorRing.style.height='36px'; cursorRing.style.borderColor='var(--accent)'; });
});

// Nav scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });

// ── HAMBURGER MENU ──
function toggleDrawer() {
    const drawer = document.getElementById('navDrawer');
    const btn    = document.getElementById('hamburger');
    const isOpen = drawer.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeDrawer() {
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
}
// Close drawer on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));

// ── MESSAGE STORAGE (localStorage) ──
const STORAGE_KEY = 'bhoomika_portfolio_msgs';
function loadMessages() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveMessages(msgs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderInbox() {
    const msgs = loadMessages();
    document.getElementById('inboxCount').textContent = msgs.length;
    const container = document.getElementById('inboxMessages');
    if (msgs.length === 0) {
    container.innerHTML = '<div class="inbox-empty">No messages yet. Be the first to reach out!</div>';
    return;
    }
    container.innerHTML = msgs.slice().reverse().map(m => `
    <div class="inbox-msg">
        <div class="inbox-msg-meta">
        <div><span class="inbox-msg-name">${escHtml(m.name)}</span><span class="inbox-msg-email"> &lt;${escHtml(m.email)}&gt;</span></div>
        <span class="inbox-msg-time">${escHtml(m.time)}</span>
        </div>
        <div class="inbox-msg-body">${escHtml(m.message)}</div>
    </div>
    `).join('');
}

function toggleInbox() {
    document.getElementById('inboxPanel').classList.toggle('open');
    renderInbox();
}

// Inline 2-step clear (no confirm() dialog needed)
function askClear() {
    document.getElementById('clearBtn').style.display = 'none';
    document.getElementById('clearConfirm').classList.add('show');
}
function cancelClear() {
    document.getElementById('clearConfirm').classList.remove('show');
    document.getElementById('clearBtn').style.display = '';
}
function confirmClear() {
    saveMessages([]);
    renderInbox();
    cancelClear();
}

function handleSend(btn) {
    const name  = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const msg   = document.getElementById('formMsg').value.trim();
    if (!name || !email || !msg) {
    btn.textContent = '⚠ Fill all fields';
    btn.style.background = 'var(--accent2)';
    setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 2200);
    return;
    }
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
    const msgs = loadMessages();
    msgs.push({ name, email, message: msg, time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) });
    saveMessages(msgs);
    renderInbox();
    const panel = document.getElementById('inboxPanel');
    if (!panel.classList.contains('open')) panel.classList.add('open');
    document.getElementById('formName').value = '';
    document.getElementById('formEmail').value = '';
    document.getElementById('formMsg').value = '';
    btn.textContent = '✓ Message Received!';
    btn.style.background = 'var(--accent3)';
    btn.style.color = '#0a0a0f';
    btn.style.opacity = '1';
    setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.style.color = ''; }, 3000);
    }, 1000);
}

renderInbox();