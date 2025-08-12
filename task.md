# 講師確認書フォーム - Claude Code実装タスク

## 実装前提条件
- Node.js 18以上インストール済み
- 作業ディレクトリ準備完了
- Google Cloud Console でプロジェクト作成済み
- サービスアカウント作成済み

## TASK-001: プロジェクト初期化
**目的**: Next.jsプロジェクトの作成と基本設定
**コマンド**:
```bash
npx create-next-app@latest koushi-form --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd koushi-form
```
**完了条件**: `npm run dev`でアプリ起動確認

## TASK-002: 必須パッケージインストール
**目的**: 必要なライブラリのインストール
**コマンド**:
```bash
npm install react-hook-form@latest zod @hookform/resolvers
npm install date-fns lucide-react clsx tailwind-merge
npm install @radix-ui/react-label @radix-ui/react-select 
npm install @radix-ui/react-checkbox @radix-ui/react-radio-group
npm install react-dropzone axios
npm install googleapis google-auth-library
```
**完了条件**: package.jsonに全パッケージが追加される

## TASK-003: ディレクトリ構造作成
**目的**: プロジェクト構造の構築
**コマンド**:
```bash
mkdir -p app/api/{submit,upload,zipcode}
mkdir -p app/[slug]
mkdir -p components/{form,ui,layout}
mkdir -p lib/{constants,validations,hooks,services,utils}
mkdir -p types config public/images
```
**完了条件**: 全ディレクトリが作成される

## TASK-004: 環境変数設定
**目的**: Google API認証情報の設定
**ファイル**: `.env.local`
```env
NEXT_PUBLIC_APP_URL=https://form.shiga-rinri.com
NEXT_PUBLIC_GAS_ENDPOINT=https://script.google.com/macros/s/xxxxx/exec
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_ID=xxxxxxxxxxxxx
GOOGLE_SHEETS_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_ZIPCODE_API_URL=https://zipcloud.ibsnet.co.jp/api/search
```
**完了条件**: 環境変数ファイルが作成される

## TASK-005: TypeScript型定義（基本）
**目的**: フォームデータの型定義
**ファイル**: `types/form.ts`
**内容**:
- FormData インターフェース
- SeminarInfo, SpeakerInfo, SpeechInfo型
- PresentationStyle, Accommodation型
**完了条件**: TypeScriptエラーなし

## TASK-006: TypeScript型定義（Google/API）
**目的**: Google APIとレスポンスの型定義
**ファイル**: `types/google.ts`, `types/api.ts`, `types/unit.ts`
**内容**:
- Google Drive/Sheets型定義
- APIレスポンス型
- Unit型定義
**完了条件**: 型定義が正しくエクスポートされる

## TASK-007: 定数定義（単会）
**目的**: 10単会の情報定義
**ファイル**: `lib/constants/units.ts`
**内容**:
- 10単会の名前、スラッグ、開催曜日
- 曜日名配列
- ヘルパー関数
**完了条件**: 単会情報が正しく定義される

## TASK-008: 定数定義（その他）
**目的**: アプリケーション定数の定義
**ファイル**: 
- `lib/constants/prefectures.ts`
- `lib/constants/validation-rules.ts`
- `lib/constants/messages.ts`
**完了条件**: すべての定数が定義される

## TASK-009: Google API設定
**目的**: Google APIクライアントの設定
**ファイル**: `config/google-api.ts`
**内容**:
- サービスアカウント認証設定
- Drive/Sheets APIクライアント初期化
**完了条件**: 認証が成功する

## TASK-010: Google Driveサービス実装
**目的**: ファイルアップロード機能
**ファイル**: `lib/services/google-drive.ts`
**機能**:
- ファイルアップロード
- フォルダ作成
- URLの生成
**完了条件**: ファイルがDriveにアップロードされる

## TASK-011: Google Sheetsサービス実装
**目的**: スプレッドシート書き込み機能
**ファイル**: `lib/services/google-sheets.ts`
**機能**:
- 行の追加
- データフォーマット
**完了条件**: Sheetsにデータが書き込まれる

## TASK-012: GASクライアント実装
**目的**: GASエンドポイント通信
**ファイル**: `lib/services/gas-client.ts`
**機能**:
- データ送信
- エラーハンドリング
**完了条件**: GASと通信できる

## TASK-013: バリデーションスキーマ作成
**目的**: Zodによるフォーム検証
**ファイル**: 
- `lib/validations/schema.ts`
- `lib/validations/custom-validators.ts`
- `lib/validations/date-validator.ts`
**完了条件**: バリデーションが正しく動作する

