'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SeminarInfo } from './SeminarInfo';
import { SpeakerBasicInfo } from './SpeakerBasicInfo';
import { SpeechInfoComponent } from './SpeechInfo';
import { PresentationStyleComponent } from './PresentationStyle';
import { AccommodationComponent } from './Accommodation';
import { FormData, defaultFormData } from '@/types/form';
import { Unit } from '@/types/unit';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

interface FormContainerProps {
  unit: Unit;
}

export const FormContainer: React.FC<FormContainerProps> = ({ unit }) => {
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    seminarInfo: {
      ...defaultFormData.seminarInfo,
      unitName: unit.name,
      unitSlug: unit.slug,
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { submitForm, isSubmitting, submitError } = useFormSubmit();

  // SessionStorageから保存されたデータを復元（セッション終了時に自動クリア）
  useEffect(() => {
    // 古いlocalStorageデータをクリーンアップ
    localStorage.removeItem(`form-data-${unit.slug}`);
    
    const savedData = sessionStorage.getItem(`form-data-${unit.slug}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({
          ...parsed,
          seminarInfo: {
            ...parsed.seminarInfo,
            unitName: unit.name,
            unitSlug: unit.slug,
          }
        });
      } catch (error) {
        console.error('保存されたフォームデータの復元に失敗しました:', error);
      }
    }
  }, [unit]);

  // フォームデータをSessionStorageに保存（セッション終了時に自動削除）
  useEffect(() => {
    sessionStorage.setItem(`form-data-${unit.slug}`, JSON.stringify(formData));
  }, [formData, unit.slug]);

  // ページ離脱時やセッション終了時のクリーンアップ
  useEffect(() => {
    const handleBeforeUnload = () => {
      // セッション終了時にデータをクリア
      sessionStorage.removeItem(`form-data-${unit.slug}`);
    };

    const handleVisibilityChange = () => {
      // ページが非表示になった時（別タブに移動、ブラウザを閉じるなど）
      if (document.visibilityState === 'hidden') {
        sessionStorage.removeItem(`form-data-${unit.slug}`);
      }
    };

    // イベントリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // クリーンアップ
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [unit.slug]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // セミナー情報のバリデーション
    if (!formData.seminarInfo.seminarDate) {
      newErrors['seminarDate'] = 'モーニングセミナー日付は必須です';
    } else {
      const selectedDate = new Date(formData.seminarInfo.seminarDate);
      const selectedDay = selectedDate.getDay();
      if (selectedDay !== unit.dayOfWeek) {
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        newErrors['seminarDate'] = `${unit.name}の開催日は${dayNames[unit.dayOfWeek]}曜日です`;
      }
    }

    // 講師基本情報のバリデーション
    if (!formData.speakerInfo.name.trim()) {
      newErrors['name'] = 'お名前は必須です';
    }
    
    if (!formData.speakerInfo.nameKana.trim()) {
      newErrors['nameKana'] = 'ふりがなは必須です';
    } else {
      const hiraganaRegex = /^[ひらがな\s]*$/;
      if (!hiraganaRegex.test(formData.speakerInfo.nameKana)) {
        newErrors['nameKana'] = 'ふりがなはひらがなで入力してください';
      }
    }
    
    if (!formData.speakerInfo.companyName.trim()) {
      newErrors['companyName'] = '会社名/団体名は必須です';
    }
    
    if (!formData.speakerInfo.address.zipCode.trim()) {
      newErrors['address.zipCode'] = '郵便番号は必須です';
    }
    
    if (!formData.speakerInfo.address.prefecture.trim()) {
      newErrors['address.prefecture'] = '都道府県は必須です';
    }
    
    if (!formData.speakerInfo.address.city.trim()) {
      newErrors['address.city'] = '市区町村は必須です';
    }
    
    if (!formData.speakerInfo.address.street.trim()) {
      newErrors['address.street'] = '番地は必須です';
    }
    
    if (!formData.speakerInfo.mobile.trim()) {
      newErrors['mobile'] = '携帯電話は必須です';
    }
    
    if (!formData.speakerInfo.email.trim()) {
      newErrors['email'] = 'Emailは必須です';
    }

    // 講話情報のバリデーション
    if (!formData.speechInfo.theme.trim()) {
      newErrors['theme'] = 'テーマは必須です';
    }
    
    if (!formData.speechInfo.content.trim()) {
      newErrors['content'] = '内容は必須です';
    }
    
    if (!formData.speechInfo.profile.trim()) {
      newErrors['profile'] = 'プロフィールは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await submitForm(formData);
    if (result?.success) {
      setIsSubmitted(true);
      // 送信完了時にセッションデータをクリア
      sessionStorage.removeItem(`form-data-${unit.slug}`);
    }
  };

  const handleReset = () => {
    // フォームを初期状態にリセット
    setFormData({
      ...defaultFormData,
      seminarInfo: {
        ...defaultFormData.seminarInfo,
        unitName: unit.name,
        unitSlug: unit.slug,
      }
    });
    setErrors({});
    // セッションストレージからも削除
    sessionStorage.removeItem(`form-data-${unit.slug}`);
  };

  if (isSubmitted) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">送信完了</h2>
            <p className="text-green-700">
              講師確認書を正常に送信しました。<br />
              ご協力ありがとうございました。
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit} className="py-8 space-y-8">
        <SeminarInfo
          data={formData.seminarInfo}
          onChange={(data) => setFormData({ ...formData, seminarInfo: data })}
          errors={errors}
        />

        <SpeakerBasicInfo
          data={formData.speakerInfo}
          onChange={(data) => setFormData({ ...formData, speakerInfo: data })}
          errors={errors}
        />

        <SpeechInfoComponent
          data={formData.speechInfo}
          onChange={(data) => setFormData({ ...formData, speechInfo: data })}
          errors={errors}
          unitSlug={unit.slug}
          speakerName={formData.speakerInfo.name}
        />

        <PresentationStyleComponent
          data={formData.presentationStyle}
          onChange={(data) => setFormData({ ...formData, presentationStyle: data })}
          errors={errors}
          unitSlug={unit.slug}
          speakerName={formData.speakerInfo.name}
        />

        <AccommodationComponent
          data={formData.accommodation}
          onChange={(data) => setFormData({ ...formData, accommodation: data })}
          errors={errors}
        />

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {submitError}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-8">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            リセット
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="min-w-48"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                送信中...
              </span>
            ) : (
              '送信する'
            )}
          </Button>
        </div>
      </form>
    </Container>
  );
};