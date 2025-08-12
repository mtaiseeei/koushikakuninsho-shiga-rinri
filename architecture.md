# architecture.md

## システム概要

滋賀県倫理法人会の10単会で使用する講師確認書フォームを統一し、ファイルをGoogle Driveに保存、データをGoogle Sheetsで管理する完全クラウド型システム。

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **フォーム管理**: React Hook Form + Zod
- **状態管理**: Context API
- **ファイル処理**: react-dropzone + Google Drive API

### バックエンド連携
- **データベース**: Google Sheets (Sheets API v4)
- **ファイルストレージ**: Google Drive (Drive API v3)
- **APIゲートウェイ**: Google Apps Script (GAS)
- **認証**: サービスアカウント（API アクセス用）

## プロジェクト構造

```
koushi-form/
├── app/
│   ├── layout.tsx                    # ルートレイアウト、メタデータ設定
│   ├── page.tsx                       # ランディングページ（リダイレクト）
│   ├── [slug]/                       # 動的ルート（各単会用）
│   │   └── page.tsx                  # メインフォームページ
│   ├── api/
│   │   ├── submit/
│   │   │   └── route.ts             # フォーム送信エンドポイント
│   │   ├── upload/
│   │   │   └── route.ts             # Google Drive アップロード
│   │   └── zipcode/
│   │       └── route.ts             # 郵便番号API プロキシ
│   └── globals.css                   # グローバルスタイル
│
├── components/
│   ├── form/
│   │   ├── FormContainer.tsx        # フォーム全体の制御
│   │   ├── SeminarInfo.tsx         # モーニングセミナー情報
│   │   ├── SpeakerBasicInfo.tsx    # 講師基本情報
│   │   ├── SpeechInfo.tsx          # 講話情報
│   │   ├── PresentationStyle.tsx   # 登壇形式
│   │   ├── Accommodation.tsx       # 宿泊・その他
│   │   └── ConfirmationModal.tsx   # 送信前確認モーダル
│   │
│   ├── ui/
│   │   ├── Input.tsx                # テキスト入力（文字数カウンター付き）
│   │   ├── TextArea.tsx            # 複数行入力
│   │   ├── Select.tsx              # ドロップダウン選択
│   │   ├── RadioGroup.tsx          # ラジオボタングループ
│   │   ├── Checkbox.tsx            # チェックボックス
│   │   ├── DatePicker.tsx          # 日付選択（曜日検証付き）
│   │   ├── FileUpload.tsx          # ファイルアップロード（プレビュー付き）
│   │   ├── Button.tsx              # ボタンコンポーネント
│   │   ├── Card.tsx                # カードコンテナ
│   │   ├── Alert.tsx               # アラート表示
│   │   ├── Badge.tsx               # バッジ表示
│   │   ├── Separator.tsx           # 区切り線
│   │   ├── Skeleton.tsx            # ローディングスケルトン
│   │   ├── Toast.tsx               # トースト通知
│   │   └── LoadingSpinner.tsx      # ローディング表示
│   │
│   └── layout/
│       ├── Header.tsx               # ヘッダー
│       ├── Footer.tsx               # フッター
│       └── Container.tsx            # レスポンシブコンテナ
│
├── lib/
│   ├── constants/
│   │   ├── units.ts                # 10単会の定義
│   │   ├── prefectures.ts          # 都道府県リスト
│   │   ├── validation-rules.ts     # バリデーションルール
│   │   └── messages.ts             # メッセージ定数
│   │
│   ├── validations/
│   │   ├── schema.ts               # Zodスキーマ定義
│   │   ├── custom-validators.ts    # カスタムバリデーター
│   │   └── date-validator.ts       # 曜日バリデーション
│   │
│   ├── hooks/
│   │   ├── useFormPersist.ts      # LocalStorage永続化
│   │   ├── useZipcode.ts          # 郵便番号API連携
│   │   ├── useFileUpload.ts       # ファイルアップロード処理
│   │   ├── useGoogleDrive.ts      # Google Drive操作
│   │   └── useFormSubmit.ts       # フォーム送信処理
│   │
│   ├── services/
│   │   ├── google-drive.ts        # Google Drive APIクライアント
│   │   ├── google-sheets.ts       # Google Sheets APIクライアント
│   │   └── gas-client.ts          # GASエンドポイント通信
│   │
│   └── utils/
│       ├── format.ts               # フォーマット関数
│       ├── file.ts                 # ファイル処理ユーティリティ
│       ├── cn.ts                   # クラス名結合
│       └── api.ts                  # API通信ヘルパー
│
├── types/
│   ├── form.ts                     # フォームデータ型定義
│   ├── api.ts                      # APIレスポンス型
│   ├── google.ts                   # Google API関連型
│   └── unit.ts                     # 単会型定義
│
├── config/
│   └── google-api.ts               # Google API設定
│
├── public/
│   ├── favicon.ico
│   └── images/
│       └── logo.png                # 倫理法人会ロゴ
│
├── .env.local                      # 環境変数
├── next.config.js                  # Next.js設定
├── tailwind.config.ts              # Tailwind設定
├── tsconfig.json                   # TypeScript設定
└── package.json                    # 依存関係
```

