import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/services/google-drive';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'profile' | 'handout';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を生成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const unitSlug = formData.get('unitSlug') as string;
    const speakerName = formData.get('speakerName') as string;
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${unitSlug}_${speakerName}${
      type === 'handout' ? '_レジュメ' : ''
    }.${extension}`;

    // Google Driveにアップロード
    const driveService = new GoogleDriveService();
    const folderName = type === 'profile' ? 'プロフィール画像' : 'レジュメ';
    const result = await driveService.uploadFile(
      buffer,
      fileName,
      file.type,
      folderName
    );

    return NextResponse.json({
      success: true,
      fileUrl: result.fileUrl,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
}