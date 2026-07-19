import UIKit
import Capacitor
import WebKit

/// SpeekZone renders every screen's safe-area padding itself via CSS
/// `env(safe-area-inset-*)` (see `capacitor.config.ts`'s `contentInset: 'never'`
/// and `src/index.css`). That config key only controls the *legacy*
/// `automaticallyAdjustsScrollViewInsets` flag — it does **not** reliably
/// propagate to `UIScrollView.contentInsetAdjustmentBehavior`, which is the
/// property WKWebView's internal scroll view actually uses for hit-testing on
/// modern iOS. When that property is left at its default (`.automatic`), the
/// scroll view silently applies its *own* safe-area adjustment on top of the
/// page's CSS padding. The two disagree, so content paints in the place the
/// CSS put it, but native touch hit-testing is computed against the scroll
/// view's separately-adjusted frame — taps land on nothing.
///
/// This mismatch grows with the size of a device's safe-area insets (Dynamic
/// Island / larger status bar), which is why it reproduces more reliably on
/// newer, larger-inset hardware and can look "randomly" isolated to whichever
/// screen the reviewer happened to scroll furthest on (Profile, here).
///
/// Fix: explicitly force `contentInsetAdjustmentBehavior = .never` on the
/// bridge's web view so the native scroll frame and the CSS-painted frame are
/// always computed from the same source of truth.
class MainViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.scrollView.contentInsetAdjustmentBehavior = .never
        webView?.scrollView.automaticallyAdjustsScrollIndicatorInsets = false
    }
}
