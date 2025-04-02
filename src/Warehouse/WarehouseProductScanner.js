import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { API_URL } from "@env";

const WarehouseProductScanner = () => {
  const qrLock = useRef(false);
  const [scannedDataList, setScannedDataList] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";
  console.log("sdfsjhf", scannedData);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;

      if (!scannedDataList.includes(data)) {
        setScannedDataList((prev) => [...prev, data]);
      }

      setTimeout(() => {
        qrLock.current = false;
      }, 1500);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.loadingText}>Requesting camera access...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No access to camera</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (scannedDataList.length === 0) {
      Alert.alert(
        "No data",
        "Please scan at least one barcode before submitting."
      );
    } else {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/wareHouse/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Product_Codes: scannedDataList, wareHouse_code: scannedData }),
          }
        );

        const result = await response.json();

        console.log("resulktt", result);

        if (result?.status === true) {
          navigation.navigate("SuccessProduct");
        } else {
          let errorMessage = "Unknown error";
        
          if (result?.message) {
            const errors = [];
            if (result.message.notFound) {
              errors.push(`• Not Found: ${result.message.notFound}`);
            }
            if (result.message.alreadyNew) {
              errors.push(`• Already New: ${result.message.alreadyNew}`);
            }
            if (result.message.inUse) {
              errors.push(`• In Use: ${result.message.inUse}`);
            }
            if (result.message.deleted) {
              errors.push(`• Deleted: ${result.message.deleted}`);
            }
        
            if (errors.length > 0) {
              errorMessage = errors.join("\n\n"); 
            }
          }
        
          Alert.alert("🚨 Submission Failed", errorMessage || "Unknown error");
        }
        
      } catch (error) {
        Alert.alert("Error", "Failed to submit products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const removeItem = (index) => {
    setScannedDataList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Warehouse Product Scanner</Text>
        <View style={styles.scanBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        {scannedDataList.length > 0 && (
          <ScrollView
            style={styles.scannedListContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {scannedDataList.map((item, index) => (
              <View key={index} style={styles.scannedItem}>
                <Text style={styles.scannedText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <AntDesign name="closecircleo" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {scannedDataList.length > 0 && (
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WarehouseProductScanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },

  permissionText: {
    color: "#ff5555",
    fontSize: 18,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 30,
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
    marginBottom: 20,
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

  scannedListContainer: {
    maxHeight: 180,
    width: "88%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  scannedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  scannedText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#10B981",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
