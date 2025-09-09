import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import Pdf from "react-native-pdf";
import { Menu, Provider } from "react-native-paper";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PDF_URL = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
const FILE_NAME = "sample.pdf";

export default function PdfScreen() {
  const [localFile, setLocalFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const downloadAndCache = async () => {
      try {
        const fileUri = FileSystem.cacheDirectory + FILE_NAME;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          setLocalFile(fileUri);
          setLoading(false);
          return;
        }
        const { uri } = await FileSystem.downloadAsync(PDF_URL, fileUri);
        setLocalFile(uri);
      } catch (err) {
        console.error("PDF download error:", err);
      } finally {
        setLoading(false);
      }
    };
    downloadAndCache();
  }, []);

  const handleDownload = async () => {
    if (!localFile) return;
    try {
      await Sharing.shareAsync(localFile, { mimeType: "application/pdf" });
    } catch (err) {
      console.error("Download error:", err);
    }
    setMenuVisible(false);
  };

  const handlePrint = async () => {
    if (!localFile) return;
    try {
      await Print.printAsync({ uri: localFile });
    } catch (err) {
      console.error("Print error:", err);
    }
    setMenuVisible(false);
  };

  const handleSendFile = async () => {
    if (!localFile) return;
    try {
      await Share.share({ url: localFile, message: "Here is a PDF file." });
    } catch (err) {
      console.error("Send file error:", err);
    }
    setMenuVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  if (!localFile) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load PDF</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ flex: 1 }}>PDF Viewer</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Text style={styles.menuButton}>⋮</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={handleSendFile} title="Send file..." />
            <Menu.Item onPress={handleDownload} title="Download" />
            <Menu.Item onPress={handlePrint} title="Print" />
            <Menu.Item onPress={() => {}} title="Open with..." />
          </Menu>
        </View>

        <Pdf
          source={{ uri: localFile }}
          style={styles.pdf}
          enablePaging={true}
          enableAnnotationRendering={true}
          onError={(error) => console.log("PDF rendering error:", error)}
        />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuButton: { fontSize: 24, paddingHorizontal: 10 },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
