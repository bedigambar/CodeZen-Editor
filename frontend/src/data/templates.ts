export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  html: string;
  css: string;
  js: string;
}

export const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'A minimalist developer landing page hero layout.',
    category: 'Page',
    html: `<div class="hero">
  <div class="tag">Alpha Release</div>
  <h1>Build at the edge</h1>
  <p>An editorial deployment platform designed for modern web applications. No config, instant cold starts, global scale.</p>
  <div class="actions">
    <button class="btn btn-primary">Start Building</button>
    <button class="btn btn-secondary">Read Docs</button>
  </div>
</div>

<div class="features">
  <div class="feature-card">
    <div class="num">01</div>
    <h3>Instant Cold Starts</h3>
    <p>Zero-latency container spin-ups ensure your API requests are served instantly.</p>
  </div>
  <div class="feature-card">
    <div class="num">02</div>
    <h3>Edge Middleware</h3>
    <p>Run lightweight routing and authentication logic closer to your users.</p>
  </div>
  <div class="feature-card">
    <div class="num">03</div>
    <h3>Secure by Default</h3>
    <p>Automatic SSL encryption, DDoS mitigation, and isolated sandboxing.</p>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #09090b;
  color: #f4f4f5;
  min-height: 100vh;
  padding: 40px 20px;
}

.hero {
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
}

.tag {
  display: inline-block;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  color: #e8ff47;
  border: 1px solid rgba(232, 255, 71, 0.2);
  background: rgba(232, 255, 71, 0.05);
  padding: 3px 8px;
  border-radius: 3px;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #fafafa;
  margin-bottom: 16px;
}

.hero p {
  font-size: 15px;
  color: #a1a1aa;
  line-height: 1.6;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  font-family: monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #e8ff47;
  color: #09090b;
  border: 1px solid #e8ff47;
}

.btn-primary:hover {
  background: transparent;
  color: #e8ff47;
}

.btn-secondary {
  background: transparent;
  color: #a1a1aa;
  border: 1px solid #27272a;
}

.btn-secondary:hover {
  color: #fafafa;
  border-color: #52525b;
}

.features {
  max-width: 900px;
  margin: 60px auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  border-top: 1px solid #27272a;
  padding-top: 40px;
}

.feature-card {
  background: #18181b;
  border: 1px solid #27272a;
  padding: 24px;
  border-radius: 4px;
  text-align: left;
  transition: border-color 0.15s ease;
}

.feature-card:hover {
  border-color: #e8ff47;
}

.feature-card .num {
  font-family: monospace;
  font-size: 11px;
  color: #71717a;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 13px;
  color: #a1a1aa;
  line-height: 1.5;
}`,
    js: `// Developer console logger
console.log('Developer landing page template initialized.');
console.info('Custom colors set to neon-yellow (#e8ff47) and dark slate (#18181b).');

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', (e) => {
    console.log('Action triggered:', e.target.textContent);
  });
});`
  },
  {
    id: 'card-component',
    name: 'Profile Card',
    description: 'A minimalist developer profile card with stats.',
    category: 'Component',
    html: `<div class="profile-card">
  <div class="header-band"></div>
  <div class="body-content">
    <div class="avatar-container">
      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" alt="Avatar" class="avatar">
    </div>
    
    <h2>Digambar</h2>
    <p class="role">Software Engineer</p>
    <p class="bio">Designing robust web architectures, scalable backend systems, and responsive user experiences. Focused on clean code and performance.</p>
    
    <div class="stats">
      <div class="stat-item">
        <span class="val">42</span>
        <span class="lbl">Projects</span>
      </div>
      <div class="stat-item">
        <span class="val">12.5k</span>
        <span class="lbl">Commits</span>
      </div>
    </div>
    
    <div class="links">
      <button class="link-btn">GitHub</button>
      <button class="link-btn">LinkedIn</button>
    </div>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0d0d;
  color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.profile-card {
  background: #111111;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.header-band {
  height: 60px;
  background: #18181b;
  border-bottom: 1px solid #2a2a2a;
}

.body-content {
  padding: 0 24px 24px;
  text-align: center;
  position: relative;
}

.avatar-container {
  margin-top: -36px;
  margin-bottom: 16px;
  display: inline-block;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid #2a2a2a;
  background: #18181b;
  display: block;
}

.body-content h2 {
  font-size: 18px;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 4px;
}

.role {
  font-family: monospace;
  font-size: 11px;
  color: #e8ff47;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.bio {
  font-size: 13px;
  color: #a1a1aa;
  line-height: 1.5;
  margin-bottom: 24px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 16px 0;
  border-top: 1px solid #1f1f1f;
  border-bottom: 1px solid #1f1f1f;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-item .val {
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  color: #fafafa;
}

.stat-item .lbl {
  font-size: 10px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.links {
  display: flex;
  gap: 8px;
}

.link-btn {
  flex: 1;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #8a8a8a;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.link-btn:hover {
  border-color: #e8ff47;
  color: #e8ff47;
  background: rgba(232, 255, 71, 0.02);
}`,
    js: `// Profile init log
console.log('Profile card component loaded.');

document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    console.info('Redirect action logged for platform:', e.target.textContent);
  });
});`
  },
  {
    id: 'navbar',
    name: 'Navigation Bar',
    description: 'A responsive, flat layout navigation bar.',
    category: 'Component',
    html: `<nav class="navbar">
  <div class="nav-brand">core_runtime</div>
  <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
  <ul class="nav-menu" id="navMenu">
    <li><a href="#dashboard" class="active">Dashboard</a></li>
    <li><a href="#deployments">Deployments</a></li>
    <li><a href="#settings">Settings</a></li>
    <li><a href="#logs">System Logs</a></li>
  </ul>
</nav>

<div class="viewport-content">
  <div class="dashboard-mock">
    <h2>System Status</h2>
    <p>Connected to edge cluster. Ready to receive bundle build requests.</p>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0d0d;
  color: #fafafa;
}

.navbar {
  background: #111111;
  border-bottom: 1px solid #1f1f1f;
  padding: 0 24px;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-brand {
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #e8ff47;
}

.nav-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}

.nav-toggle .bar {
  width: 18px;
  height: 1px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 16px;
  height: 100%;
}

.nav-menu li {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-menu li a {
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a8a8a;
  text-decoration: none;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.nav-menu li a:hover,
.nav-menu li a.active {
  color: #fafafa;
  border-color: #2a2a2a;
  background: #18181b;
}

.viewport-content {
  padding: 40px 24px;
  max-width: 600px;
  margin: 0 auto;
}

.dashboard-mock {
  background: #111111;
  border: 1px solid #1f1f1f;
  border-radius: 4px;
  padding: 24px;
}

.dashboard-mock h2 {
  font-size: 16px;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 8px;
}

.dashboard-mock p {
  font-size: 13px;
  color: #a1a1aa;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    display: none;
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    background: #111111;
    border-bottom: 1px solid #1f1f1f;
    flex-direction: column;
    height: auto;
    padding: 12px 24px;
    gap: 8px;
    z-index: 50;
  }

  .nav-menu.open {
    display: flex;
  }

  .nav-menu li {
    width: 100%;
  }

  .nav-menu li a {
    width: 100%;
    display: block;
    padding: 10px 12px;
  }
}`,
    js: `// Mobile navigation controller
console.log('Navigation systems listening.');

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  console.log('Mobile menu state:', navMenu.classList.contains('open') ? 'expanded' : 'collapsed');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    e.target.classList.add('active');
    console.info('Route updated context:', e.target.getAttribute('href'));
    navMenu.classList.remove('open');
  });
});`
  },
  {
    id: 'todo-list',
    name: 'Todo List',
    description: 'An interactive system todo tracker.',
    category: 'Application',
    html: `<div class="todo-app">
  <div class="app-header">
    <h2>Task Tracker</h2>
    <span id="counter" class="counter-badge">0 / 0</span>
  </div>
  
  <div class="input-group">
    <input type="text" id="todoInput" placeholder="Add custom backlog item..." aria-label="Task content">
    <button id="addBtn">Add</button>
  </div>
  
  <ul id="todoList" class="todo-list"></ul>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0d0d;
  color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.todo-app {
  background: #111111;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.app-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #fafafa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.counter-badge {
  font-family: monospace;
  font-size: 10px;
  color: #e8ff47;
  border: 1px solid rgba(232, 255, 71, 0.2);
  background: rgba(232, 255, 71, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

#todoInput {
  flex: 1;
  font-family: monospace;
  font-size: 12px;
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 3px;
  color: #fafafa;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.15s ease;
}

#todoInput:focus {
  border-color: #e8ff47;
}

#addBtn {
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  background: #e8ff47;
  color: #09090b;
  border: 1px solid #e8ff47;
  padding: 0 16px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
}

#addBtn:hover {
  background: transparent;
  color: #e8ff47;
}

.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.todo-item {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 3px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
}

.todo-item:hover {
  border-color: #3f3f46;
}

.todo-item span {
  font-family: monospace;
  font-size: 12px;
  color: #a1a1aa;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;
}

.todo-item.completed span {
  color: #3f3f46;
  text-decoration: line-through;
}

.delete-btn {
  font-family: monospace;
  font-size: 9px;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid #3a1a1a;
  color: #ff5555;
  padding: 2px 6px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.delete-btn:hover {
  background: #2a0a0a;
  border-color: #ff5555;
}`,
    js: `// Task tracker application controller
console.log('Todo application active.');

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const counter = document.getElementById('counter');

let todos = [
  { id: 1, text: 'refactor components', completed: false },
  { id: 2, text: 'compile static assets', completed: true },
  { id: 3, text: 'run edge unit tests', completed: false }
];

function updateList() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.addEventListener('click', () => toggleTodo(todo.id));
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'delete';
    delBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
  
  const completedCount = todos.filter(t => t.completed).length;
  counter.textContent = completedCount + ' / ' + todos.length;
}

function addTodo() {
  const val = todoInput.value.trim();
  if (!val) {
    console.warn('Blocked: Input cannot be empty.');
    return;
  }
  todos.push({ id: Date.now(), text: val, completed: false });
  console.log('Task added:', val);
  todoInput.value = '';
  updateList();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  const task = todos.find(t => t.id === id);
  console.log('Task updated:', task.text, '| completed:', task.completed);
  updateList();
}

function deleteTodo(id) {
  const task = todos.find(t => t.id === id);
  todos = todos.filter(t => t.id !== id);
  console.log('Task deleted:', task.text);
  updateList();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Initial mount
updateList();`
  },
  {
    id: 'animated-button',
    name: 'Interactive Buttons',
    description: 'Minimal CSS transitions for interactive button actions.',
    category: 'Component',
    html: `<div class="button-grid">
  <h2>Slide Fill</h2>
  <button class="btn btn-slide">Slide Right</button>

  <h2>Border Draw</h2>
  <button class="btn btn-draw">Draw Border</button>

  <h2>Active Accent</h2>
  <button class="btn btn-accent">Status Trigger</button>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0d0d;
  color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.button-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 24px 32px;
  background: #111111;
  border: 1px solid #2a2a2a;
  padding: 32px;
  border-radius: 4px;
}

h2 {
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: #71717a;
  letter-spacing: 0.05em;
}

.btn {
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  border-radius: 3px;
}

/* Slide Fill Button */
.btn-slide {
  border-color: #27272a;
  color: #fafafa;
  z-index: 1;
}

.btn-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #fafafa;
  transition: left 0.2s ease-out;
  z-index: -1;
}

.btn-slide:hover {
  color: #09090b;
  border-color: #fafafa;
}

.btn-slide:hover::before {
  left: 0;
}

/* Border Draw Button */
.btn-draw {
  border-color: #27272a;
  color: #8a8a8a;
}

.btn-draw:hover {
  border-color: #fafafa;
  color: #fafafa;
  box-shadow: inset 0 0 0 1px #fafafa;
}

/* Status Trigger Button */
.btn-accent {
  border: 1px solid rgba(232, 255, 71, 0.2);
  background: rgba(232, 255, 71, 0.02);
  color: #e8ff47;
}

.btn-accent:hover {
  background: #e8ff47;
  color: #09090b;
}

.btn:active {
  transform: scale(0.97);
}`,
    js: `// Button action listeners
console.log('Button interactive engine listening.');

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    console.info('Click event captured:', e.target.className);
  });
});`
  },
  {
    id: 'console-showcase',
    name: 'Console Showcase',
    description: 'An interactive demo showcasing structured logging, error highlights, and the execution timeline.',
    category: 'Demo',
    html: `<div class="demo-container">
  <div class="demo-header">
    <h1>Exceptional Console Showcase</h1>
    <p>Use the buttons below to test structured object logging, runtime error highlighting, and the execution timeline.</p>
  </div>

  <div class="demo-actions">
    <button class="btn btn-action" id="logObject">Log Complex Object</button>
    <button class="btn btn-action" id="logTimeline">Run Timeline Logs (Delays)</button>
    <button class="btn btn-action btn-danger" id="triggerError">Trigger Runtime Error</button>
  </div>

  <div class="tips-box">
    <h3>💡 What to look for:</h3>
    <ul>
      <li><strong>Structured Objects:</strong> Click "▶" to expand nested levels (Dracula theme styled tree).</li>
      <li><strong>Execution Timeline:</strong> Look at the right side of the log rows. You will see colored bars corresponding to when the logs occurred relative to startup.</li>
      <li><strong>Error Highlights:</strong> Triggering the error will highlight the exact line in the JS editor in translucent red! Start typing in the JS editor to clear the highlight automatically.</li>
    </ul>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0b0b0c;
  color: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
}

.demo-container {
  background: #111112;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.demo-header {
  margin-bottom: 24px;
  text-align: center;
}

.demo-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
}

.demo-header p {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
}

.demo-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.btn {
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
  text-align: center;
}

.btn-action {
  background: transparent;
  border: 1px solid #3f3f46;
  color: #e2e8f0;
}

.btn-action:hover {
  border-color: #e8ff47;
  color: #e8ff47;
  background: rgba(232, 255, 71, 0.03);
}

.btn-danger {
  border: 1px solid #ef4444;
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.05);
}

.btn-danger:hover {
  background: #ef4444;
  color: #09090b;
}

.tips-box {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 4px;
  padding: 16px;
}

.tips-box h3 {
  font-size: 12px;
  color: #fafafa;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tips-box ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tips-box li {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.4;
}

.tips-box strong {
  color: #f8fafc;
}`,
    js: `// Exceptional Console Showcase Controller
console.log("Console demo template loaded.");
console.info("Try logging objects and testing the timeline below.");

// 1. Log Structured Object
document.getElementById('logObject').addEventListener('click', () => {
  const complexData = {
    userId: 1042,
    username: "dev_zen",
    profile: {
      firstName: "Alice",
      lastName: "Smith",
      role: "Lead Engineer",
      skills: ["React", "TypeScript", "CodeMirror"],
    },
    activeSession: true,
    stats: {
      uptime: 99.98,
      lastBuild: new Date().toLocaleTimeString(),
    },
    logDetails: function getSummary() { return "Profile snapshot"; }
  };
  
  console.log("Structured Log Data:", complexData);
});

// 2. Timeline Delays
document.getElementById('logTimeline').addEventListener('click', () => {
  console.warn("Timeline log sequence initiated...");
  
  setTimeout(() => {
    console.log("Log fired +150ms after sequence start");
  }, 150);

  setTimeout(() => {
    console.info("Log fired +400ms with system info details");
  }, 400);

  setTimeout(() => {
    console.log("Log fired +750ms finishing the timeline sequence");
  }, 750);
});

// 3. Trigger Error
document.getElementById('triggerError').addEventListener('click', () => {
  console.warn("Triggering runtime error on the next line...");
  // This will intentionally throw a runtime ReferenceError
  nonExistentFunction();
});`
  },
  {
id: 'letter-curtain',
name: 'Letter Curtain',
description: 'A camera-reactive curtain of letters with hand tracking and a mouse/touch fallback.',
category: 'Interactive',
html: `<video id="vid" playsinline autoplay muted></video>
<canvas id="c"></canvas>
<div id="status">starting camera...</div>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js" crossorigin="anonymous"></script>`,
css: `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  font-family: "Courier New", monospace;
}

video {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transform: scaleX(-1);
  z-index: 0;
  pointer-events: none;
  background: #000;
}

canvas#c {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  cursor: none;
  z-index: 2;
}

#status {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: rgba(255,255,255,0.45);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  pointer-events: none;
}

#status.active {
  color: rgba(255,255,255,0.82);
}`,
js: `const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const video = document.getElementById('vid');
const statusEl = document.getElementById('status');
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:{}()=+-*/&%$#@!?';
const strands = [];
const sparkles = [];
const maxDpr = 1.35;
const spacing = 42;
let width = 0;
let height = 0;
let dpr = 1;
let pointer = null;
let previousPointer = null;
let handsInstance = null;
let sendingFrame = false;
let lastHandsFrame = 0;
let frame = 0;

function randomChar() {
  return pool[Math.floor(Math.random() * pool.length)];
}

function point(x, y, pinned) {
  return { x, y, oldX: x, oldY: y, baseX: x, baseY: y, pinned, wakeX: 0, rotation: 0, char: randomChar() };
}

function init() {
  dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  strands.length = 0;
  const count = Math.floor(width / spacing);
  const start = (width - count * spacing) / 2 + spacing / 2;
  for (let column = 0; column <= count; column += 1) {
const x = start + column * spacing + (Math.random() * 8 - 4);
const length = 9 + Math.floor(Math.random() * 5);
const points = [];
for (let i = 0; i <= length; i += 1) {
  points.push(point(x + (Math.random() * 3 - 1.5) * Math.min(i, 3), i * 42, i === 0));
}
strands.push({ points, phase: Math.random() * Math.PI * 2 });
  }
}

function influencers() {
  const active = [];
  if (pointer) active.push({ x: pointer.x, y: pointer.y, vx: pointer.x - (previousPointer ? previousPointer.x : pointer.x), vy: pointer.y - (previousPointer ? previousPointer.y : pointer.y) });
  return active;
}

function simulate() {
  const active = influencers();
  const time = performance.now() * 0.001;
  strands.forEach(strand => {
const points = strand.points;
points.forEach((p, i) => {
  if (p.pinned) {
    p.x = p.baseX;
    p.y = p.baseY;
    p.oldX = p.x;
    p.oldY = p.y;
    return;
  }
  const depth = i / (points.length - 1);
  const vx = (p.x - p.oldX) * 0.912;
  const vy = Math.max((p.y - p.oldY) * 0.912, -2.15 * (1 - depth * 0.34));
  p.oldX = p.x;
  p.oldY = p.y;
  p.x += vx + Math.sin(time + strand.phase + i * 0.37) * 0.003 * depth * depth;
  p.y += vy + 0.125 + 0.115 * depth * depth;
  p.x += (p.baseX - p.x) * 0.026 * (1 - depth * 0.62);
  p.x += p.wakeX * (0.35 + depth * 0.75);
  p.wakeX *= 0.915;
  active.forEach(inf => {
    const dx = p.x - inf.x;
    const dy = p.y - inf.y;
    const falloff = Math.max(0, 1 - Math.hypot(dx / 126, dy / 66));
    if (falloff > 0) {
      p.x += inf.vx * falloff * 0.43;
      p.wakeX = Math.max(-10.5, Math.min(10.5, p.wakeX + inf.vx * falloff * 0.085));
    }
  });
  p.x = Math.max(-80, Math.min(width + 80, p.x));
  p.y = Math.min(height + 140, p.y);
});
for (let pass = 0; pass < 3; pass += 1) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy) || 0.001;
    const correction = (distance - 42) / distance;
    const stiffness = 0.82 + (0.46 - 0.82) * (i / (points.length - 2));
    if (!a.pinned) { a.x += dx * correction * stiffness * 0.5; a.y += dy * correction * stiffness * 0.5; }
    if (!b.pinned) { b.x -= dx * correction * stiffness * 0.5; b.y -= dy * correction * stiffness * 0.5; }
  }
}
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.font = '800 16px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  strands.forEach(strand => {
const points = strand.points;
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
ctx.strokeStyle = 'rgba(255,255,255,0.5)';
ctx.lineWidth = 1.7;
ctx.stroke();
points.forEach((p, i) => {
  const previous = points[Math.max(0, i - 1)];
  const next = points[Math.min(points.length - 1, i + 1)];
  p.rotation += (Math.atan2(next.y - previous.y, next.x - previous.x) - Math.PI / 2 - p.rotation) * 0.08;
  if ((frame + i + Math.floor(p.baseX)) % 2 === 0 && Math.random() < 0.055) p.char = randomChar();
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(p.char, 0, 0);
  ctx.restore();
});
  });
}

function loop() {
  simulate();
  draw();
  frame += 1;
  previousPointer = pointer ? { ...pointer } : null;
  requestAnimationFrame(loop);
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
statusEl.textContent = 'move your mouse or finger';
return;
  }
  try {
const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }, audio: false });
video.srcObject = stream;
statusEl.textContent = 'camera ready - move your hand';
statusEl.classList.add('active');
if (typeof Hands !== 'undefined') {
  handsInstance = new Hands({ locateFile: file => 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/' + file });
  handsInstance.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
  handsInstance.onResults(results => {
    const landmarks = results.multiHandLandmarks || [];
    if (landmarks[0] && landmarks[0][8]) {
      const tip = landmarks[0][8];
      pointer = { x: (1 - tip.x) * width, y: tip.y * height };
      statusEl.textContent = 'tracking ' + landmarks.length + ' hand' + (landmarks.length > 1 ? 's' : '');
    }
  });
  const process = async now => {
    if (!sendingFrame && now - lastHandsFrame > 55 && video.readyState >= 2) {
      sendingFrame = true;
      lastHandsFrame = now;
      try { await handsInstance.send({ image: video }); } finally { sendingFrame = false; }
    }
    requestAnimationFrame(process);
  };
  requestAnimationFrame(process);
}
  } catch (error) {
statusEl.textContent = 'camera unavailable - use your mouse';
  }
}

canvas.addEventListener('mousemove', event => { pointer = { x: event.clientX, y: event.clientY }; });
canvas.addEventListener('mouseleave', () => { pointer = null; });
canvas.addEventListener('touchmove', event => {
  const touch = event.touches[0];
  if (touch) pointer = { x: touch.clientX, y: touch.clientY };
}, { passive: true });
canvas.addEventListener('touchend', () => { pointer = null; });
window.addEventListener('resize', init);
init();
startCamera();
loop();`
  }
];
