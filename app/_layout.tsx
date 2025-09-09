import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Pdf" />
      <Stack.Screen name="WebViewPdf"  />
      <Stack.Screen name="WebViewOffice"/>
      <Stack.Screen name="file-sharing" />
    </Stack>

  );
}
