import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Platform, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

const PDF_URL = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
const FILE_NAME = "native-sample.pdf";

export default function FileSharingScreen() {
  const [localFile, setLocalFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const fileUri = FileSystem.cacheDirectory + FILE_NAME;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
          console.log("Downloading file for native viewer...");
          await FileSystem.downloadAsync(PDF_URL, fileUri);
        }

        setLocalFile(fileUri);
      } catch (err) {
        console.error("Download error:", err);
      } finally {
        setLoading(false);
      }
    };

    downloadFile();
  }, []);

  const openNative = async () => {
    if (!localFile) return;

    if (Platform.OS === "android") {
      // Open with Google Drive or default PDF viewer
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: localFile,
          flags: 1,
          type: "application/pdf",
        });
      } catch (e) {
        console.log("Fallback to sharing…", e);
        await Sharing.shareAsync(localFile);
      }
    } else {
      // iOS – use share sheet (opens in Files/Preview/Drive if installed)
      await Sharing.shareAsync(localFile);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Preparing file…</Text>
      </View>
    );
  }

  if (!localFile) {
    return (
      <View style={styles.center}>
        <Text>Failed to prepare file</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text>PDF ready for native viewer</Text>
      <Button title="Open in Native Viewer" onPress={openNative} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
