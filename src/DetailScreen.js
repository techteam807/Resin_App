import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
// import { API_URL } from '@env'
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { API_URL } from "./Utility/jsonFile";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [score, setScore] = useState(null);
  console.log("productData", uploadedImageUrl);

  useFocusEffect(
    useCallback(() => {
      if (scannedData) {
        fetchProductDetails(scannedData);
      }
    }, [scannedData])
  );

  // const fetchProductDetails = async (barcode) => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch(`${API_URL}/customers/code?customer_code=${barcode}`);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Something went wrong!');
  //     }
  //     setProductData(data?.data);
  //   } catch (err) {
  //     setError(err.message || 'Something went wrong!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProductDetails = async (barcode) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/customers/code?customer_code=${barcode}`
      );
      const data = await response.json();
      // console.log("data",data);

      if (response.ok && data?.data) {
        setProductData(data?.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const manipResult = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      uploadToCloudinary(manipResult.uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", "expo_upload");
    data.append("cloud_name", "dwejyapuh");
    setUploading(true);

    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dwejyapuh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      let json = await res.json();
      console.log("Cloudinary upload response:", json);

      if (json?.error) {
        setUploadError(json.error.message || "Upload failed on Cloudinary");
        setShowErrorModal(true);
      }

      if (json?.secure_url) {
        setUploadedImageUrl(json?.secure_url);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Upload failed", err);
      setUploadError(
        err.message || "Something went wrong during upload. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather name="file-text" size={24} color="#3B82F6" />
        <Text style={styles.headerText}>Scan Customer Details</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Customer Code</Text>
        <Text style={styles.code}>{scannedData}</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#0A84FF" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {productData && (
        <View style={styles.productCard}>
          <Text style={styles.customerName}>{productData.customer_name}</Text>
          {productData.email && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{productData.email}</Text>
            </View>
          )}
          {productData.mobile && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mobile:</Text>
              <Text style={styles.value}>{productData.mobile}</Text>
            </View>
          )}
          {productData.products && productData.products.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Products:</Text>
              {productData.products.map((product, index) => (
                <Text key={index} style={styles.value}>
                  {product.productCode}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Water Report Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Water Report"
          value={score}
          onChangeText={setScore}
          keyboardType="numeric"
        />
        <Text style={styles.unit}>mg/L</Text>
      </View>

      <View style={styles.buttonGroup}>
        {!error &&
          productData?.products &&
          Array.isArray(productData.products) &&
          productData.products.length > 0 && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() =>
                navigation.navigate("ProductScanner", {
                  scannedData,
                  cartridgeNum: productData?.cartridgeNum || 1,
                  score,
                })
              }
            >
              <MaterialIcons name="qr-code-scanner" size={20} color="#FFFFFF" />
              <Text style={styles.btnText}>Open Product Scanner</Text>
            </TouchableOpacity>
          )}
        {productData?.products &&
          Array.isArray(productData.products) &&
          productData.products.length === 0 && (
            <View>
              <TouchableOpacity style={styles.primaryBtn} onPress={pickImage}>
                <Text style={styles.btnText}>Capture Image</Text>
              </TouchableOpacity>
            </View>
          )}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("BarcodeScanner")}
        >
          <Feather name="refresh-cw" size={20} color="#FFFFFF" />
          <Text style={styles.btnText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setUploadedImageUrl(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                setUploadedImageUrl(null);
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Image Uploaded Successfully</Text>
            {uploadedImageUrl && (
              <Image
                source={{ uri: uploadedImageUrl }}
                style={styles.modalImage}
              />
            )}

            <TouchableOpacity
              style={styles.primaryBtn1}
              onPress={() => {
                setShowModal(false);
                navigation.navigate("ProductScanner", {
                  scannedData,
                  cartridgeNum: productData?.cartridgeNum || 1,
                  uploadedImageUrl,
                  score,
                });
              }}
            >
              <Text style={styles.btnText}>Open Product Scanner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => {
          setShowErrorModal(false);
          setUploadError("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowErrorModal(false);
                setUploadError("");
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Upload Failed</Text>
            <Text style={styles.errorMessage}>{uploadError}</Text>

            <TouchableOpacity
              style={styles.primaryBtn1}
              onPress={() => {
                setShowErrorModal(false);
                setUploadError("");
                navigation.navigate("ProductScanner", {
                  scannedData,
                  cartridgeNum: productData?.cartridgeNum || 1,
                  score,
                });
              }}
            >
              <Text style={styles.btnText}>Open Product Scanner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {uploading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
              Uploading Image
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F3F7",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#1F2937",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 14,
    color: "#7C7F94",
    marginBottom: 6,
    fontWeight: "600",
  },
  code: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5E60CE",
  },
  error: {
    color: "#DC2626",
    fontSize: 16,
    marginVertical: 10,
  },
  productCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#7C7F94",
  },
  value: {
    fontSize: 16,
    color: "#1A1A2E",
    fontWeight: "600",
  },
  buttonGroup: {
    width: "100%",
    // marginTop: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#5E60CE",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtn1: {
    backgroundColor: "#10B981",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#5E60CE",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#FF6584",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    // paddingHorizontal: 16,
    // height: 56,
  },
  input: {
    flex: 7, // 70% of the container's width
    fontSize: 16,
    color: "#1F2937",
    paddingLeft: 10,
    borderRadius: 15,
    height: 45,
    backgroundColor: "#fff",
  },
  unit: {
    flex: 3, // 30% of the container's width
    fontWeight: "500",
    fontSize: 18,
    color: "#6B7280",
    textAlign: "right",
    paddingRight: 15,
  },
});

export default DetailScreen;
