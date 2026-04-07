import React from 'react';
import './AdminHeader.css';

export const AdminHeader = ({ title }) => {
  const user = JSON.parse(localStorage.getItem('@UrbanCandy:user'));

  return (
    <header className="admin-top-header">
      <div className="header-info">
        <span>UrbanCandy</span>
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="header-user">
        <p>Olá, <strong>{user?.name || 'Administrador'}</strong></p>
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
};