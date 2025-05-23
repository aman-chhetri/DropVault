import React from 'react';
import { FolderOpen, Upload, Settings, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/files', icon: <FolderOpen size={20} />, label: 'My Files' },
    { path: '/upload', icon: <Upload size={20} />, label: 'Upload' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  // Close sidebar on mobile when clicking outside on medium and larger screens
  const handleContentClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768 && isOpen) {
      closeSidebar();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 text-white pt-16 shadow-xl md:pt-16 md:sticky md:top-0 md:z-0"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              onClick={handleContentClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;