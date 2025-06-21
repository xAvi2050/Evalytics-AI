// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CodeIDE from './pages/CodeIDE';
import Tests from './user/Tests/Tests';
import Exams from './user/Exams/Exams';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard/:username" element={<Dashboard />} />
      <Route path="/ide" element={<CodeIDE />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
