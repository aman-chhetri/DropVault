import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Toaster position="top-right" />
      
      <div className="flex flex-1 overflow-hidden">
        {user && (
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        )}
        
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          onClick={() => window.innerWidth < 768 && sidebarOpen && closeSidebar()}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;