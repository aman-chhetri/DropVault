import React from 'react';
import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-white p-2 rounded-md hover:bg-slate-700 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold">DropVault</span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <motion.div 
              className="hidden md:flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="text-sm font-medium truncate max-w-[150px]">
                {user.email || 'User'}
              </span>
            </motion.div>
            <button
              onClick={signOut}
              className="flex items-center space-x-1 py-1 px-3 text-sm rounded-md hover:bg-slate-700 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;