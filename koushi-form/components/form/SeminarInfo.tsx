'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SeminarInfo as SeminarInfoType } from '@/types/form';
import { UNITS } from '@/types/unit';

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
  // 単会の開催曜日を取得
  const unitDayOfWeek = useMemo(() => {
    const unit = UNITS[data.unitSlug];
    return unit?.dayOfWeek ?? -1;
  }, [data.unitSlug]);

  // 今日の日付を取得（時間を00:00:00にリセット）
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // 次の開催可能日を計算
  const getNextAvailableDate = (targetDayOfWeek: number) => {
    const date = new Date(today);
    const currentDay = date.getDay();
    let daysToAdd = targetDayOfWeek - currentDay;
    
    // 今週の該当曜日が過ぎている場合は来週に
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    date.setDate(date.getDate() + daysToAdd);
    return date;
  };

  // 最小日付（次の開催可能日）
  const minDate = useMemo(() => {
    if (unitDayOfWeek < 0) return '';
    const nextDate = getNextAvailableDate(unitDayOfWeek);
    return nextDate.toISOString().split('T')[0];
  }, [unitDayOfWeek]);

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
            min={minDate}
            helpText={unitDayOfWeek >= 0 ? `${['日', '月', '火', '水', '木', '金', '土'][unitDayOfWeek]}曜日のみ選択可能です` : "開催曜日の確認を行います"}
          />
        </div>
      </div>
    </Card>
  );
};