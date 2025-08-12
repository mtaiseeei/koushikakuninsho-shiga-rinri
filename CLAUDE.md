# CLAUDE.md

以下のドキュメントを参照して、講師確認書統一システムのMVPを実装してください。

## 参照ドキュメント

1. **form.md** - フォーム項目の詳細仕様
2. **claude.md** - プロジェクト全体の概要と目的
3. **architecture.md** - 詳細なシステム設計とファイル構造
4. **tasks.md** - 50個の実装タスク（TASK-001〜TASK-050）
5. **design.md** - デザイン仕様書（カラー、タイポグラフィ、コンポーネント）
6. **初期実装コード** - 型定義とGoogle API連携の基本実装

## 実装要件

### 基本要件
- URL: https://form.shiga-rinri.com/[単会スラッグ]
- 10単会対応（otsu, otsu-minami, kusatsu, ritto, moriyama, omi-hachiman, koka, higashiomi, hikone, nagahama）
- ファイルはGoogle Driveに保存、データはGoogle Sheetsに記録
- レスポンシブデザイン（スマートフォン対応必須）

### 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Google Drive API v3
- Google Sheets API v4
- Google Apps Script（データ処理用）

### Google統合
- プロフィール画像とレジュメファイルをGoogle Driveに保存
- ファイルURLをGoogle Sheetsに記録
- サービスアカウント認証使用

## 実装手順

### Step 1: 初期セットアップ（TASK-001〜004）
```bash
# プロジェクト作成
npx create-next-app@latest koushi-form --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# パッケージインストール
npm install react-hook-form zod @hookform/resolvers date-fns lucide-react clsx tailwind-merge
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-radio-group
npm install react-dropzone axios googleapis google-auth-library

# ディレクトリ構造作成
mkdir -p app/api/{submit,upload,zipcode} app/[slug]
mkdir -p components/{form,ui,layout}
mkdir -p lib/{constants,validations,hooks,services,utils}
mkdir -p types config public/images
```

### Step 2: 環境変数設定（TASK-004）
`.env.local`ファイルを作成し、以下を設定：
```env
NEXT_PUBLIC_APP_URL=https://form.shiga-rinri.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SHEETS_ID=
```

### Step 3: 型定義とGoogle API設定（TASK-005〜012）
初期実装コードを参考に以下を作成：
- types/form.ts, google.ts, api.ts
- config/google-api.ts
- lib/services/google-drive.ts
- lib/services/google-sheets.ts

### Step 4: UIコンポーネント作成（TASK-015〜022）
基本UIコンポーネントを作成：
- Input.tsx（文字数カウンター付き）
- TextArea.tsx（改行対応、文字数表示）
- Select.tsx（都道府県選択等）
- DatePicker.tsx（曜日バリデーション）
- FileUpload.tsx（Google Drive連携）

### Step 5: フォームセクション実装（TASK-027〜035）
各セクションコンポーネントを作成：
1. SeminarInfo.tsx - 単会自動選択、曜日チェック
2. SpeakerBasicInfo.tsx - 2カラム住所入力、郵便番号API
3. SpeechInfo.tsx - 文字数制限、画像アップロード
4. PresentationStyle.tsx - 条件付き表示
5. Accommodation.tsx - 宿泊、撮影許可等

### Step 6: 統合とAPI実装（TASK-036〜041）
- FormContainer.tsx - 全体制御
- /api/upload/route.ts - ファイルアップロード
- /api/submit/route.ts - データ送信
- useFileUpload.ts - アップロードフック
- useFormSubmit.ts - 送信処理

### Step 7: 仕上げ（TASK-042〜050）
- エラーハンドリング
- レスポンシブ対応
- デザイン調整
- テスト実施

## 重要な実装ポイント

### 1. URLによる単会判定
```typescript
// app/[slug]/page.tsx
const unit = UNITS[params.slug];
if (!unit) return notFound();
```

### 2. 曜日バリデーション
```typescript
const selectedDay = new Date(date).getDay();
if (selectedDay !== unit.dayOfWeek) {
  setError('選択された日付は開催曜日と異なります');
}
```

### 3. ファイルアップロード
```typescript
// Google Driveにアップロード → URL取得
const fileUrl = await uploadFile(file);
// FormDataにURLを含める
formData.speechInfo.profileImageUrl = fileUrl;
```

### 4. 条件付き表示（重要）
```jsx
// プロジェクター「使用しない」の場合のみ追加項目表示
{formData.presentationStyle.projector === 'not-use' && (
  <>
    <RadioGroup 
      label="スライド投影用のデバイス"
      options={[
        { value: 'bring', label: '使用する（ご持参）' },
        { value: 'prepare', label: '使用する（当単会で準備）' },
        { value: 'none', label: '使用しない' }
      ]}
    />
    {formData.presentationStyle.projectorDetails?.device !== 'none' && (
      <>
        <Select label="デバイスのOS" options={['Windows', 'Mac', 'iOS', 'Android']} />
        <RadioGroup label="スライド投影出力ケーブル" options={['HDMI', '15ピン']} />
      </>
    )}
  </>
)}

// レジュメ「あり（当単会でプリント）」の場合のみアップロード表示
{formData.presentationStyle.handout === 'print' && (
  <FileUpload label="レジュメファイル" />
)}
```

### 5. 住所入力の3カラム表示
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Input label="郵便番号" />
  <Select label="都道府県" />
  <Input label="市区町村" />
</div>
```

### 5. 条件付き表示
```jsx
{formData.presentationStyle.handout === 'print' && (
  <FileUpload label="レジュメファイル" />
)}
```

## UI/UXガイドライン

### デザインテーマ
- **基調色**: 白地に青のグラデーション
- **印象**: 上質・高品質・清潔感・信頼感
- **スタイル**: モダンでプロフェッショナル

### カラーパレット（Tailwind CSS）
```jsx
// プライマリグラデーション
className="bg-gradient-to-r from-indigo-500 to-blue-600"

// セクションカード
className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow"

// 入力フィールド
className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"

// プライマリボタン
className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
```

### レイアウト
- 単一ページスクロール型
- セクションごとにカード分割
- 明確な区切りと余白

### カラー
- プライマリ: 青系（#3B82F6）
- エラー: 赤系（#EF4444）
- 成功: 緑系（#10B981）

### レスポンシブ
- モバイル: 1カラム
- タブレット: 一部2カラム
- デスクトップ: 最適な配置

## テスト項目

1. 全10単会のURLでアクセス可能
2. 曜日バリデーションが正しく動作
3. ファイルがGoogle Driveに保存される
4. データがGoogle Sheetsに記録される
5. スマートフォンで正しく表示・入力可能
6. エラー時の適切なフィードバック

## 実装優先順位

### 必須（MVP）
- [ ] 基本的なフォーム機能
- [ ] Google Drive/Sheetsへの保存
- [ ] 単会別URL対応
- [ ] レスポンシブ対応

### 重要（MVP後すぐ）
- [ ] 郵便番号自動入力
- [ ] 入力内容の一時保存
- [ ] プレビュー機能

### あると良い（将来）
- [ ] メール通知
- [ ] 管理画面
- [ ] 統計機能

## 開始コマンド

```bash
# タスクを順番に実行
Execute TASK-001 # プロジェクト初期化
Execute TASK-002 # パッケージインストール
Execute TASK-003 # ディレクトリ構造作成
# ... 以降、tasks.mdの順番で実行
```

これらの情報を基に、講師確認書統一システムのMVPを実装してください。不明な点があれば質問してください。