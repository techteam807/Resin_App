import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { CameraView } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProductScanner = () => {
  const qrLock = useRef(false);
  const [scannedText, setScannedText] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!scannedText) {
      Alert.alert("Error", "No product code scanned!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://resion-backend.vercel.app/customers/manageProducts?customer_code=${scannedData}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_code: scannedText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        navigation.navigate("SuccessProduct");
      } else {
        Alert.alert("Error", result.error || "Failed to submit product.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            }, 1500);
          }
        }}
      />
      {/* Transparent Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Scan Product Barcode</Text>
        <View style={styles.scanBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>
      {scannedText ? (
        <View style={styles.overlayBottom}>
          <Text style={styles.scannedText}>✅ Scanned Product:</Text>
          <Text style={styles.code}>{scannedText}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? <ActivityIndicator size="small" color="#fff" style={{paddingHorizontal:15}} /> : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
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

  overlayBottom: {
    position: "absolute",
    bottom: 100,
    left: 50,
    right: 50,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  scannedText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  code: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 15 },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

export default ProductScanner;
