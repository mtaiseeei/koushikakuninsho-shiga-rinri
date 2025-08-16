'use client';

import React from 'react';
import { KoushiFormData } from '@/types/form';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: KoushiFormData;
  isSubmitting: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isSubmitting
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '未入力';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getHandoutText = (value: string) => {
    const map: Record<string, string> = {
      'bring': 'あり（ご持参）',
      'none': 'なし',
      'print': 'あり（当単会でプリント）',
    };
    return map[value] || value;
  };

  const getProjectorText = (value: string) => {
    const map: Record<string, string> = {
      'use': '使用する',
      'not-use': '使用しない',
    };
    return map[value] || value;
  };

  const getStayText = (value: string) => {
    const map: Record<string, string> = {
      'none': '必要なし',
      'need-smoking': '必要あり（喫煙）',
      'need-non-smoking': '必要あり（禁煙）',
    };
    return map[value] || value;
  };

  const getPermissionText = (value: string) => {
    const map: Record<string, string> = {
      'allowed': '可',
      'not-allowed': '不可',
    };
    return map[value] || value;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">送信内容の確認</h2>
            <p className="text-blue-100 text-sm mt-1">
              以下の内容で送信してよろしいですか？
            </p>
          </div>

          {/* コンテンツ */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              {/* セミナー情報 */}
              <section>
                <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">セミナー情報</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-600">単会名</dt>
                    <dd className="font-medium">{formData.seminarInfo.unitName}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">開催日</dt>
                    <dd className="font-medium">{formatDate(formData.seminarInfo.seminarDate)}</dd>
                  </div>
                </dl>
              </section>

              {/* 講師基本情報 */}
              <section>
                <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">講師基本情報</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-600">お名前</dt>
                    <dd className="font-medium">{formData.speakerInfo.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">ふりがな</dt>
                    <dd className="font-medium">{formData.speakerInfo.nameKana}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">会社名/団体名</dt>
                    <dd className="font-medium">{formData.speakerInfo.companyName}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">役職・肩書</dt>
                    <dd className="font-medium">{formData.speakerInfo.position || '未入力'}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-gray-600">住所</dt>
                    <dd className="font-medium">
                      〒{formData.speakerInfo.address.zipCode} {formData.speakerInfo.address.prefecture}
                      {formData.speakerInfo.address.city}{formData.speakerInfo.address.street}
                      {formData.speakerInfo.address.buildingName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">携帯電話</dt>
                    <dd className="font-medium">{formData.speakerInfo.mobile}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Email</dt>
                    <dd className="font-medium">{formData.speakerInfo.email}</dd>
                  </div>
                </dl>
              </section>

              {/* 講話情報 */}
              <section>
                <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">講話情報</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-600">テーマ</dt>
                    <dd className="font-medium">{formData.speechInfo.theme}</dd>
                  </div>
                  {formData.speechInfo.subTheme && (
                    <div>
                      <dt className="text-gray-600">サブテーマ</dt>
                      <dd className="font-medium">{formData.speechInfo.subTheme}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-gray-600">内容</dt>
                    <dd className="font-medium whitespace-pre-wrap">{formData.speechInfo.content}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">プロフィール画像</dt>
                    <dd className="font-medium">
                      {formData.speechInfo.profileImageFile ? '添付あり' : '添付なし'}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* 発表スタイル */}
              <section>
                <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">発表スタイル</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-600">レジュメ</dt>
                    <dd className="font-medium">
                      {getHandoutText(formData.presentationStyle.handout)}
                      {formData.presentationStyle.handoutFile && ' (ファイル添付あり)'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">プロジェクター</dt>
                    <dd className="font-medium">{getProjectorText(formData.presentationStyle.projector)}</dd>
                  </div>
                  {formData.presentationStyle.projectorDetails?.cable && (
                    <div>
                      <dt className="text-gray-600">出力ケーブル</dt>
                      <dd className="font-medium">
                        {formData.presentationStyle.projectorDetails.cable}
                        {formData.presentationStyle.projectorDetails.cable === 'USB-TypeC' && (
                          <span className="text-blue-600 text-xs ml-2">
                            (変換アダプタ要持参)
                          </span>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* 宿泊・その他 */}
              <section>
                <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">宿泊・その他</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-600">宿泊</dt>
                    <dd className="font-medium">{getStayText(formData.accommodation.stay)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">写真撮影</dt>
                    <dd className="font-medium">{getPermissionText(formData.accommodation.photography)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">SNS投稿</dt>
                    <dd className="font-medium">{getPermissionText(formData.accommodation.sns)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};