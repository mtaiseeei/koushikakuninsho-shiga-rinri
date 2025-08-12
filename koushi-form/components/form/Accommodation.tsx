'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { TextArea } from '@/components/ui/TextArea';
import { Accommodation } from '@/types/form';

interface AccommodationProps {
  data: Accommodation;
  onChange: (data: Accommodation) => void;
  errors?: Record<string, string>;
}

export const AccommodationComponent: React.FC<AccommodationProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const handleStayChange = (value: string) => {
    onChange({
      ...data,
      stay: value as 'none' | 'need-smoking' | 'need-non-smoking'
    });
  };

  const handlePhotographyChange = (value: string) => {
    onChange({
      ...data,
      photography: value as 'allowed' | 'not-allowed'
    });
  };

  const handleSnsChange = (value: string) => {
    onChange({
      ...data,
      sns: value as 'allowed' | 'not-allowed'
    });
  };

  const handleNotesChange = (value: string) => {
    onChange({
      ...data,
      notes: value
    });
  };

  return (
    <Card>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 relative">
            ご宿泊・その他
            <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
          </h2>
        </div>

        <RadioGroup
          label="宿泊"
          name="stay"
          value={data.stay}
          onChange={handleStayChange}
          error={errors.stay}
          options={[
            { value: 'none', label: '必要なし' },
            { value: 'need-smoking', label: '必要あり（喫煙）' },
            { value: 'need-non-smoking', label: '必要あり（禁煙）' }
          ]}
        />

        <RadioGroup
          label="写真撮影"
          name="photography"
          value={data.photography}
          onChange={handlePhotographyChange}
          error={errors.photography}
          options={[
            { value: 'allowed', label: '可', description: '講話中やセミナーの様子を撮影させていただきます' },
            { value: 'not-allowed', label: '不可', description: '撮影は行いません' }
          ]}
        />

        <RadioGroup
          label="SNSへの投稿"
          name="sns"
          value={data.sns}
          onChange={handleSnsChange}
          error={errors.sns}
          options={[
            { value: 'allowed', label: '可', description: 'Facebook、Instagram等への投稿を行います' },
            { value: 'not-allowed', label: '不可', description: 'SNSへの投稿は行いません' }
          ]}
        />

        <TextArea
          label="その他連絡事項"
          value={data.notes || ''}
          onChange={handleNotesChange}
          error={errors.notes}
          maxLength={500}
          rows={4}
          helpText="特別な配慮が必要な事項、アレルギー、その他ご要望などがございましたらご記入ください"
        />
      </div>
    </Card>
  );
};