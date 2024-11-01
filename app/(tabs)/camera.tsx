import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useRef, useState } from "react";

import CameraButton from "../../components/cameraButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "expo-image";
import LLM from "@/lib/llm";
import { useIsFocused } from "@react-navigation/native";

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [camerataking, setCameraTaking] = useState<boolean>(false);
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const takePictureAsync = useCallback(async () => {
    if (!cameraRef.current) {
      console.warn("CameraView ref is not ready");
      return;
    }

    if (!cameraReady) {
      console.warn("Camera is not ready");
      return;
    }

    if (camerataking) {
      console.warn("Already taking a picture");
      return;
    }

    try {
      setCameraTaking(true);

      const result = await cameraRef.current.takePictureAsync({ base64: true });

      if (!result?.base64) {
        console.warn("No picture taken");
        return;
      }

      setLoading(true);
      try {
        const response = await LLM.getInstance().identify(result.base64);
        setPictureUri(result.uri);
        setInstructions(response.choices.map((c) => c.message.content!));
      } catch (error) {
        console.error("Error while identifying object with LLM");
      } finally {
        setLoading(false);
      }

      expand();
    } catch (e) {
      console.error(e);
    } finally {
      setCameraTaking(false);
    }
  }, [cameraRef, cameraReady, camerataking]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const expand = useCallback(() => {
    if (!bottomSheetRef.current) {
      console.warn("BottomSheet ref is not ready");
      return;
    }

    bottomSheetRef.current.expand();
  }, [bottomSheetRef]);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Error</Text>
      </View>
    );
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
    <GestureHandlerRootView style={styles.container}>
      {isFocused && (
        <CameraView
          ref={cameraRef}
          facing="back"
          style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
          onCameraReady={() => setCameraReady(true)}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <TouchableOpacity style={{ margin: 48 }} onPress={takePictureAsync}>
              <CameraButton
                onPress={takePictureAsync}
                iconSize={30}
                iconColor="#66BB6A"
              />
            </TouchableOpacity>
          )}
        </CameraView>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["80%"]}
        enablePanDownToClose
      >
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pictureUri && (
            <Image
              source={{ uri: pictureUri }}
              style={{ width: 400, height: 400 }}
            />
          )}
          {instructions && <Text>{instructions}</Text>}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
  },
});
