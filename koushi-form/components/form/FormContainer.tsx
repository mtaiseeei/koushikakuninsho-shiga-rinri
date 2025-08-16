'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';
import { SeminarInfo } from './SeminarInfo';
import { SpeakerBasicInfo } from './SpeakerBasicInfo';
import { SpeechInfoComponent } from './SpeechInfo';
import { PresentationStyleComponent } from './PresentationStyle';
import { AccommodationComponent } from './Accommodation';
import { KoushiFormData, defaultFormData } from '@/types/form';
import { Unit } from '@/types/unit';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

interface FormContainerProps {
  unit: Unit;
}

export const FormContainer: React.FC<FormContainerProps> = ({ unit }) => {
  const [formData, setFormData] = useState<KoushiFormData>({
    ...defaultFormData,
    seminarInfo: {
      ...defaultFormData.seminarInfo,
      unitName: unit.name,
      unitSlug: unit.slug,
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  
  const { submitForm, isSubmitting, submitError, setSubmitError } = useFormSubmit();

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
      const hiraganaRegex = /^[\u3041-\u3096\s]*$/;
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

  const handleConfirmClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 確認モーダルを表示
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    // 二重送信防止
    if (hasSubmittedOnce) {
      return;
    }
    setHasSubmittedOnce(true);
    
    // 確認モーダルを閉じて全画面ローダーを表示
    setShowConfirmModal(false);
    setShowFullScreenLoader(true);
    setIsProcessingComplete(false);

    console.log("送信するフォームデータ:", formData);
    
    // 送信前にファイルをアップロード
    let updatedFormData = { ...formData };
    
    // 進捗リセット
    setUploadProgress(0);
    setUploadStatus('処理を開始しています...');
    
    try {
      let totalSteps = 1; // 最終送信ステップ
      let completedSteps = 0;
      
      // アップロードするファイルの数を計算
      if (formData.speechInfo.profileImageFile) totalSteps++;
      if (formData.presentationStyle.handoutFile) totalSteps++;
      
      // プロフィール画像のアップロード
      if (formData.speechInfo.profileImageFile) {
        setUploadStatus('プロフィール画像をアップロード中...');
        setUploadProgress((completedSteps / totalSteps) * 100);
        
        console.log("プロフィール画像をアップロード中...");
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.speechInfo.profileImageFile);
        formDataUpload.append('fileType', 'profile');
        formDataUpload.append('unitSlug', unit.slug);
        formDataUpload.append('speakerName', formData.speakerInfo.name || '未入力');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          updatedFormData.speechInfo.profileImageUrl = uploadResult.fileUrl;
          console.log("プロフィール画像アップロード成功:", uploadResult.fileUrl);
          completedSteps++;
          setUploadProgress((completedSteps / totalSteps) * 100);
        } else {
          throw new Error(uploadResult.error || 'プロフィール画像のアップロードに失敗しました');
        }
      }
      
      // レジュメファイルのアップロード
      if (formData.presentationStyle.handoutFile) {
        setUploadStatus('レジュメファイルをアップロード中...');
        setUploadProgress((completedSteps / totalSteps) * 100);
        
        console.log("レジュメファイルをアップロード中...");
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.presentationStyle.handoutFile);
        formDataUpload.append('fileType', 'handout');
        formDataUpload.append('unitSlug', unit.slug);
        formDataUpload.append('speakerName', formData.speakerInfo.name || '未入力');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          updatedFormData.presentationStyle.handoutFileUrl = uploadResult.fileUrl;
          console.log("レジュメファイルアップロード成功:", uploadResult.fileUrl);
          completedSteps++;
          setUploadProgress((completedSteps / totalSteps) * 100);
        } else {
          throw new Error(uploadResult.error || 'レジュメファイルのアップロードに失敗しました');
        }
      }
      
      // Fileオブジェクトを削除（JSONに変換できないため）
      const finalFormData = {
        ...updatedFormData,
        speechInfo: {
          ...updatedFormData.speechInfo,
          profileImageFile: undefined
        },
        presentationStyle: {
          ...updatedFormData.presentationStyle,
          handoutFile: undefined
        }
      };
      
      setUploadStatus('フォームデータを送信中...');
      setUploadProgress((completedSteps / totalSteps) * 100);
      
      console.log("最終フォームデータ:", finalFormData);
      console.log("プロフィール画像URL:", finalFormData.speechInfo.profileImageUrl);
      console.log("レジュメファイルURL:", finalFormData.presentationStyle.handoutFileUrl);
      
      const result = await submitForm(finalFormData);
      if (result?.success) {
        completedSteps++;
        setUploadProgress(100);
        setUploadStatus('送信完了！');
        setIsProcessingComplete(true);
        
        // 少し待ってから完了画面へ
        setTimeout(() => {
          setShowFullScreenLoader(false);
          setIsSubmitted(true);
          // 送信完了時にセッションデータをクリア
          sessionStorage.removeItem(`form-data-${unit.slug}`);
        }, 2000);
      }
    } catch (error) {
      console.error("送信エラー:", error);
      setUploadProgress(0);
      setUploadStatus('');
      setShowFullScreenLoader(false);
      setHasSubmittedOnce(false); // エラー時は再送信を許可
      setSubmitError(error instanceof Error ? error.message : '送信に失敗しました');
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
    <>
      {/* 確認モーダル */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        formData={formData}
        isSubmitting={isSubmitting}
      />
      
      {/* 全画面ローダー */}
      <FullScreenLoader
        isVisible={showFullScreenLoader}
        status={uploadStatus}
        progress={uploadProgress}
        isCompleted={isProcessingComplete}
      />
      
      <Container>
        <form onSubmit={handleConfirmClick} className="py-8 space-y-8">
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
          speakerName={formData.speakerInfo.name || '未入力'}
        />

        <PresentationStyleComponent
          data={formData.presentationStyle}
          onChange={(data) => setFormData({ ...formData, presentationStyle: data })}
          errors={errors}
          unitSlug={unit.slug}
          speakerName={formData.speakerInfo.name || '未入力'}
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
              disabled={hasSubmittedOnce}
            >
              リセット
            </Button>
            <Button
              type="submit"
              disabled={hasSubmittedOnce}
              size="lg"
              className="min-w-48 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
            >
              確認画面へ
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
};