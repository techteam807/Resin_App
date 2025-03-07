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
      <View style={styles.card}>
        <Text style={styles.title}>Scanned Code</Text>
        <Text style={styles.code}>{scannedData}</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#0A84FF" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {productData && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailTitle}>{productData.customer_name}</Text>
          <Text style={styles.detailText}>Email: {productData.email}</Text>
          <Text style={styles.detailText}>Mobile: {productData.mobile}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("ProductScanner", { scannedData })}
      >
        <Text style={styles.buttonText}>Open Product Scanner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("BarcodeScanner")}
      >
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  code: {
    fontSize: 16,
    color: "#0A84FF",
    marginTop: 5,
  },
  error: {
    color: "#FF453A",
    fontSize: 16,
    marginVertical: 10,
  },
  detailsCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: "90%",
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#BBBBBB",
    marginVertical: 2,
  },
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#FF453A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetailScreen;
