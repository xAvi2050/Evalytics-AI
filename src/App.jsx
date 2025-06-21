
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CodeIDE from './pages/CodeIDE';
import Tests from './user/Tests/Tests';
import Exams from './user/Exams/Exams.jsx';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <Routes> {/* It is a wrapper component */}
      <Route path="/" element={<Home />} />   {/* It  is used to define one specific path and what component to show when the URL matches */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard/:username" element={<Dashboard />} />
      <Route path="/ide" element={<CodeIDE />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}

export default App;
