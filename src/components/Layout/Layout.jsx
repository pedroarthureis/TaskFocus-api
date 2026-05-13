import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar on desktop automatically, but handle mobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className={styles.mainContent}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.mainArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
