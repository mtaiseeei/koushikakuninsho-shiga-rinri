'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SpeakerInfo } from '@/types/form';
import { PREFECTURES } from '@/lib/constants/prefectures';
import { useZipcode } from '@/lib/hooks/useZipcode';

interface SpeakerBasicInfoProps {
  data: SpeakerInfo;
  onChange: (data: SpeakerInfo) => void;
  errors?: Record<string, string>;
}

export const SpeakerBasicInfo: React.FC<SpeakerBasicInfoProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const { searchAddress, isLoading } = useZipcode();

  const handleInputChange = (field: keyof SpeakerInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddressChange = (field: keyof SpeakerInfo['address'], value: string) => {
    onChange({
      ...data,
      address: { ...data.address, [field]: value }
    });
  };

  const handleZipcodeChange = async (value: string) => {
    const zipcode = value.replace(/[^0-9]/g, '');
    handleAddressChange('zipCode', zipcode);

    if (zipcode.length === 7) {
      console.log('7桁の郵便番号が入力されました:', zipcode);
      const result = await searchAddress(zipcode);
      console.log('searchAddress の結果:', result);
      
      if (result) {
        console.log('住所を自動入力します:', result);
        
        // 都道府県名をPREFECTURESリストの値にマッピング
        const prefectureValue = PREFECTURES.find(p => p.label === result.prefecture)?.value || result.prefecture;
        
        onChange({
          ...data,
          address: {
            ...data.address,
            zipCode: zipcode,
            prefecture: prefectureValue,
            city: result.city + (result.town || ''), // address2とaddress3を結合
            street: data.address.street, // 既存の番地情報は保持
            buildingName: data.address.buildingName // 既存の建物名も保持
          }
        });
      }
    }
  };

  // ひらがなバリデーション
  const validateKana = (value: string) => {
    const hiraganaRegex = /^[\u3041-\u3096\s]*$/;
    return hiraganaRegex.test(value);
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 relative">
            講師基本情報
            <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="お名前"
            required
            value={data.name}
            onChange={(value) => handleInputChange('name', value)}
            error={errors.name}
            helpText="表示の際には末尾に「様」が付きます"
          />

          <Input
            label="ふりがな"
            required
            value={data.nameKana}
            onChange={(value) => handleInputChange('nameKana', value)}
            error={errors.nameKana || (!validateKana(data.nameKana) && data.nameKana ? 'ひらがなで入力してください' : undefined)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="会社名/団体名"
            required
            value={data.companyName}
            onChange={(value) => handleInputChange('companyName', value)}
            error={errors.companyName}
          />

          <Input
            label="会社/団体 役職・肩書"
            value={data.position || ''}
            onChange={(value) => handleInputChange('position', value)}
            error={errors.position}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="所属倫理法人会"
            value={data.ethicsGroup || ''}
            onChange={(value) => handleInputChange('ethicsGroup', value)}
            error={errors.ethicsGroup}
          />

          <Input
            label="倫理法人会 役職名"
            value={data.ethicsPosition || ''}
            onChange={(value) => handleInputChange('ethicsPosition', value)}
            error={errors.ethicsPosition}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ご住所</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="郵便番号"
              required
              value={data.address.zipCode}
              onChange={handleZipcodeChange}
              placeholder="1234567"
              maxLength={7}
              error={errors['address.zipCode']}
              helpText={isLoading ? '住所を検索中...' : '7桁の郵便番号（ハイフンなし）'}
            />

            <Select
              label="都道府県"
              required
              value={data.address.prefecture}
              onValueChange={(value) => handleAddressChange('prefecture', value)}
              options={PREFECTURES}
              error={errors['address.prefecture']}
            />

            <Input
              label="市区町村"
              required
              value={data.address.city}
              onChange={(value) => handleAddressChange('city', value)}
              error={errors['address.city']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="番地"
              required
              value={data.address.street}
              onChange={(value) => handleAddressChange('street', value)}
              error={errors['address.street']}
              helpText="番地・丁目など"
            />

            <Input
              label="建物名"
              value={data.address.buildingName || ''}
              onChange={(value) => handleAddressChange('buildingName', value)}
              error={errors['address.buildingName']}
              helpText="建物名、部屋番号など（任意）"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="携帯電話"
            required
            type="tel"
            value={data.mobile}
            onChange={(value) => handleInputChange('mobile', value)}
            error={errors.mobile}
            placeholder="090-1234-5678"
          />

          <Input
            label="Email"
            required
            type="email"
            value={data.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            placeholder="example@example.com"
          />
        </div>
      </div>
    </Card>
  );
};