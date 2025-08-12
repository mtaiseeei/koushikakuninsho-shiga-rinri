import { useState } from 'react';
import axios from 'axios';

interface UseFileUploadOptions {
  type: 'profile' | 'handout';
  unitSlug: string;
  speakerName: string;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', options.type);
      formData.append('unitSlug', options.unitSlug);
      formData.append('speakerName', options.speakerName);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.fileUrl;
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'アップロードに失敗しました';
      setUploadError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadError,
  };
}