'use client';

import { useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Success!',
  message,
  autoClose = true,
  autoCloseDuration = 2000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-scaleIn">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 text-lg">{message}</p>

          {/* Optional: Progress bar for auto-close */}
          {autoClose && (
            <div className="w-full mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 animate-progressBar"
                style={{
                  animation: `progressBar ${autoCloseDuration}ms linear`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-progressBar {
          animation: progressBar 2s linear;
        }
      `}</style>
    </div>
  );
}
