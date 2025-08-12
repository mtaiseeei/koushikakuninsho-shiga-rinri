/**
 * イベントオブジェクトまたは値を受け取り、値を返すユーティリティ関数
 * React.ChangeEvent<HTMLInputElement> または string を統一的に処理
 */
export function getValue(eventOrValue: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string): string {
  if (typeof eventOrValue === 'string') {
    return eventOrValue;
  }
  
  // イベントオブジェクトの場合
  if (eventOrValue && typeof eventOrValue === 'object' && 'target' in eventOrValue) {
    return eventOrValue.target.value;
  }
  
  return '';
}