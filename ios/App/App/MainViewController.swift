import UIKit
import Capacitor

@objc(ExternalBrowserPlugin)
final class ExternalBrowserPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "ExternalBrowserPlugin"
    let jsName = "ExternalBrowser"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "open", returnType: CAPPluginReturnPromise)
    ]

    @objc func open(_ call: CAPPluginCall) {
        guard let value = call.getString("url"),
              let url = URL(string: value),
              let scheme = url.scheme?.lowercased(),
              ["http", "https"].contains(scheme) else {
            call.reject("Only HTTP(S) URLs can be opened externally.")
            return
        }

        DispatchQueue.main.async {
            UIApplication.shared.open(url, options: [:]) { completed in
                if completed {
                    call.resolve(["completed": true])
                } else {
                    call.reject("No browser is available to open this URL.")
                }
            }
        }
    }
}

final class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        bridge?.registerPluginInstance(ExternalBrowserPlugin())
    }
}
