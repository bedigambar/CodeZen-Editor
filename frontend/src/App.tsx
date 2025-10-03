import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Home from './components/Home';
import CodeEditor from './components/CodeEditor';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/code" element={<CodeEditor />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
