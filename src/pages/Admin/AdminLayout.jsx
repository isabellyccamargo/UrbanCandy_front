import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../componentes/Sidebar/AdminSidebar'; 
import { AdminHeader } from '../../componentes/AdminHeader/AdminHeader';  
import './AdminLayout.css'

export const AdminLayout = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <AdminHeader title="Painel Administrativo" />
        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};