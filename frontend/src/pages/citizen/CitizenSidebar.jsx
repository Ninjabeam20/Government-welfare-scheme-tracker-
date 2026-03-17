import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CitizenSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <style>{`
        .sidebar { width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #2563eb; color: #ffffff; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }
      `}</style>
      <aside className="sidebar">
        <div className="logo">WelfarePortal.</div>
        <nav>
          <div className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
            <span>🏠</span> Dashboard
          </div>
          <div className={`nav-link ${isActive('/citizen/schemes') ? 'active' : ''}`} onClick={() => navigate('/citizen/schemes')}>
            <span>📄</span> Apply for Schemes
          </div>
          <div className={`nav-link ${isActive('/citizen/track') ? 'active' : ''}`} onClick={() => navigate('/citizen/track')}>
            <span>📊</span> Track Status
          </div>
          <div className={`nav-link ${isActive('/citizen/documents') ? 'active' : ''}`} onClick={() => navigate('/citizen/documents')}>
            <span>📁</span> My Documents
          </div>
          <div className={`nav-link ${isActive('/citizen/grievance') ? 'active' : ''}`} onClick={() => navigate('/citizen/grievance')}>
            <span>🎧</span> Grievance Support
          </div>
        </nav>
      </aside>
    </>
  );
};

export default CitizenSidebar;
