import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <aside className="sidebar">
      <div className="logo">AdminPortal.</div>
      <nav>
        <div className={isActive('/admin')} onClick={() => navigate('/admin')}>
          <span style={{ marginRight: '10px' }}>✨</span> Dashboard Overview
        </div>
        <div className={isActive('/admin/schemes')} onClick={() => navigate('/admin/schemes')}>
          <span style={{ marginRight: '10px' }}>🗂️</span> Manage Schemes
        </div>
        <div className={isActive('/admin/officers')} onClick={() => navigate('/admin/officers')}>
          <span style={{ marginRight: '10px' }}>👮‍♂️</span> Manage Officers
        </div>
        <div className={isActive('/admin/audits')} onClick={() => navigate('/admin/audits')}>
          <span style={{ marginRight: '10px' }}>🛡️</span> System Audit Logs
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
