'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { FileUpload } from '@/components/ui/FileUpload';
import { SpeechInfo } from '@/types/form';

interface SpeechInfoProps {
  data: SpeechInfo;
  onChange: (data: SpeechInfo) => void;
  errors?: Record<string, string>;
  unitSlug: string;
  speakerName: string;
}

export const SpeechInfoComponent: React.FC<SpeechInfoProps> = ({
  data,
  onChange,
  errors = {},
  unitSlug,
  speakerName
}) => {

  const handleInputChange = (field: keyof SpeechInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleProfileImageUpload = async (file: File) => {
    console.log("プロフィール画像選択:", file.name);
    // ファイルを保持（アップロードは送信時に実行）
    onChange({ ...data, profileImageFile: file });
  };

  const handleProfileImageRemove = () => {
    onChange({ ...data, profileImageFile: undefined, profileImageUrl: undefined });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 relative">
            講話情報
            <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
          </h2>
        </div>

        <Input
          label="テーマ"
          required
          value={data.theme}
          onChange={(value) => handleInputChange('theme', value)}
          error={errors.theme}
          maxLength={20}
          showCharCount
        />

        <Input
          label="サブテーマ"
          value={data.subTheme || ''}
          onChange={(value) => handleInputChange('subTheme', value)}
          error={errors.subTheme}
          maxLength={30}
          showCharCount
        />

        <TextArea
          label="内容"
          required
          value={data.content}
          onChange={(value) => handleInputChange('content', value)}
          error={errors.content}
          maxLength={240}
          rows={5}
          helpText="講話の具体的な内容をご記入ください"
        />

        <TextArea
          label="プロフィール"
          required
          value={data.profile}
          onChange={(value) => handleInputChange('profile', value)}
          error={errors.profile}
          maxLength={180}
          rows={5}
          helpText="講師の経歴や実績をご記入ください"
        />

        <TextArea
          label="倫理歴"
          value={data.ethicsHistory || ''}
          onChange={(value) => handleInputChange('ethicsHistory', value)}
          error={errors.ethicsHistory}
          maxLength={180}
          rows={5}
          helpText="倫理法人会での活動歴があればご記入ください"
        />

        <FileUpload
          label="プロフィール写真"
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.heic']
          }}
          maxSize={5 * 1024 * 1024}
          onFileSelect={handleProfileImageUpload}
          onFileRemove={handleProfileImageRemove}
          isUploading={false}
          error={errors.profileImageUrl}
          uploadedUrl={data.profileImageFile ? URL.createObjectURL(data.profileImageFile) : data.profileImageUrl}
          helpText="PNG・JPG・HEIC形式対応（最大5MB）"
        />
      </div>
    </Card>
  );
};