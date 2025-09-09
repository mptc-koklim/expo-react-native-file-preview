import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="PDF with React native PDF" onPress={() => router.push('/pdf')}/>
      <Button title="PDF with WebView" onPress={() => router.push('/webview-pdf')}/>
      <Button title="PDF with file sharing" onPress={() => router.push('/file-sharing')}/>
      <Button title="PDF with Google Drive" onPress={() => router.push('/google-drive')}/>
      <Button title="PDF with iOS Quick Look" onPress={() => router.push('/ios-quicklook')}/>
    </View>
  );
}
