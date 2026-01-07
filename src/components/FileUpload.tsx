'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete?: (url: string, path: string) => void;
  folder?: string;
  propertyId?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({
  onUploadComplete,
  folder = 'general',
  propertyId,
  accept = 'image/*',
  maxSize = 10,
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (propertyId) {
        formData.append('propertyId', propertyId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('File uploaded successfully!');
      onUploadComplete?.(data.url, data.path);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500">
            Max file size: {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            disabled={uploading}
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-white font-medium">Uploading...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
