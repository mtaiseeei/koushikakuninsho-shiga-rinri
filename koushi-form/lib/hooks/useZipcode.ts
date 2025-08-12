import { useState } from 'react';

interface ZipcodeAPIResponse {
  status: number;
  message: string | null;
  results: Array<{
    zipcode: string;
    prefcode: string;
    address1: string; // 都道府県
    address2: string; // 市区町村
    address3: string; // 町域
    kana1: string;
    kana2: string;
    kana3: string;
  }> | null;
}

export interface ZipcodeResult {
  prefecture: string;
  city: string;
  town: string;
}

export function useZipcode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = async (zipcode: string): Promise<ZipcodeResult | null> => {
    if (!zipcode || zipcode.length !== 7) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('郵便番号API呼び出し開始:', zipcode);
      
      // プロキシ経由でzipcloud APIを呼び出し
      const response = await fetch(`/api/zipcode?zipcode=${zipcode}`);
      
      if (!response.ok) {
        throw new Error('郵便番号APIへのアクセスに失敗しました');
      }

      const data: ZipcodeAPIResponse = await response.json();
      console.log('APIレスポンスデータ:', data);

      if (data.status !== 200 || !data.results || data.results.length === 0) {
        console.log('住所が見つからない - status:', data.status, 'results:', data.results);
        setError('該当する住所が見つかりませんでした');
        return null;
      }

      const result = data.results[0];
      console.log('結果データ:', result);
      
      return {
        prefecture: result.address1,
        city: result.address2,
        town: result.address3,
      };
    } catch (err) {
      console.error('郵便番号API エラー:', err);
      const message = err instanceof Error ? err.message : '郵便番号の検索に失敗しました';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchAddress,
    isLoading,
    error,
  };
}