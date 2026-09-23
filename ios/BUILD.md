# iOS build — VRCX Mobile 2.0.0

On a Mac with Xcode, install dependencies and regenerate web assets before opening the project:

```sh
npm ci
npm run ios:prepare
```

Open `ios/App/App.xcodeproj`, select the shared `App` scheme, and choose your own signing team.
Use Run for a device/simulator, or Product > Archive for distribution.

Capacitor 8.3.0 uses Swift Package Manager. The native `ExternalBrowser` plugin is compiled into the App target.
Preferences preserve settings and saved logins. As in v1, SQLite is not connected on iOS;
local history and other SQLite-backed features remain limited.

Only the web build and Capacitor sync were verified on Windows. Xcode compilation, signing,
and device behavior have not been verified. See `../MOBILE_UPGRADE_JA.md` for the full validation record.
