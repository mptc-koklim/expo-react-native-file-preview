#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(QuickLookPreview, NSObject)
RCT_EXTERN_METHOD(open:(NSString *)filePath)
@end
