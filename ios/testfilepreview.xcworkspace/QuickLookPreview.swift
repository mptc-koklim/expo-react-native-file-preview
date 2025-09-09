import QuickLook
import UIKit

@objc(QuickLookPreview)
class QuickLookPreview: NSObject, QLPreviewControllerDataSource {

  var fileUrl: URL?

  @objc
  func open(_ filePath: String) {
    // Fix URL initialization
    let url = URL(string: filePath) ?? URL(fileURLWithPath: filePath)
    self.fileUrl = url

    DispatchQueue.main.async {
      let previewController = QLPreviewController()
      previewController.dataSource = self

      // Fix deprecated keyWindow usage for iOS 13+
      if let root = UIApplication.shared.connectedScenes
          .compactMap({ $0 as? UIWindowScene })
          .flatMap({ $0.windows })
          .first(where: { $0.isKeyWindow })?.rootViewController {
        root.present(previewController, animated: true, completion: nil)
      }
    }
  }

  // MARK: QLPreviewControllerDataSource
  func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
    return fileUrl != nil ? 1 : 0
  }

  func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
    return fileUrl! as QLPreviewItem
  }
}
