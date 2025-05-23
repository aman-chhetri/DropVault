import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { STORAGE_BUCKET } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FileUpload: React.FC = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'success' | 'error' | 'uploading'>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) return;

      setUploading(true);
      const newUploadStatus: Record<string, 'success' | 'error' | 'uploading'> = {};
      const newUploadProgress: Record<string, number> = {};

      acceptedFiles.forEach((file) => {
        newUploadStatus[file.name] = 'uploading';
        newUploadProgress[file.name] = 0;
      });

      setUploadStatus(newUploadStatus);
      setUploadProgress(newUploadProgress);

      try {
        await Promise.all(
          acceptedFiles.map(async (file) => {
            try {
              // Create a unique path for the file
              const filePath = `${user.id}/${Date.now()}_${file.name}`;

              const { error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false,
                  onUploadProgress: (progress) => {
                    if (progress.totalBytes > 0) {
                      const percent = Math.round((progress.uploadedBytes / progress.totalBytes) * 100);
                      setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: percent,
                      }));
                    }
                  },
                });

              if (error) {
                throw error;
              }

              setUploadStatus((prev) => ({
                ...prev,
                [file.name]: 'success',
              }));
            } catch (error) {
              console.error('Error uploading file:', error);
              setUploadStatus((prev) => ({
                ...prev,
                [file.name]: 'error',
              }));
            }
          })
        );

        // Check if any files failed
        const hasErrors = Object.values(newUploadStatus).some(status => status === 'error');
        
        if (hasErrors) {
          toast.error('Some files failed to upload');
        } else {
          toast.success('All files uploaded successfully!');
        }
      } catch (error) {
        console.error('Error in uploads:', error);
        toast.error('Error uploading files');
      } finally {
        setUploading(false);
      }
    },
    [user]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    disabled: uploading,
  });

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Files</h1>
        <p className="text-gray-600">
          Drag and drop files to upload them to your secure storage.
        </p>
      </motion.div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Support for images, PDFs, and document files
        </p>
      </div>

      {Object.keys(uploadStatus).length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 bg-white rounded-lg shadow p-4"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Status</h3>
          <ul className="space-y-3">
            {Object.entries(uploadStatus).map(([fileName, status]) => (
              <li key={fileName} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {status === 'uploading' ? (
                    <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {fileName}
                  </span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      status === 'success'
                        ? 'bg-green-500'
                        : status === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${uploadProgress[fileName] || 0}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;