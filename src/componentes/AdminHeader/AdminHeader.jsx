import React from 'react';
import './AdminHeader.css';

export const AdminHeader = ({ title }) => {

  return (
    <header className="admin-top-header">
      <div className="header-info">
        <span>UrbanCandy</span>
        <h1 className="page-title">{title}</h1>
      </div>
    </header>
  );
};