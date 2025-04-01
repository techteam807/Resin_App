import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const ProductScanner = () => {
  const qrLock = useRef(false);
  const [scannedText, setScannedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";
  const cartridgeNum = route.params?.cartridgeNum ?? 0;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // const handleSubmit = async () => {
  //   if (scannedText.length < 2) {
  //     Alert.alert(
  //       "𝗠𝗜𝗡𝗜𝗠𝗨𝗠 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗: 𝟮",
  //       "Please scan at least one barcode before submitting."
  //     );
  //     return;
  //   }

  //     try {
  //       setLoading(true);
  //       const response = await fetch(
  //         `https://resion-backend.vercel.app/customers/manageProducts?customer_code=${scannedData}`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ product_code: scannedText }),
  //         }
  //       );

  //       const result = await response.json();

  //       if (response.ok) {
  //         navigation.navigate("SuccessProduct");
  //       } else {
  //         Alert.alert("Error", result.error || "Failed to submit product.");
  //       }
  //     } catch (error) {
  //       Alert.alert("Error", "Network error. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  // };

  const handleSubmit = async () => {
    if (scannedText.length !== cartridgeNum) {
      Alert.alert(
        `𝗠𝗜𝗡𝗜𝗠𝗨𝗠 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗: ${cartridgeNum}`,
        `Please scan at least ${cartridgeNum} barcode before submitting.`
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://ression-backend-new.vercel.app/customers/manageProducts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Product_Codes: scannedText,
            customer_code: scannedData,
          }),
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
          if (result.message.exhausted) {
            errors.push(`• Exhausted : ${result.message.exhausted}`);
          }
          if (result.message.inUse) {
            errors.push(`• Already In Use: ${result.message.inUse}`);
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
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
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

  const handleBarcodeScanned = ({ data }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;

      setScannedText((prev) => {
        if (prev.includes(data)) return prev; 
        if (prev.length >= cartridgeNum) return prev; 
        return [...prev, data];
      });

      setTimeout(() => {
        qrLock.current = false;
      }, 1500);
    }
  };

  const removeItem = (index) => {
    setScannedText((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Scan Product Barcode</Text>
        <View style={styles.scanBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        {scannedText.length > 0 && (
          <ScrollView
            style={styles.scannedListContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {scannedText.map((item, index) => (
              <View key={index} style={styles.scannedItem}>
                <Text style={styles.scannedText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <AntDesign name="closecircleo" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
        {scannedText.length > 0 && (
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  instructionText: {
    color: "#fff",
    fontSize: width * 0.045,
    marginBottom: 20,
    textAlign: "center",
  },

  scanBox: {
    width: width * 0.75,
    height: height * 0.2,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
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

  scannedListContainer: {
    maxHeight: 180,
    width: "78%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
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
    paddingHorizontal: 34,
    borderRadius: 12,
    marginTop: 10,
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

export default ProductScanner;
