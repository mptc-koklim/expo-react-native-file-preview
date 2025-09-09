import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Text, StyleSheet, Platform, Alert, NativeModules } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { QuickLookPreview } = NativeModules;

const FILE_URL = 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf';

export default function QuickLookScreen() {
  const [loading, setLoading] = useState(false);

  const downloadAndPreview = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not supported', 'Quick Look is only available on iOS.');
      return;
    }

    try {
      setLoading(true);
      const fileName = FILE_URL.split('/').pop() || 'file.pdf';
      const localUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Download file
      const { uri } = await FileSystem.downloadAsync(FILE_URL, localUri);

      // Open native Quick Look
      QuickLookPreview.open(uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to preview file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>iOS Quick Look Preview</Text>
      <Button title="Preview File" onPress={downloadAndPreview} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
});
