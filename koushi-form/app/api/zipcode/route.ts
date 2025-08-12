import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zipcode = searchParams.get('zipcode');

    console.log('郵便番号API プロキシ呼び出し:', zipcode);

    if (!zipcode) {
      return NextResponse.json(
        { 
          status: 400,
          message: '郵便番号が指定されていません',
          results: null
        },
        { status: 400 }
      );
    }

    // zipcloud APIを呼び出し
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'koushi-form-app',
        },
      }
    );

    console.log('zipcloud APIレスポンス状態:', response.ok, response.status);

    if (!response.ok) {
      throw new Error(`zipcloud API エラー: ${response.status}`);
    }

    const data = await response.json();
    console.log('zipcloud APIレスポンスデータ:', data);

    // レスポンスをそのまま返す
    return NextResponse.json(data);
  } catch (error) {
    console.error('郵便番号API プロキシ エラー:', error);
    return NextResponse.json(
      { 
        status: 500,
        message: '郵便番号の検索に失敗しました',
        results: null
      },
      { status: 500 }
    );
  }
}