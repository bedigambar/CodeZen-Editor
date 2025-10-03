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
    description: 'A modern landing page with hero section',
    category: 'Page',
    html: `<div class="hero">
  <h1>Welcome to Our Product</h1>
  <p>Build amazing things with our platform</p>
  <button class="cta-button">Get Started</button>
</div>

<div class="features">
  <div class="feature-card">
    <h3>⚡ Fast</h3>
    <p>Lightning-fast performance</p>
  </div>
  <div class="feature-card">
    <h3>🎨 Beautiful</h3>
    <p>Stunning design out of the box</p>
  </div>
  <div class="feature-card">
    <h3>🔒 Secure</h3>
    <p>Enterprise-grade security</p>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 100px 20px;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  animation: fadeInUp 0.8s ease;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 30px;
  opacity: 0.9;
  animation: fadeInUp 1s ease;
}

.cta-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 1.2s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 50px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card h3 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #667eea;
}

.feature-card p {
  color: #666;
  font-size: 1rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    js: `// Console Output Demo
console.log('Landing page loaded successfully! 🚀');
console.info('Check out the console to see logs!');

document.querySelector('.cta-button').addEventListener('click', function() {
  console.log('CTA button clicked!');
  alert('Welcome aboard! 🚀');
});`
  },
  {
    id: 'card-component',
    name: 'Profile Card',
    description: 'A beautiful profile card component',
    category: 'Component',
    html: `<div class="card">
  <div class="card-header">
    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" class="profile-img">
  </div>
  <div class="card-body">
    <h2>Digambar</h2>
    <p class="title">Full Stack Developer</p>
    <p class="description">Passionate about creating beautiful and functional web experiences.</p>
    <div class="social-links">
      <button class="social-btn">Twitter</button>
      <button class="social-btn">LinkedIn</button>
      <button class="social-btn">GitHub</button>
    </div>
  </div>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  max-width: 400px;
  width: 100%;
  animation: slideUp 0.5s ease;
}

.card-header {
  background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
  padding: 40px;
  text-align: center;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.card-body {
  padding: 30px;
  text-align: center;
}

.card-body h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.title {
  color: #6B73FF;
  font-weight: 600;
  margin-bottom: 15px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
}

.social-links {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.social-btn {
  background: #6B73FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.social-btn:hover {
  background: #000DFF;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    js: `// Console Output Demo
console.log('Profile card initialized! 👤');
console.info('Click the social buttons to see console logs');

const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Social button clicked:', button.textContent);
    alert('Opening ' + button.textContent + '...');
  });
});`
  },
  {
    id: 'navbar',
    name: 'Navigation Bar',
    description: 'A responsive navigation bar',
    category: 'Component',
    html: `<nav class="navbar">
  <div class="nav-brand">MyBrand</div>
  <button class="nav-toggle" id="navToggle">☰</button>
  <ul class="nav-menu" id="navMenu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<div class="content">
  <h1>Welcome to My Website</h1>
  <p>This is a responsive navigation bar example.</p>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.nav-menu li a:hover {
  opacity: 0.7;
}

.content {
  padding: 50px;
  text-align: center;
}

.content h1 {
  color: #333;
  margin-bottom: 20px;
}

.content p {
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 1rem 2rem;
    gap: 1rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-menu.active {
    max-height: 300px;
  }
}`,
    js: `// Console Output Demo
console.log('Navigation bar loaded! 🧭');
console.info('Try toggling the menu on mobile view');

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  console.log('Menu toggled:', navMenu.classList.contains('active') ? 'open' : 'closed');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    console.log('Navigation link clicked:', e.target.textContent);
    navMenu.classList.remove('active');
  });
});`
  },
  {
    id: 'todo-list',
    name: 'Todo List',
    description: 'An interactive todo list application',
    category: 'Application',
    html: `<div class="container">
  <h1>📝 My Todo List</h1>
  <div class="input-section">
    <input type="text" id="todoInput" placeholder="Add a new task...">
    <button id="addBtn">Add</button>
  </div>
  <ul id="todoList"></ul>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 100%;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#todoInput {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

#todoInput:focus {
  border-color: #84fab0;
}

#addBtn {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

#addBtn:hover {
  transform: translateY(-2px);
}

#todoList {
  list-style: none;
}

.todo-item {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.todo-item:hover {
  background: #e9ecef;
}

.todo-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-btn:hover {
  background: #ff5252;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`,
    js: `// Console Output Demo
console.log('Todo List App initialized! ✅');
console.info('Add, complete, or delete tasks to see console logs');

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
let todoCount = 0;

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    console.warn('Cannot add empty todo!');
    return;
  }

  todoCount++;
  console.log('Todo added:', text, '| Total todos:', todoCount);

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = \`
    <span>\${text}</span>
    <button class="delete-btn">Delete</button>
  \`;

  li.querySelector('span').addEventListener('click', function() {
    li.classList.toggle('completed');
    console.log('Todo toggled:', text, '| Completed:', li.classList.contains('completed'));
  });

  li.querySelector('.delete-btn').addEventListener('click', function() {
    todoCount--;
    console.log('Todo deleted:', text, '| Remaining:', todoCount);
    li.remove();
  });

  todoList.appendChild(li);
  todoInput.value = '';
}

// Add some demo tasks
['Learn JavaScript', 'Build a project', 'Master CSS'].forEach(task => {
  todoInput.value = task;
  addTodo();
});
todoInput.value = '';`
  },
  {
    id: 'animated-button',
    name: 'Animated Button',
    description: 'A collection of animated button styles',
    category: 'Component',
    html: `<div class="button-container">
  <h1>Animated Buttons</h1>
  
  <button class="btn btn-1">Hover Me</button>
  <button class="btn btn-2">Click Me</button>
  <button class="btn btn-3">Press Me</button>
  <button class="btn btn-4">Try Me</button>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.button-container {
  text-align: center;
}

h1 {
  color: white;
  margin-bottom: 50px;
  font-size: 3rem;
}

.btn {
  margin: 15px;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-1 {
  background: white;
  color: #667eea;
}

.btn-1:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.btn-2 {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
}

.btn-2:hover {
  background: linear-gradient(45deg, #feca57, #ff6b6b);
  transform: scale(1.1);
}

.btn-3 {
  background: #48dbfb;
  color: white;
  border: 3px solid white;
}

.btn-3:hover {
  background: white;
  color: #48dbfb;
  border: 3px solid #48dbfb;
}

.btn-4 {
  background: #f368e0;
  color: white;
}

.btn-4:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.3);
  transition: left 0.5s ease;
}

.btn-4:hover:before {
  left: 100%;
}

.btn:active {
  transform: scale(0.95);
}`,
    js: `// Console Output Demo
console.log('Animated Buttons loaded! 🎨');
console.info('Click any button to see animation logs');

const buttons = document.querySelectorAll('.btn');

buttons.forEach((button, index) => {
  button.addEventListener('click', function() {
    console.log('Button clicked:', this.textContent, '| Button index:', index + 1);
    this.style.animation = 'bounce 0.5s ease';
    setTimeout(() => {
      this.style.animation = '';
      console.log('Animation completed for:', this.textContent);
    }, 500);
  });
});

// Add bounce animation
const style = document.createElement('style');
style.textContent = \`
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
\`;
document.head.appendChild(style);
console.log('Bounce animation style injected ✨');`
  }
];
