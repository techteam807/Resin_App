import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { AppState, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedText, setScannedText] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
        setLoading(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setLoading(true); // Show "Please wait..." message
            setScannedText(""); // Clear previous scan result

            setTimeout(() => {
              setLoading(false);
              setScannedText(data);
              qrLock.current = false;
            }, 2000); // Show result after 2 seconds
          }
        }}
      />

      <View style={styles.scanArea}>
        <View style={styles.square} />
      </View>

      {loading ? (
        <View style={styles.overlay}>
          <Text style={styles.waitText}>⌛ Please wait...</Text>
        </View>
      ) : scannedText ? (
        <View style={styles.overlay}>
          <Text style={styles.scannedText}>✅ Scanned Code:</Text>
          <Text style={styles.code}>{scannedText}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setScannedText("")}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scanningIndicator}>
          <Text style={styles.indicatorText}>📷 Align barcode inside the square</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  scanArea: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 320,
    height: 200,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  overlay: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  waitText: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
  },
  scannedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  code: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanningIndicator: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  indicatorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

