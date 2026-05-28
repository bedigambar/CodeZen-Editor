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
  }
];
