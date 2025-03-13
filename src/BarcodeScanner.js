import React, { useRef, useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./Auth/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const BarcodeScanner = () => {
  const qrLock = useRef(false);
  const { logout, user } = useContext(AuthContext);
  const [scannedText, setScannedText] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setDropdownVisible(!dropdownVisible)}
          style={styles.userIconContainer}
        >
          <MaterialIcons name="account-circle" size={30} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 12, color: 'white', textAlign: 'left'}}>Hello,</Text>
          <Text style={{fontSize: 18, color: 'white', textAlign: 'left'}}>{user?.user_name}</Text>
        </View>

        {/* Dropdown Menu */}
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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

  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },

  userIconContainer: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
  },

  dropdownMenu: {
    position: "absolute",
    top: 55,
    left: 0,
    backgroundColor: "#333",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    width: 80,
  },

  dropdownItem: {
    paddingVertical: 8,
  },

  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },

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
