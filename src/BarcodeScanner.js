import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

const BarcodeScanner = () => {
  const qrLock = useRef(false);
  const [scannedText, setScannedText] = useState("");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setScannedText(data);
            setTimeout(() => {
              qrLock.current = false;
              navigation.navigate("DetailScreen", { scannedData: data });
            }, 1500);
          }
        }}
      />

      {/* Transparent Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Scan Customer Barcode</Text>
        <View style={styles.scanBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dim background
  },

  instructionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  scanBox: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Animated Corners for better visibility
  cornerTopLeft: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#00ffcc",
  },

  cornerTopRight: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#00ffcc",
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#00ffcc",
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#00ffcc",
  },
});

export default BarcodeScanner;
