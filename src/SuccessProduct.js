import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const SuccessProduct = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="check-circle" size={70} color="#4CAF50" style={styles.icon} />
      </View>

      <Text style={styles.title}>Success!</Text>
      <Text style={styles.message}>Product is replaced successfully.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("BarcodeScanner")}>
        <Text style={styles.buttonText}>Scan Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#121212", 
    paddingHorizontal: 20 
  },

  iconContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },

  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 5 
  },

  message: { 
    fontSize: 16, 
    color: "#ccc", 
    textAlign: "center", 
    marginBottom: 20 
  },

  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

export default SuccessProduct;
