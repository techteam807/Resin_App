import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "./Utility/jsonFile";
// import { API_URL } from '@env'

export default function ProductStatus() {
    const qrLock = useRef(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [productStatus, setProductStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

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

      const fetchProductDetails = async (productCode) => {
          setLoading(true);
          try {
            const response = await fetch(
              `${API_URL}/products/code?product_code=${productCode}`
            );
            const data = await response.json();
            // console.log("data",data);
            
      
            if (response.ok && data.data) {
                setProductStatus(data.data);
                setModalVisible(true);
            } else {
              Alert.alert("Error", data.message);
              qrLock.current = false;
            }
          } catch (err) {
            Alert.alert("Failed to fetch data. Please try again.");
            qrLock.current = false;
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
            fetchProductDetails(data)
            }
        }}
        />
        <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>


        {loading ? (
            <View style={styles.centered}>
            <ActivityIndicator size="large" color="#00ffcc" />
            <Text style={styles.loadingText}>Fetching product details...</Text>
            </View>
        ) : (
            <>
            <Text style={styles.instructionText}>Check Cartridge Status</Text>
            <View style={styles.scanBox}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
            </View>
            </>
        )}
        </View>
        
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                setModalVisible(false);
                qrLock.current = false;
            }}
            >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Product Status</Text>
                <Text style={styles.modalMessage}>Product Code: {productStatus.productCode}</Text>
                <Text style={styles.modalMessage}>Product Status: {productStatus.productStatus}</Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                    setModalVisible(false);
                    qrLock.current = false;
                    }}
                >
                    <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
                </View>
            </View>
            </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
  
    headerContainer: {
      width: "100%",
      paddingHorizontal: 20,
      paddingTop: 35,
      paddingBottom: 10,
      backgroundColor: "#fff", 
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
  
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    userTextContainer: {
      marginLeft: 10,
    },
  
    helloText: {
      color: "black",
      fontSize: 12,
    },
    userName: {
      color: "black",
      fontSize: 18,
      fontWeight: "600",
    },
  
    userIconContainer: {
      padding: 10,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 50,
    },
  
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
  
    backButton: {
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 10,
      padding: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 25,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      
      modalMessage: {
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'center',
      },
      
      modalButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
      },
      
      modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
      },
      
  });