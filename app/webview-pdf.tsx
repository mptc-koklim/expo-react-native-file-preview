// screens/WebViewOfficeScreen.tsx
import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewOfficeScreen() {
  const pdfUrl = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
  const docUrl = "https://docs.google.com/viewer?url=" + encodeURIComponent(pdfUrl) + "&embedded=true";

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: docUrl }}
        style={styles.webview}
        onError={(e) => console.log("WebView error:", e.nativeEvent)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 25 },
  webview: { flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height },
});
