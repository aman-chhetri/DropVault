import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { STORAGE_BUCKET } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import FileItem from './FileItem';
import { FileItem as FileItemType } from '../../types';
import { Loader, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FileList: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // List all files in the user's folder
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(user.id, {
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) {
          throw error;
        }

        if (!data) {
          setFiles([]);
          return;
        }

        // Process file data
        const processedFiles = await Promise.all(
          data.map(async (item) => {
            const filePath = `${user.id}/${item.name}`;
            
            // Generate public URL for the file
            const { data: publicUrlData } = await supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(filePath);
            
            const url = publicUrlData.publicUrl;
            
            // For image files, create thumbnail URL
            let thumbnailUrl = undefined;
            if (
              item.metadata &&
              item.metadata.mimetype &&
              item.metadata.mimetype.startsWith('image/')
            ) {
              const { data: thumbnailData } = await supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath, {
                  transform: {
                    width: 100,
                    height: 100,
                    resize: 'cover',
                  },
                });
              thumbnailUrl = thumbnailData.publicUrl;
            }
            
            // Extract original filename from path
            const originalName = item.name.split('_').slice(1).join('_');
            
            return {
              id: filePath,
              name: originalName || item.name,
              type: item.metadata?.mimetype || 'application/octet-stream',
              size: item.metadata?.size || 0,
              created_at: item.created_at,
              url,
              thumbnailUrl,
            };
          })
        );

        setFiles(processedFiles);
      } catch (err: any) {
        console.error('Error fetching files:', err);
        setError(err.message || 'Failed to fetch files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    // Listen for storage changes
    const storageSubscription = supabase
      .channel('storage-changes')
      .on('postgres_changes', { event: '*', schema: 'storage' }, (payload) => {
        // Refresh file list when storage changes
        fetchFiles();
      })
      .subscribe();

    return () => {
      storageSubscription.unsubscribe();
    };
  }, [user]);

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading your files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading files: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
          <p className="text-gray-600">
            {files.length === 0
              ? 'You have no files yet.'
              : `You have ${files.length} file${files.length === 1 ? '' : 's'}.`}
          </p>
        </div>
        
        <Link
          to="/upload"
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <FilePlus size={18} />
          <span>Upload</span>
        </Link>
      </motion.div>

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
        >
          <FilePlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No files yet</h3>
          <p className="text-gray-500 mb-4">
            Upload your first file to get started with Vaultify.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Upload your first file
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={handleDeleteFile}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FileList;