import React from 'react';
import { Shield, Upload, FolderOpen, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Shield className="h-10 w-10 text-emerald-500" />,
      title: 'Secure Storage',
      description: 'Your files are encrypted and securely stored in the cloud.',
    },
    {
      icon: <Upload className="h-10 w-10 text-emerald-500" />,
      title: 'Easy Uploads',
      description: 'Simply drag and drop your files to upload them to Vaultify.',
    },
    {
      icon: <FolderOpen className="h-10 w-10 text-emerald-500" />,
      title: 'File Management',
      description: 'Organize, view, and manage all your files in one place.',
    },
    {
      icon: <Lock className="h-10 w-10 text-emerald-500" />,
      title: 'Private Access',
      description: 'Only you can access your files. Your privacy is our priority.',
    },
  ];

  return (
    <div>
      {!user ? (
        <motion.div 
          className="max-w-5xl mx-auto py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Secure Your Files with{' '}
              <span className="text-emerald-600">Vaultify</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The safest way to store, access, and manage your personal files online.
              Simple, secure, and reliable file storage.
            </motion.p>
            <motion.div 
              className="mt-10 flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/signup"
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md shadow hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-md shadow border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-slate-800 text-white rounded-2xl p-10 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to secure your files?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Vaultify with their important documents, 
              photos, and files. Start your secure storage journey today.
            </p>
            <Link
              to="/signup"
              className="px-8 py-3 bg-emerald-500 text-white font-medium rounded-md shadow-md hover:bg-emerald-600 transition-colors inline-block"
            >
              Create Free Account
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="max-w-4xl mx-auto py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
            <p className="opacity-90 mb-6">
              Your secure personal storage is ready for you. What would you like to do today?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="px-4 py-2 bg-white text-emerald-700 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                Upload Files
              </Link>
              <Link
                to="/files"
                className="px-4 py-2 bg-emerald-700 bg-opacity-30 text-white rounded-md font-medium hover:bg-opacity-40 transition-colors border border-white border-opacity-20"
              >
                View My Files
              </Link>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            >
              <Upload className="h-8 w-8 text-emerald-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload New Files</h2>
              <p className="text-gray-600 mb-4">
                Securely upload and store your important documents, images, and files.
              </p>
              <Link
                to="/upload"
                className="text-emerald-600 font-medium hover:text-emerald-700 inline-flex items-center"
              >
                Upload now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            >
              <FolderOpen className="h-8 w-8 text-emerald-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Your Files</h2>
              <p className="text-gray-600 mb-4">
                View, download, or delete your existing files from your secure storage.
              </p>
              <Link
                to="/files"
                className="text-emerald-600 font-medium hover:text-emerald-700 inline-flex items-center"
              >
                View files
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;