## URL設計

```
ベースURL: https://form.shiga-rinri.com

ルーティング:
├── /                          # ランディング/リダイレクト
├── /otsu                     # 大津市倫理法人会
├── /otsu-minami             # 大津市南倫理法人会
├── /kusatsu                 # 草津市倫理法人会
├── /ritto                   # 栗東市倫理法人会
├── /moriyama                # 守山市倫理法人会
├── /omi-hachiman           # 近江八幡市倫理法人会
├── /koka                    # 甲賀市倫理法人会
├── /higashiomi              # 東近江市倫理法人会
├── /hikone                  # 彦根市倫理法人会
└── /nagahama                # 長浜市倫理法人会
```

## データフローアーキテクチャ

```
1. ユーザー入力
   ↓
2. クライアント側バリデーション
   ↓
3. ファイルアップロード（該当する場合）
   ├─→ プロフィール画像 → Google Drive → URL取得
   └─→ レジュメファイル → Google Drive → URL取得
   ↓
4. フォームデータ + ファイルURL
   ↓
5. GASエンドポイントへ送信
   ↓
6. GAS処理
   ├─→ Google Sheetsへ書き込み
   └─→ 確認レスポンス返却
   ↓
7. 完了画面表示
```

## Google統合詳細

### Google Drive フォルダ構造
```
/講師確認書ファイル/
├── /プロフィール画像/
│   └── {タイムスタンプ}_{単会スラッグ}_{講師名}.{拡張子}
└── /レジュメ/
    └── {タイムスタンプ}_{単会スラッグ}_{講師名}_レジュメ.{拡張子}
```

### Google Sheets 構造
```
列定義:
A: 送信日時
B: 単会名
C: 開催日
D: 講師名
E: 講師名（ふりがな）
F: 会社名/団体名
G: 役職・肩書
H: 所属倫理法人会
I: 倫理法人会役職
J: 郵便番号
K: 都道府県
L: 市区町村
M: 番地
N: 携帯電話
O: メールアドレス
P: テーマ
Q: サブテーマ
R: 内容
S: プロフィール
T: 倫理歴
U: プロフィール画像URL（Google Drive）
V: レジュメ種別
W: レジュメファイルURL（Google Drive）
X: プロジェクター使用
Y: デバイス
Z: デバイスOS
AA: ケーブル種別
AB: ホワイトボード使用
AC: 宿泊
AD: 写真撮影可否
AE: SNS投稿可否
AF: その他連絡事項
```

## API エンドポイント

### POST /api/upload
```typescript
// ファイルをGoogle Driveにアップロード
リクエスト: FormData（ファイル含む）
レスポンス: {
  success: boolean;
  fileUrl: string;    // Google Drive URL
  fileId: string;     // Google Drive ファイルID
  error?: string;
}
```

### POST /api/submit
```typescript
// フォームデータをGAS経由でSheetsに送信
リクエスト: {
  formData: FormData;
  profileImageUrl?: string;
  handoutFileUrl?: string;
}
レスポンス: {
  success: boolean;
  message: string;
  sheetRowId?: string;
  submissionId?: string;
}
```

### GET /api/zipcode?code={zipcode}
```typescript
// 郵便番号から住所を取得
レスポンス: {
  prefecture: string;
  city: string;
  town: string;
}
```

## Google API 設定

### 必要なAPI
1. Google Drive API v3
2. Google Sheets API v4
3. Google Apps Script API

### 認証方式
- サービスアカウント（サーバー側操作用）
- APIキー（必要に応じてクライアント側読み取り用）
- OAuth 2.0（将来的なユーザー固有操作用）

### 必要なスコープ
```
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/script.external_request
```

## 環境変数

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://form.shiga-rinri.com
NEXT_PUBLIC_GAS_ENDPOINT=https://script.google.com/macros/s/xxxxx/exec

# Google API認証情報（サーバー側のみ）
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_ID=xxxxxxxxxxxxx
GOOGLE_SHEETS_ID=xxxxxxxxxxxxx