## TASK-014: ユーティリティ関数作成
**目的**: 共通処理関数
**ファイル**:
- `lib/utils/format.ts`
- `lib/utils/file.ts`
- `lib/utils/cn.ts`
- `lib/utils/api.ts`
**完了条件**: 各関数が正しく動作する

## TASK-015: Input コンポーネント
**目的**: テキスト入力コンポーネント
**ファイル**: `components/ui/Input.tsx`
**機能**: 文字数カウンター、エラー表示
**完了条件**: 文字数が表示される

## TASK-016: TextArea コンポーネント
**目的**: 複数行入力コンポーネント
**ファイル**: `components/ui/TextArea.tsx`
**機能**: 自動高さ調整、改行対応
**完了条件**: 改行が正しく処理される

## TASK-017: Select コンポーネント
**目的**: ドロップダウン選択
**ファイル**: `components/ui/Select.tsx`
**機能**: 都道府県選択等
**完了条件**: 選択が正しく動作する

## TASK-018: RadioGroup コンポーネント
**目的**: ラジオボタングループ
**ファイル**: `components/ui/RadioGroup.tsx`
**完了条件**: 単一選択が動作する

## TASK-019: DatePicker コンポーネント
**目的**: 日付選択コンポーネント
**ファイル**: `components/ui/DatePicker.tsx`
**機能**: 曜日表示、バリデーション
**完了条件**: 曜日が正しく表示される

## TASK-020: FileUpload コンポーネント
**目的**: ファイルアップロードUI
**ファイル**: `components/ui/FileUpload.tsx`
**機能**: 
- ドラッグ&ドロップ
- プレビュー表示
- Google Driveアップロード連携
**完了条件**: ファイルがプレビュー表示される

## TASK-021: その他UIコンポーネント
**目的**: 補助UIコンポーネント
**ファイル**:
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Alert.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Separator.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/Toast.tsx`
- `components/ui/LoadingSpinner.tsx`
**完了条件**: 各コンポーネントが表示される

## TASK-022: レイアウトコンポーネント
**目的**: 共通レイアウト
**ファイル**:
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/Container.tsx`
**完了条件**: レスポンシブ対応確認

## TASK-023: ルートレイアウト作成
**目的**: アプリ全体のレイアウト
**ファイル**: `app/layout.tsx`
**機能**: メタデータ、フォント設定
**完了条件**: 全ページで適用される

## TASK-024: 動的ルーティングページ
**目的**: 単会別フォームページ
**ファイル**: `app/[slug]/page.tsx`
**機能**: スラッグ検証、404処理
**完了条件**: /otsu等でアクセスできる

## TASK-025: ファイルアップロードフック
**目的**: Google Drive連携フック
**ファイル**: `lib/hooks/useFileUpload.ts`
**機能**:
- ファイルをGoogle Driveにアップロード
- URL取得
- エラーハンドリング
**完了条件**: ファイルがDriveに保存される

## TASK-026: アップロードAPIルート
**目的**: ファイルアップロードエンドポイント
**ファイル**: `app/api/upload/route.ts`
**機能**: Google Drive APIを使用したアップロード
**完了条件**: POSTでファイルアップロード成功

## TASK-027: SeminarInfoセクション
**目的**: モーニングセミナー情報入力
**ファイル**: `components/form/SeminarInfo.tsx`
**機能**: 単会自動選択、曜日検証
**完了条件**: 曜日違いでエラー表示

## TASK-028: SpeakerBasicInfo（前半）
**目的**: 講師基本情報（名前・会社）
**ファイル**: `components/form/SpeakerBasicInfo.tsx`
**機能**: 名前、ふりがな、会社情報入力
**完了条件**: ひらがなバリデーション動作

## TASK-029: 郵便番号API実装
**目的**: 住所自動入力
**ファイル**: 
- `app/api/zipcode/route.ts`
- `lib/hooks/useZipcode.ts`
**完了条件**: 郵便番号で住所自動入力

## TASK-030: SpeakerBasicInfo（完成）
**目的**: 講師基本情報完成
**機能**: 住所2カラム表示、連絡先
**完了条件**: 郵便番号連携動作

## TASK-031: SpeechInfo（テキスト部分）
**目的**: 講話情報テキスト入力
**ファイル**: `components/form/SpeechInfo.tsx`
**機能**: テーマ、内容、プロフィール
**完了条件**: 文字数制限動作

