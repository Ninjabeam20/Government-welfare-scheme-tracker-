import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <aside style={{
      width: '260px', minWidth: '260px', background: '#ffffff',
      margin: '20px', borderRadius: '24px', padding: '30px 20px',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <style>{`
        .nav-link { padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; transition: all 0.3s ease; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; font-size: 15px; }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { background: #4f46e5; color: #ffffff; box-shadow: 0 8px 20px rgba(79,70,229,0.25); }
      `}</style>
      <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '40px', paddingLeft: '10px', letterSpacing: '-0.5px' }}>
        AdminPortal.
      </div>
      <nav>
        <div className={isActive('/admin/dashboard')} onClick={() => navigate('/admin/dashboard')}>
          <span style={{ marginRight: '10px' }}>✨</span> Dashboard Overview
        </div>
        <div className={isActive('/admin/schemes')} onClick={() => navigate('/admin/schemes')}>
          <span style={{ marginRight: '10px' }}>🗂️</span> Manage Schemes
        </div>
        <div className={isActive('/admin/officers')} onClick={() => navigate('/admin/officers')}>
          <span style={{ marginRight: '10px' }}>👮‍♂️</span> Manage Officers
        </div>
        <div className={isActive('/admin/audit')} onClick={() => navigate('/admin/audit')}>
          <span style={{ marginRight: '10px' }}>🛡️</span> System Audit Logs
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;