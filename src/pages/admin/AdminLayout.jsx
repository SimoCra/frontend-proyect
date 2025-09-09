import React from 'react';
import AdminPanel from './AdminPanel';
import { Outlet } from 'react-router-dom';
import '../../styles/admin_css/AdminPanel.css';

const AdminLayout = () => {
  return (
    <div className="admin-panel-container">
      <AdminPanel />  
      <main className="admin-main">
        <Outlet />     
      </main>
    </div>
  );
};

export default AdminLayout;
