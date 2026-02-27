import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';

function App() {
  return (
    <Router>
      {/* GLOBAL CSS RESET */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        html, body, #root { width: 100vw; height: 100vh; overflow-x: hidden; background-color: #f1f5f9; }
      `}</style>
      
      <Routes>
        {/* Main routing system for easy testing */}
        <Route path="/" element={<CitizenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        
        {/* On hold for later */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;