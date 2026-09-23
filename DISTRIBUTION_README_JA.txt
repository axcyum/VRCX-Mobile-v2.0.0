VRCX Mobile 2.0.0 ソースパッケージ
================================

本家ベース: VRCX 2026.09.16
Android / iOS のソースを収録しています。
このソースと同じ配布フォルダには、署名済みdebug APKと未署名release APKを生成しています。
IPAは .github/workflows/build-ios-ipa.yml をGitHub Actionsで実行して生成します。

更新内容、ビルド方法、検証結果、既存の制限:
  MOBILE_UPGRADE_JA.md
本家ソースのバージョン・コミット:
  UPSTREAM_VERSION.json
ライセンス:
  LICENSE

依存パッケージ、ビルド済みアセット、認証情報、署名鍵は同梱していません。
まず npm ci を実行し、対象 OS の prepare スクリプトで同期してください。

非公式モバイルフォークです。改修には AI 支援コーディングが含まれます。
VRCX Team / VRChat Inc. による保証・サポートはありません。
