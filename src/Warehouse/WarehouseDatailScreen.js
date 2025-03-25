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

const WarehouseDatailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scannedData = route.params?.scannedData || "No Data";

  const [wareHouseData, setWareHouseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (scannedData) {
      fetchWarehouseDetails(scannedData);
    }
  }, [scannedData]);

  const fetchWarehouseDetails = async (barcode) => {
    setLoading(true);
    setError("");
    setWareHouseData(null);

    try {
      const response = await fetch(
        `https://resion-backend.vercel.app/wareHouse/code?wareHouse_code=${barcode}`
      );
      const json = await response.json();

      if (response.ok && json?.data) {
        setWareHouseData(json.data);
      } else {
        setError("Warehouse not found.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🧾 Warehouse Details</Text>

      {loading && <ActivityIndicator size="large" color="#0A84FF" />}

      {!loading && (
        <>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : wareHouseData ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Warehouse Info</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Code:</Text>
                <Text style={styles.value}>{wareHouseData.wareHouseCode}</Text>
              </View>
            </View>
          ) : null}
        </>
      )}

      <View style={styles.buttonGroup}>
        {!error && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("WarehouseProductScanner", { scannedData })
            }
          >
            <Text style={styles.btnText}>Open Product Scanner</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("WarehouseScanner")}
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
    backgroundColor: "#F7F9FC",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 16,
    fontWeight: "700",
  },
   infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  error: {
    color: "#DC2626",
    fontSize: 16,
    marginVertical: 12,
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

export default WarehouseDatailScreen;

//5000.05.50.W
