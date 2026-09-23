# VRCX Mobile 2.0.0 更新記録

## 更新内容

- 本家 VRCX **2026.09.16** のソースを統合しました。バージョン表示だけの変更ではありません。
- 取得元: https://github.com/vrcx-team/VRCX/releases/tag/v2026.09.16
- 本家コミット: `1bf052f84c670b96bfe44156e097eb668ae78de7`
- Android: `versionName 2.0.0` / `versionCode 2`
- iOS: `MARKETING_VERSION 2.0.0` / `CURRENT_PROJECT_VERSION 2`
- npm パッケージ、アプリ内のネイティブバージョン応答、User-Agent を 2.0.0 に更新しました。
- `Version` は本家ベースを示す `2026.09.16` として保持しています。
- プロフィール装飾、各種ダイアログの再設計、グループ・イベント編集、プリントのお気に入りなど、本家の更新コードを取り込みました。端末上での全機能検証は未実施です。
- 認証 Cookie、Preferences の保存キー、Android の SQLite データベース名、アプリ ID を維持しました。
- 新しいダイアログにスマートフォン向けの縦配置を追加し、既存のカード表示、モバイルヘッダー、外部ブラウザー連携を移植しました。
- 外部リンクの新しい確認画面で、ネイティブブラウザー起動失敗を通知する処理を維持しました。
- Android / iOS では本家デスクトップ用の自動更新・更新画面を無効にしました。
- Windows で iOS 同期を実行した場合も Swift Package Manager の相対パスを macOS で使える形式に補正します。
- Capacitor は元の 8.3.0、SQLite プラグインは 8.0.1、Preferences は 8.0.1 に固定しました。

元ソースの `Version` は 2026.02.11 でしたが、内容には3月の本家変更も含まれていました。
1158ファイルが一致した3月26日のコミット `1a7f9ca95274e33b2ec64336a2a3bfc1f435376f` を比較基準にし、
67ファイルのモバイル差分と独自追加ファイルを新版へ移植しました。
元の `VRCX-Mobile-Source-v1.0.0` および既存 APK / IPA は変更していません。

## 検証結果

Windows / Node.js 26.7.0 / npm 11.19.0 で確認しました。

- `npm run android:prepare`: 成功（Web ビルド、ライセンス生成、Capacitor Android 同期）。
- `npm run ios:prepare`: 成功（Web ビルド、ライセンス生成、Capacitor iOS 同期）。
- `npm run lint`: エラーなし。本家由来の未使用引数の警告1件あり。
- モバイル回帰テスト: 6ファイル、32テスト成功。保存済み設定・Cookie、ネイティブ連携、外部リンク、デスクトップ更新の無効化を確認。
- 全体テスト: 1964成功 / 166失敗。公式タグを同じ環境で実行した結果は1954成功 / 166失敗で、失敗したテストの集合は一致しました。新しいモバイルブリッジ6テストはこの全体比較の後に追加し、上記回帰テストで確認済みです。
- 本家側の166件の失敗および3件の未処理非同期エラーは残っています。全テスト合格とはしていません。

## ビルド方法

ソース ZIP は依存パッケージと生成済み Web アセットを省いています。展開後に準備してください。
Node.js は `package.json` の engines を満たすバージョンを使います。

```sh
npm ci
npm run android:prepare
```

Android は JDK 21 と Android SDK（API 36 / プロジェクトに必要な build-tools）が必要です。
`ANDROID_HOME` または `android/local.properties` で SDK の場所を指定してください。

```powershell
cd android
.\gradlew.bat assembleRelease
```

署名済みリリースには次の環境変数または Gradle プロパティを設定します。
`VRCX_RELEASE_STORE_FILE`、`VRCX_RELEASE_STORE_PASSWORD`、`VRCX_RELEASE_KEY_ALIAS`、`VRCX_RELEASE_KEY_PASSWORD`。
v1.0.0 への上書きインストールには同じ署名鍵が必要です。鍵は同梱していません。

iOS は Mac と Xcode で次を実行し、`ios/App/App.xcodeproj` を開いてビルドします。

```sh
npm ci
npm run ios:prepare
```

実機配布は自身の Apple 開発チームと署名設定で行ってください。

モバイル回帰テストの再実行:

```sh
npx vitest run src/plugins/__tests__/mobileInterop.test.js src/services/__tests__/configNative.test.js src/shared/utils/__tests__/appActions.test.js src/shared/utils/__tests__/urlText.test.js src/stores/__tests__/vrcxUpdater.test.js src/components/__tests__/OpenExternalLinkDialog.test.js
```

## 生成済みAndroid APK

2026-09-24にJDK 21、Android SDK 36、Gradle 8.14.3でビルドしました。

- `VRCX-Mobile-Android-v2.0.0-debug.apk`: Android debug鍵で署名済み。新規インストールして動作確認できます。
- `VRCX-Mobile-Android-v2.0.0-release-unsigned.apk`: Releaseビルドですが未署名です。配布前にv1.0.0と同じRelease鍵で署名してください。

v1.0.0 APKの署名証明書SHA-256は
`28506985759918d6b9a10339e5827745e50924788c37107df6834b55b1417737` です。
今回のdebug APKは別のdebug証明書なので、v1.0.0へ上書きインストールできません。

## GitHub Actionsによる未署名IPA

`.github/workflows/build-ios-ipa.yml` を追加しました。GitHubリポジトリへソースを置いた後、
Actionsの「Build unsigned iOS IPA」を手動実行するか、`v*`タグをpushすると、macOS 15 / Xcodeで
`VRCX-Mobile-iOS-v2.0.0-unsigned.ipa` とSHA-256ファイルがArtifactに保存されます。

独立した非公開リポジトリ `axcyum/VRCX-Mobile-v2.0.0` で実行し、未署名IPAの生成に成功しました。
本リポジトリはforkではなく、本家VRCXのremote・parent・Workflowは登録していません。
生成されるIPAは未署名です。インストール前に自身のApple IDまたは証明書で署名してください。

## 未検証・既存の制限

- APKはWindows上で生成しました。IPAはGitHub Actions run `35888326460` で生成・ダウンロードし、SHA-256を照合しました。
- 実機でのログイン、v1.0.0 からのデータ移行、新しい画面の操作は未確認です。回帰テストのネイティブ API はモックです。
- iOS の SQLite は元版から未接続です。設定・保存ログインは Preferences を使いますが、SQLite に依存するローカル履歴・お気に入りなどには従来の制限が残ります。
- Desktop / VR 連携のネイティブ機能は、元モバイル版と同じく未実装のものがあります。
- 元版の生成済みデバッグログは更新版ソースに含めていません。

本ソフトウェアは VRCX Team / VRChat Inc. の公式モバイルアプリではありません。
ライセンスは同梱の LICENSE および生成される第三者ライセンス情報を参照してください。
