# 講師確認書フォーム - デザイン仕様書

## デザインコンセプト

### ビジョン
「上質で信頼感のある、プロフェッショナルなフォーム体験」

### キーワード
- **Clean（清潔感）**: 余白を活かした見やすいレイアウト
- **Professional（専門性）**: 倫理法人会にふさわしい品格
- **Accessible（親しみやすさ）**: 誰でも迷わず入力できる
- **Modern（現代的）**: 最新のUIトレンドを適度に取り入れる

## カラーパレット

### プライマリカラー
```css
/* ブルー系グラデーション */
--primary-gradient: linear-gradient(135deg, #667EEA 0%, #4C63D2 100%);
--primary-50: #EFF6FF;   /* 最も薄い青（背景用） */
--primary-100: #DBEAFE;  /* 薄い青 */
--primary-200: #BFDBFE;  /* ライトブルー */
--primary-300: #93C5FD;  /* 明るい青 */
--primary-400: #60A5FA;  /* ミディアムブルー */
--primary-500: #3B82F6;  /* メインブルー */
--primary-600: #2563EB;  /* 濃い青 */
--primary-700: #1D4ED8;  /* ダークブルー */
--primary-800: #1E40AF;  /* より濃い青 */
--primary-900: #1E3A8A;  /* 最も濃い青 */
```

### セカンダリカラー
```css
/* グレースケール */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### 機能色
```css
/* 成功・エラー・警告 */
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;
--info: #3B82F6;
```

## タイポグラフィ

### フォントファミリー
```css
--font-primary: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### フォントサイズ
```css
--text-xs: 0.75rem;    /* 12px - 補足テキスト */
--text-sm: 0.875rem;   /* 14px - ヘルプテキスト */
--text-base: 1rem;     /* 16px - 本文 */
--text-lg: 1.125rem;   /* 18px - 小見出し */
--text-xl: 1.25rem;    /* 20px - 見出し */
--text-2xl: 1.5rem;    /* 24px - セクション見出し */
--text-3xl: 1.875rem;  /* 30px - ページタイトル */
```

### フォントウェイト
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## スペーシング

### 基本単位
```css
--spacing-unit: 0.25rem; /* 4px */
--spacing-xs: 0.5rem;    /* 8px */
--spacing-sm: 0.75rem;   /* 12px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

## コンポーネントスタイル

### ヘッダー
```css
.header {
  background: linear-gradient(135deg, #667EEA 0%, #4C63D2 100%);
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### カードセクション
```css
.section-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
              0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.section-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 
              0 2px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}
```

### セクションタイトル
```css
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #E5E7EB;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
}
```

### 入力フィールド
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:hover {
  border-color: #D1D5DB;
}
```

### ボタン

#### プライマリボタン
```css
.btn-primary {
  background: linear-gradient(135deg, #667EEA 0%, #4C63D2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### セカンダリボタン
```css
.btn-secondary {
  background: white;
  color: #4B5563;
  padding: 12px 24px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}
```

### ラベル
```css
.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.label-required::after {
  content: '*';
  color: #EF4444;
  margin-left: 4px;
}
```

### エラー表示
```css
.error-message {
  color: #EF4444;
  font-size: 14px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-error {
  border-color: #EF4444;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### 文字数カウンター
```css
.character-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #9CA3AF;
}

.character-counter.warning {
  color: #F59E0B;
}

.character-counter.error {
  color: #EF4444;
}
```

## レイアウト

### ページ構造
```
┌─────────────────────────────────────┐
│          ヘッダー（固定）              │
├─────────────────────────────────────┤
│                                     │
│    メインコンテナ（max-w-4xl）         │
│    ┌───────────────────────────┐    │
│    │   セクションカード          │    │
│    └───────────────────────────┘    │
│    ┌───────────────────────────┐    │
│    │   セクションカード          │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│          フッター                    │
└─────────────────────────────────────┘
```

### グリッドシステム
```css
/* 住所入力の3カラムレイアウト */
.address-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .address-grid {
    grid-template-columns: 120px 1fr 1fr;
  }
}

/* 2カラムレイアウト */
.two-column {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .two-column {
    grid-template-columns: 1fr 1fr;
  }
}
```

## アニメーション

### トランジション
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### ホバーエフェクト
```css
/* カードホバー */
@keyframes card-lift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

/* ボタンホバー */
@keyframes button-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### ローディング
```css
.loading-spinner {
  border: 3px solid #E5E7EB;
  border-top: 3px solid #3B82F6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## レスポンシブデザイン

### ブレークポイント
```css
--breakpoint-sm: 640px;   /* スマートフォン横 */
--breakpoint-md: 768px;   /* タブレット縦 */
--breakpoint-lg: 1024px;  /* タブレット横/小型PC */
--breakpoint-xl: 1280px;  /* デスクトップ */
```

### モバイル最適化
- タップターゲット最小: 44px × 44px
- フォントサイズ最小: 16px（ズーム防止）
- 余白の調整: モバイルでは縮小
- カラム数: モバイルでは1カラム

## アクセシビリティ

### コントラスト比
- 通常テキスト: 4.5:1以上
- 大きいテキスト: 3:1以上
- インタラクティブ要素: 3:1以上

### フォーカス表示
```css
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### スクリーンリーダー対応
- 適切なaria-label使用
- セマンティックHTML
- エラーメッセージの適切な関連付け

## 特殊コンポーネント

### ファイルアップロード
```css
.file-upload-area {
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: #F9FAFB;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.file-upload-area.dragging {
  border-color: #3B82F6;
  background: #DBEAFE;
}
```

### プログレスバー（将来実装用）
```css
.progress-bar {
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
  transition: width 0.3s ease;
}
```

## 実装上の注意点

1. **パフォーマンス**: グラデーションは控えめに使用
2. **一貫性**: 全体を通じて同じスタイルを維持
3. **可読性**: 十分なコントラストと余白を確保
4. **操作性**: タップ/クリック領域を十分に確保
5. **フィードバック**: ユーザーアクションに対する即座の視覚的応答