# 外部API
NEXT_PUBLIC_ZIPCODE_API_URL=https://zipcloud.ibsnet.co.jp/api/search
```

## データモデル

```typescript
// ファイルURLを含む完全なフォームデータ構造
export interface FormData {
  seminarInfo: {
    unitName: string;        // 単会名
    unitSlug: string;        // URLスラッグ
    seminarDate: string;     // 開催日
    dayOfWeek: number;       // 曜日（0-6）
  };
  
  speakerInfo: {
    name: string;            // 講師名
    nameKana: string;        // ふりがな
    companyName: string;     // 会社名
    position?: string;       // 役職
    ethicsGroup?: string;    // 所属倫理法人会
    ethicsPosition?: string; // 倫理法人会役職
    address: {
      zipCode: string;       // 郵便番号
      prefecture: string;    // 都道府県
      city: string;          // 市区町村
      street: string;        // 番地
    };
    mobile: string;          // 携帯電話
    email: string;           // メールアドレス
  };
  
  speechInfo: {
    theme: string;           // テーマ（20文字以内）
    subTheme?: string;       // サブテーマ（30文字以内）
    content: string;         // 内容（240文字以内）
    profile: string;         // プロフィール（180文字以内）
    ethicsHistory?: string;  // 倫理歴（180文字以内）
    profileImageUrl?: string; // Google Drive URL
  };
  
  presentationStyle: {
    handout: 'bring' | 'none' | 'print';
    handoutFileUrl?: string;  // Google Drive URL
    projector: boolean;
    projectorDetails?: {
      device: 'bring' | 'prepare' | 'none';
      deviceOS?: 'Windows' | 'Mac' | 'iOS' | 'Android';
      cable?: 'HDMI' | 'VGA';
    };
    whiteboard: boolean;
  };
  
  accommodation: {
    stay: 'none' | 'smoking' | 'non-smoking';
    photography: boolean;
    sns: boolean;
    notes?: string;          // その他連絡事項（500文字以内）
  };
}
```

## セキュリティ考慮事項

### ファイルアップロードセキュリティ
- ファイルサイズ制限（画像5MB、文書10MB）
- ファイルタイプ検証（ホワイトリスト方式）
- ウイルススキャン（Google Drive経由）
- ユニークなファイル名で上書き防止

### APIセキュリティ
- アップロードエンドポイントのレート制限
- CORS設定
- 入力値の検証とサニタイゼーション
- 認証情報の安全な保管

### データプライバシー
- クライアントサイドに機密情報を含めない
- HTTPS通信の強制
- 内部情報を漏らさないエラーハンドリング
- Google Drive内の古いファイルの定期削除

## パフォーマンス最適化

### ファイルアップロード最適化
- クライアント側での画像圧縮
- プログレス表示付きアップロード
- 大きなファイルのチャンク分割
- 失敗時のリトライ機構

### フォームパフォーマンス
- セクションの遅延読み込み
- デバウンス処理されたバリデーション
- 楽観的UIアップデート
- LocalStorageでの下書き保存

## エラーハンドリング戦略

### ファイルアップロードエラー
- ネットワークエラー → 指数バックオフでリトライ
- サイズ超過 → 明確なユーザーフィードバック
- 無効なファイルタイプ → 即座の検証
- Google Driveエラー → 直接送信へのフォールバック

### フォーム送信エラー
- バリデーションエラー → インライン表示
- ネットワークエラー → リトライオプション
- サーバーエラー → ユーザーフレンドリーなメッセージ
- 部分的成功 → 明確な状態表示

## デプロイメントアーキテクチャ

### フロントエンドデプロイ
- プラットフォーム: Vercel / Netlify
- ビルド: 可能な限りStatic Generation
- CDN: CloudFlare（アセット配信）

### バックエンドサービス
- Google Apps Script: Web Appとしてデプロイ
- Google APIs: サービスアカウント使用
- 環境: 本番/ステージング分離

## モニタリング＆ログ

### クライアント側
- Reactエラーのエラーバウンダリ
- 開発環境でのコンソールログ
- ユーザーアクショントラッキング（プライバシー準拠）

### サーバー側
- Google Apps Scriptログ
- APIコールモニタリング
- 管理者へのエラー通知

## 将来の拡張計画

### Phase 2
- 送信時のメール通知
- 管理者ダッシュボード
- 一括アップロード機能
- OCR文書スキャン

### Phase 3
- 多言語対応
- モバイルアプリ版
- 分析ダッシュボード
- AI活用機能