'use client';

import { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploaderProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  required?: boolean;
  isThumbnail?: boolean;
}

export default function ImageUploader({
  label,
  images,
  onChange,
  maxImages = 10,
  required = false,
  isThumbnail = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if we've reached max images
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        if (images.length + uploadedUrls.length >= maxImages) {
          alert(`Maximum ${maxImages} images allowed`);
          break;
        }

        const file = files[i];

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'properties');

        // Upload to server
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const error = await response.json();
          alert(`Failed to upload ${file.name}: ${error.error}`);
        }
      }

      // Update images array
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading && images.length < maxImages) {
            document.getElementById(isThumbnail ? 'thumbnail-upload' : 'gallery-upload')?.click();
          }
        }}
      >
        <input
          id={isThumbnail ? 'thumbnail-upload' : 'gallery-upload'}
          type="file"
          multiple={!isThumbnail}
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center justify-center">
          {uploading ? (
            <>
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-600">Uploading images...</p>
            </>
          ) : (
            <>
              <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {isThumbnail ? 'Upload Thumbnail Image' : 'Upload Gallery Images'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select {isThumbnail ? 'an image' : 'images'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP up to 10MB {!isThumbnail && `(Max ${maxImages} images)`}
              </p>
              {images.length > 0 && (
                <p className="text-xs text-primary-600 mt-2 font-medium">
                  {images.length} / {maxImages} images uploaded
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
            >
              <img
                src={imageUrl}
                alt={`${isThumbnail ? 'Thumbnail' : 'Gallery'} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && !isThumbnail && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Thumbnail
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="mt-2 text-xs text-gray-500 italic">
          No images uploaded yet. {isThumbnail ? 'The thumbnail' : 'The first image'} will be used
          as the main property image.
        </p>
      )}
    </div>
  );
}
