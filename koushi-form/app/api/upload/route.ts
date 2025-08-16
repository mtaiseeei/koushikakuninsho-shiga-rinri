import { NextRequest, NextResponse } from 'next/server';
import { uploadToDrive, generateFileName } from '@/lib/services/google-drive';

// Node.jsランタイムを明示的に指定（googleapisやBufferを使用するため）
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as 'profile' | 'handout';
    const unitSlug = formData.get('unitSlug') as string;
    const speakerName = formData.get('speakerName') as string;

    // デバッグログ
    console.log('受信パラメータ:', {
      hasFile: !!file,
      fileName: file?.name,
      fileType,
      unitSlug,
      speakerName,
      allKeys: Array.from(formData.keys())
    });

    if (!file || !fileType || !unitSlug || !speakerName) {
      console.error('パラメータ不足:', {
        file: !!file,
        fileType: !!fileType,
        unitSlug: !!unitSlug,
        speakerName: !!speakerName
      });
      return NextResponse.json(
        { 
          success: false, 
          error: '必要なパラメータが不足しています' 
        },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（10MB制限）
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ファイルサイズは10MB以下にしてください' 
        },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    const allowedTypes = {
      profile: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      handout: ['application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    };

    if (!allowedTypes[fileType].includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '許可されていないファイル形式です' 
        },
        { status: 400 }
      );
    }

    // ファイルをBufferに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // ファイル名を生成
    const fileName = generateFileName(unitSlug, speakerName, fileType, file.name);

    console.log('アップロード開始:', {
      fileName,
      fileType,
      size: file.size,
      mimeType: file.type
    });

    // Google Driveにアップロード
    const fileUrl = await uploadToDrive(buffer, fileName, file.type);

    console.log('アップロード成功:', fileUrl);

    return NextResponse.json({ 
      success: true, 
      fileUrl: fileUrl
    });
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    
    // エラーメッセージを詳細に
    let errorMessage = 'ファイルのアップロードに失敗しました';
    let errorDetail = '';
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
      console.error('スタックトレース:', error.stack);
      errorDetail = error.message;
      if (error.message.includes('認証') || error.message.includes('credentials')) {
        errorMessage = 'Google API認証エラーが発生しました。環境変数を確認してください。';
      } else if (error.message.includes('フォルダID')) {
        errorMessage = 'Google DriveのフォルダIDが設定されていません。';
      } else if (error.message.includes('storage quota')) {
        errorMessage = 'サービスアカウントのストレージ制限エラーです。共有ドライブの設定を確認してください。';
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        detail: errorDetail 
      },
      { status: 500 }
    );
  }
}