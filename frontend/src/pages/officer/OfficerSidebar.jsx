import React from 'react';
import { useLocation } from 'react-router-dom';

const OfficerSidebar = ({ activeView, setActiveView }) => {
  // We use activeView from props if the parent is managing state, 
  // or we can use it to distinguish the current active item.
  
  return (
    <>
      <style>{`
        .sidebar { 
          width: 280px; background: #ffffff; margin: 20px; border-radius: 24px; 
          padding: 30px 20px; display: flex; flex-direction: column; 
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06); 
        }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; padding-left: 10px; letter-spacing: -0.5px; }
        .nav-link { 
          padding: 14px 20px; color: #64748b; font-weight: 600; border-radius: 16px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px;
        }
        .nav-link:hover { background: #f8fafc; color: #0f172a; transform: translateX(6px); }
        .nav-link.active { 
          background: #10b981; color: #ffffff; 
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); 
        }
      `}</style>
      <aside className="sidebar">
        <div className="logo">OfficerPortal.</div>
        <nav>
          <div 
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span>📊</span> Dashboard Overview
          </div>
          <div 
            className={`nav-link ${activeView === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveView('queue')}
          >
            <span>📋</span> Verification Queue
          </div>
        </nav>
      </aside>
    </>
  );
};

export default OfficerSidebar;
