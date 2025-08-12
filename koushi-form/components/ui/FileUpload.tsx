'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils/cn';
import { Upload, X, File } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  accept?: Record<string, string[]>;
  maxSize?: number; // bytes
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  required = false,
  error,
  helpText,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.heic'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  onFileSelect,
  onFileRemove,
  isUploading = false,
  uploadProgress = 0,
  className
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // 画像ファイルの場合はプレビューを生成
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      onFileSelect?.(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileRemove?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {selectedFile ? (
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            {preview ? (
              <Image
                src={preview}
                alt="プレビュー"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
              <div className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</div>
              
              {isUploading && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    アップロード中... {uploadProgress}%
                  </div>
                </div>
              )}
            </div>
            
            {!isUploading && (
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer',
            'hover:border-gray-400 hover:bg-gray-50 transition-all duration-200',
            isDragActive && 'border-blue-500 bg-blue-50',
            error && 'border-red-300'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <div className="text-sm text-gray-600 mb-1">
            {isDragActive ? (
              'ファイルをここにドロップしてください'
            ) : (
              'ファイルをドロップするか、クリックして選択'
            )}
          </div>
          <div className="text-xs text-gray-500">
            最大サイズ: {formatFileSize(maxSize)}
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600">
          {fileRejections[0].errors[0].message}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};