import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/services/google-sheets';
import { KoushiFormData } from '@/types/form';

// Node.jsランタイムを明示的に指定
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data: KoushiFormData = await request.json();
    
    console.log('=== フォーム送信処理開始 ===');
    console.log('受信データ:', {
      unit: data.seminarInfo.unitName,
      speaker: data.speakerInfo.name,
      profileImageUrl: data.speechInfo.profileImageUrl,
      resumeUrl: data.presentationStyle.handoutFileUrl,
    });

    // Google Sheetsにデータを追加
    await appendToSheet(data);
    
    console.log('Sheets書き込み完了');

    return NextResponse.json({
      success: true,
      message: '講師確認書を送信しました',
      submissionId: `${data.seminarInfo.unitSlug}-${Date.now()}`,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '送信に失敗しました。もう一度お試しください。' 
      },
      { status: 500 }
    );
  }
}