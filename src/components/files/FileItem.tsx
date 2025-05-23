import React, { useState } from 'react';
import { 
  File, 
  Download, 
  Trash, 
  Image, 
  FileText, 
  FileSpreadsheet, 
  Film,
  File as FileIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { STORAGE_BUCKET } from '../../lib/supabase';
import { FileItem as FileItemType } from '../../types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FileItemProps {
  file: FileItemType;
  onDelete: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Determine file icon based on type
  const getFileIcon = () => {
    const type = file.type.toLowerCase();
    
    if (type.includes('image')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    } else if (type.includes('video')) {
      return <Film className="h-8 w-8 text-purple-500" />;
    } else {
      return <FileIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      if (file.url) {
        // If we already have a URL, use it directly
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Otherwise, get a new download URL
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .download(file.id);

        if (error) {
          throw error;
        }

        // Create a download link
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([file.id]);

      if (error) {
        throw error;
      }
      
      onDelete(file.id);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  // Card variants for animation
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    hover: { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow overflow-hidden border border-gray-100"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {file.thumbnailUrl ? (
            <img 
              src={file.thumbnailUrl} 
              alt={file.name} 
              className="h-12 w-12 object-cover rounded"
            />
          ) : (
            getFileIcon()
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
            <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`text-sm flex items-center space-x-1 transition-colors ${
            confirmDelete 
              ? 'text-red-600 hover:text-red-800 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          } disabled:opacity-50`}
        >
          <Trash size={16} />
          <span>{confirmDelete ? 'Confirm' : 'Delete'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default FileItem;