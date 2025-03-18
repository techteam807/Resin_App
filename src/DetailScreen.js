import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (scannedData) {
      fetchProductDetails(scannedData);
    }
  }, [scannedData]);

  const fetchProductDetails = async (barcode) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://resion-backend.vercel.app/customers/code?customer_code=${barcode}`
      );
      const data = await response.json();

      if (response.ok) {
        setProductData(data?.data);
      } else {
        setError("Customer not found.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🧾 Scan Customer Details</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Scanned Code</Text>
        <Text style={styles.code}>{scannedData}</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#0A84FF" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {productData && (
        <View style={styles.productCard}>
          <Text style={styles.customerName}>{productData.customer_name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{productData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{productData.mobile}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("ProductScanner", { scannedData })}
        >
          <Text style={styles.btnText}>Open Product Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("BarcodeScanner")}
        >
          <Text style={styles.btnText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F3F7",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
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
    padding: 24,
    borderRadius: 20,
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
    marginTop: 10,
  },
  primaryBtn: {
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
  secondaryBtn: {
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
});

export default DetailScreen;