## TASK-032: SpeechInfo（画像アップロード）
**目的**: プロフィール画像アップロード
**機能**: 
- 画像選択
- Google Driveアップロード
- URL保存
**完了条件**: 画像URLが取得できる

## TASK-033: PresentationStyle（基本）
**目的**: 登壇形式基本選択
**ファイル**: `components/form/PresentationStyle.tsx`
**機能**: レジュメ、プロジェクター選択
**完了条件**: 選択が動作する

## TASK-034: PresentationStyle（条件付き表示）
**目的**: 条件による項目表示制御
**機能**: 
- レジュメ選択時のファイルアップロード
- プロジェクター選択時の詳細
**完了条件**: 条件に応じて表示切替

## TASK-035: Accommodationセクション
**目的**: 宿泊・その他情報
**ファイル**: `components/form/Accommodation.tsx`
**完了条件**: 全項目入力可能

## TASK-036: FormContainer（状態管理）
**目的**: フォーム全体制御
**ファイル**: `components/form/FormContainer.tsx`
**機能**: 各セクションの状態管理
**完了条件**: データが保持される

## TASK-037: LocalStorage永続化
**目的**: 入力内容の自動保存
**ファイル**: `lib/hooks/useFormPersist.ts`
**完了条件**: リロード後もデータ残存

## TASK-038: 確認モーダル実装
**目的**: 送信前確認
**ファイル**: `components/form/ConfirmationModal.tsx`
**機能**: 入力内容プレビュー
**完了条件**: 全内容が確認できる

## TASK-039: 送信API実装
**目的**: データ送信エンドポイント
**ファイル**: `app/api/submit/route.ts`
**機能**: 
- ファイルURL含むデータ整形
- Google Sheets書き込み
**完了条件**: Sheetsにデータ保存

## TASK-040: 送信処理フック
**目的**: 送信処理の抽象化
**ファイル**: `lib/hooks/useFormSubmit.ts`
**機能**: ローディング、エラー、リトライ
**完了条件**: 送信成功通知表示

## TASK-041: FormContainer（送信統合）
**目的**: フォーム完成
**機能**: 送信処理統合
**完了条件**: 一連の流れが動作

## TASK-042: エラーハンドリング
**目的**: エラー処理実装
**ファイル**: 
- `app/error.tsx`
- `app/not-found.tsx`
**完了条件**: エラー画面表示

## TASK-043: トースト通知実装
**目的**: ユーザーフィードバック
**ファイル**: `lib/hooks/useToast.ts`
**完了条件**: 通知が表示される

## TASK-044: レスポンシブ対応
**目的**: モバイル最適化
**内容**: 各コンポーネントのスタイル調整
**完了条件**: スマホで正しく表示

## TASK-045: デザイン調整
**目的**: ビジュアル改善
**内容**: 
- カラーパレット適用
- 統一感のあるデザイン
**完了条件**: プロフェッショナルな見た目

## TASK-046: パフォーマンス最適化
**目的**: 表示速度改善
**内容**: 
- 動的インポート
- メモ化
- 画像最適化
**完了条件**: Lighthouse改善

## TASK-047: Google Drive権限設定
**目的**: フォルダ権限の設定
**内容**: 
- アップロードフォルダ作成
- 権限設定
**完了条件**: ファイル保存成功

## TASK-048: テストデータ作成
**目的**: 動作確認用データ
**内容**: 各単会のテストデータ
**完了条件**: テスト送信成功

## TASK-049: 最終動作確認
**目的**: 全機能の統合テスト
**内容**: 
- 全単会でのテスト
- ファイルアップロード確認
- Sheets書き込み確認
**完了条件**: すべて正常動作

## TASK-050: デプロイ準備
**目的**: 本番環境準備
**内容**: 
- 環境変数設定
- ビルド確認
- デプロイ設定
**完了条件**: デプロイ可能状態

## 実装の重要ポイント

### Google API統合の流れ
1. サービスアカウント認証設定（TASK-009）
2. Drive/Sheetsサービス実装（TASK-010-011）
3. アップロードフック実装（TASK-025）
4. APIルート実装（TASK-026, 039）

### ファイル処理の流れ
1. FileUploadコンポーネント（TASK-020）
2. Google Driveアップロード（TASK-025-026）
3. URL取得と保存（TASK-032, 034）
4. Sheetsへの記録（TASK-039）

### データフローの統合
1. 各セクションでデータ収集
2. ファイルはDriveにアップロード
3. URLを含むデータをSheetsに保存
4. 完了通知表示