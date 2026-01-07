'use client';

import { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultiImageUpload({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image`);
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`${file.name} exceeds ${maxSizeMB}MB`);
        }

        // Upload to API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'properties');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {canUploadMore && (
        <div>
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              
              <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </p>
              <p className="text-sm text-gray-500">
                {images.length} / {maxImages} images uploaded • Max {maxSizeMB}MB each
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Property ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <FiX className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-gray-200 rounded-lg bg-gray-50">
          <FiImage className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">
            No images uploaded yet. Add up to {maxImages} images of your property.
          </p>
        </div>
      )}
    </div>
  );
}
