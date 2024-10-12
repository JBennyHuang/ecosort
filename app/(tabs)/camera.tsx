import { Button, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button title="grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
