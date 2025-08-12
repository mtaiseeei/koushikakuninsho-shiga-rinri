'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';
import { PresentationStyle } from '@/types/form';
import { useFileUpload } from '@/lib/hooks/useFileUpload';

interface PresentationStyleProps {
  data: PresentationStyle;
  onChange: (data: PresentationStyle) => void;
  errors?: Record<string, string>;
  unitSlug: string;
  speakerName: string;
}

export const PresentationStyleComponent: React.FC<PresentationStyleProps> = ({
  data,
  onChange,
  errors = {},
  unitSlug,
  speakerName
}) => {
  const { uploadFile, isUploading } = useFileUpload({
    type: 'handout',
    unitSlug,
    speakerName
  });

  const handleHandoutChange = (value: string) => {
    onChange({
      ...data,
      handout: value as 'bring' | 'none' | 'print',
      handoutFileUrl: value !== 'print' ? undefined : data.handoutFileUrl
    });
  };

  const handleProjectorChange = (value: string) => {
    onChange({
      ...data,
      projector: value as 'use' | 'not-use',
      projectorDetails: value === 'not-use' ? undefined : data.projectorDetails
    });
  };

  const handleProjectorDetailsChange = (field: string, value: string) => {
    onChange({
      ...data,
      projectorDetails: {
        device: data.projectorDetails?.device || 'none',
        deviceOS: data.projectorDetails?.deviceOS,
        cable: data.projectorDetails?.cable,
        ...data.projectorDetails,
        [field]: value
      }
    });
  };

  const handleWhiteboardChange = (value: string) => {
    onChange({
      ...data,
      whiteboard: value as 'use' | 'not-use'
    });
  };

  const handleHandoutFileUpload = async (file: File) => {
    const fileUrl = await uploadFile(file);
    if (fileUrl) {
      onChange({ ...data, handoutFileUrl: fileUrl });
    }
  };

  const handleHandoutFileRemove = () => {
    onChange({ ...data, handoutFileUrl: undefined });
  };

  return (
    <Card>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 relative">
            登壇形式
            <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
          </h2>
        </div>

        <RadioGroup
          label="レジュメ・配付資料"
          name="handout"
          value={data.handout}
          onChange={handleHandoutChange}
          error={errors.handout}
          options={[
            { value: 'bring', label: 'あり（ご持参）' },
            { value: 'none', label: 'なし' },
            { value: 'print', label: 'あり（当単会でプリント）' }
          ]}
        />

        {data.handout === 'print' && (
          <div className="ml-6 border-l-4 border-blue-200 pl-6">
            <FileUpload
              label="レジュメファイル"
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
              }}
              maxSize={10 * 1024 * 1024} // 10MB
              onFileSelect={handleHandoutFileUpload}
              onFileRemove={handleHandoutFileRemove}
              isUploading={isUploading}
              error={errors.handoutFileUrl}
              helpText="PDF・Word形式対応（最大10MB）"
            />
          </div>
        )}

        <RadioGroup
          label="プロジェクター使用"
          name="projector"
          value={data.projector}
          onChange={handleProjectorChange}
          error={errors.projector}
          options={[
            { value: 'use', label: '使用する' },
            { value: 'not-use', label: '使用しない' }
          ]}
        />

        {data.projector === 'use' && (
          <div className="ml-6 border-l-4 border-blue-200 pl-6 space-y-6">
            <RadioGroup
              label="スライド投影用のデバイス"
              name="projectorDevice"
              value={data.projectorDetails?.device || ''}
              onChange={(value) => handleProjectorDetailsChange('device', value)}
              error={errors['projectorDetails.device']}
              options={[
                { value: 'bring', label: '使用する（ご持参）' },
                { value: 'prepare', label: '使用する（当単会で準備）' },
                { value: 'none', label: '使用しない' }
              ]}
            />

            {data.projectorDetails?.device === 'bring' && (
              <div className="space-y-4">
                <Select
                  label="デバイスのOS"
                  value={data.projectorDetails?.deviceOS || ''}
                  onValueChange={(value) => handleProjectorDetailsChange('deviceOS', value)}
                  error={errors['projectorDetails.deviceOS']}
                  options={[
                    { value: 'Windows', label: 'Windows' },
                    { value: 'Mac', label: 'Mac' },
                    { value: 'iOS', label: 'iOS（iPhone・iPad）' },
                    { value: 'Android', label: 'Android' }
                  ]}
                />

                <RadioGroup
                  label="スライド投影出力ケーブル"
                  name="projectorCable"
                  value={data.projectorDetails?.cable || ''}
                  onChange={(value) => handleProjectorDetailsChange('cable', value)}
                  error={errors['projectorDetails.cable']}
                  options={[
                    { value: 'HDMI', label: 'HDMI' },
                    { value: 'VGA', label: '15ピン' }
                  ]}
                />
              </div>
            )}
          </div>
        )}

        <RadioGroup
          label="ホワイトボード"
          name="whiteboard"
          value={data.whiteboard}
          onChange={handleWhiteboardChange}
          error={errors.whiteboard}
          options={[
            { value: 'use', label: '使用する' },
            { value: 'not-use', label: '使用しない' }
          ]}
        />
      </div>
    </Card>
  );
};