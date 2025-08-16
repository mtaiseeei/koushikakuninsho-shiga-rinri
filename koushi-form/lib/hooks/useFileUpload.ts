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
    console.log('ファイルアップロード開始:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadType: options.type,
      unitSlug: options.unitSlug,
      speakerName: options.speakerName
    });
    
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', options.type);  // type -> fileTypeに変更
      formData.append('unitSlug', options.unitSlug);
      formData.append('speakerName', options.speakerName);

      console.log('アップロードAPIを呼び出し中...');
      // Content-Typeヘッダーを削除（ブラウザが自動で設定）
      const response = await axios.post('/api/upload', formData);

      console.log('APIレスポンス:', response.data);
      
      if (response.data.success) {
        console.log('アップロード成功. URL:', response.data.fileUrl);
        return response.data.fileUrl;
      } else {
        console.error('APIエラー:', response.data);
        throw new Error(response.data.error || 'アップロードに失敗しました');
      }
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : error instanceof Error 
        ? error.message 
        : 'アップロードに失敗しました';
      
      console.error('ファイルアップロードエラー:', {
        error,
        message,
        response: axios.isAxiosError(error) ? error.response?.data : undefined
      });
      
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