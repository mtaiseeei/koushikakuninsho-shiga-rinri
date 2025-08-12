'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SeminarInfo as SeminarInfoType } from '@/types/form';

interface SeminarInfoProps {
  data: SeminarInfoType;
  onChange: (data: SeminarInfoType) => void;
  errors?: Record<string, string>;
}

export const SeminarInfo: React.FC<SeminarInfoProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const handleDateChange = (value: string) => {
    const date = new Date(value);
    const dayOfWeek = date.getDay();
    
    onChange({
      ...data,
      seminarDate: value,
      dayOfWeek
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 relative">
            モーニングセミナー情報
            <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="講話単会"
            value={data.unitName}
            disabled
            helpText="URLから自動で設定されます"
          />
          
          <Input
            label="モーニングセミナー日付"
            type="date"
            required
            value={data.seminarDate}
            onChange={handleDateChange}
            error={errors.seminarDate}
            helpText="開催曜日の確認を行います"
          />
        </div>
      </div>
    </Card>
  );
};