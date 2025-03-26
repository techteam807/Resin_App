import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

const Map = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location access is required.");
      setLoading(false);
      return;
    }

    try {
      const position = await Location.getCurrentPositionAsync({});
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();

      console.log("Latitude:", lat);
      console.log("Longitude:", lon);

      setLocation({ latitude: lat, longitude: lon });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location. Try again.");
      console.error(error);
    }

    setLoading(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Location</Text>
      <View style={styles.formContainer}>
        <TextInput placeholder="Enter Location Name" style={styles.textInput} />
        <TextInput
          placeholder="Latitude"
          style={styles.textInput}
          value={location.latitude}
          editable={false}
        />
        <TextInput
          placeholder="Longitude"
          style={styles.textInput}
          value={location.longitude}
          editable={false}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Use Current Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 90,
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#000",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
