import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

const PDFViewerScreen = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [recentUrls, setRecentUrls] = useState([
    {
      id: '1',
      name: 'Sample PDF from URL',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: '2', 
      name: 'React Native Documentation',
      url: 'https://reactnative.dev/docs/getting-started',
    }
  ]);

  // Function to open PDF URL with Android's built-in viewer
  const openPDFFromUrl = async (url) => {
    try {
      if (Platform.OS === 'android') {
        // Direct intent to open URL with Android's PDF viewer
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: url,
          type: 'application/pdf',
        });
      } else if (Platform.OS === 'ios') {
        
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert(
        'Error', 
        'Failed to open PDF. Make sure you have a PDF reader installed and the URL is valid.'
      );
    }
  };

  // Function to open local PDF file with system viewer
  const openLocalPDF = async (filePath) => {
    try {
      if (Platform.OS === 'android') {
        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          Alert.alert('File Not Found', 'The specified file does not exist');
          return;
        }

        // Get content URI and open with system viewer
        const contentUri = await FileSystem.getContentUriAsync(filePath);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/pdf',
        });
      } else {
        Alert.alert('Platform Not Supported', 'This feature is designed for Android');
      }
    } catch (error) {
      console.error('Error opening local PDF:', error);
      Alert.alert('Error', 'Failed to open PDF file');
    }
  };

  // Add URL to recent list
  const addUrlToRecent = () => {
    if (!pdfUrl.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid PDF URL');
      return;
    }

    const newUrl = {
      id: Date.now().toString(),
      name: `PDF from ${new URL(pdfUrl).hostname}`,
      url: pdfUrl.trim(),
    };

    setRecentUrls(prev => [newUrl, ...prev.slice(0, 4)]); // Keep only 5 recent URLs
    openPDFFromUrl(pdfUrl.trim());
    setPdfUrl('');
  };

  // Open common file paths
  const openCommonPaths = () => {
    const commonPaths = [
      FileSystem.documentDirectory,
      FileSystem.cacheDirectory,
      '/storage/emulated/0/Download/', // Android Downloads folder
      '/storage/emulated/0/Documents/', // Android Documents folder
    ];

    Alert.alert(
      'Common File Paths',
      `Document Directory: ${FileSystem.documentDirectory}\n\nCache Directory: ${FileSystem.cacheDirectory}\n\nAndroid Downloads: /storage/emulated/0/Download/\n\nAndroid Documents: /storage/emulated/0/Documents/`,
      [{ text: 'OK' }]
    );
  };

  const renderUrlItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.urlItem}
      onPress={() => openPDFFromUrl(item.url)}
    >
      <Text style={styles.urlName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.urlText} numberOfLines={2}>
        {item.url}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Android PDF Viewer</Text>
        <Text style={styles.headerSubtitle}>
          Direct integration with system PDF viewer
        </Text>
      </View>

      {/* URL Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open PDF from URL</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter PDF URL (https://example.com/file.pdf)"
          value={pdfUrl}
          onChangeText={setPdfUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={addUrlToRecent}
        >
          <Text style={styles.actionButtonText}>📄 Open PDF from URL</Text>
        </TouchableOpacity>
      </View>

      {/* File Path Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Local PDF File</Text>
        <Text style={styles.infoText}>
          Enter the full path to a PDF file on your device:
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="/storage/emulated/0/Download/example.pdf"
          onSubmitEditing={(event) => openLocalPDF(event.nativeEvent.text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={openCommonPaths}
        >
          <Text style={styles.secondaryButtonText}>📁 Show Common Paths</Text>
        </TouchableOpacity>
      </View>

      {/* Recent URLs */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Recent PDF URLs ({recentUrls.length})
        </Text>
        
        <FlatList
          data={recentUrls}
          renderItem={renderUrlItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.urlList}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • Enter a PDF URL or file path{'\n'}
          • Tap to open with system's built-in PDF viewer{'\n'}
          • Android: Google Drive PDF Viewer, Chrome, etc.{'\n'}
          • iOS: Built-in PDF viewer in Safari/WebBrowser{'\n'}
          • No third-party apps required
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    backgroundColor: '#4285f4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  urlList: {
    flex: 1,
  },
  urlItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
  },
  urlName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 18,
  },
});

export default PDFViewerScreen;