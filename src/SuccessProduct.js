import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";

const SuccessProduct = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animatable.View
          animation="zoomIn"
          duration={500}
          delay={200}
          style={styles.iconContainer}
          useNativeDriver
        >
          <Icon name="check-circle" size={70} color="#34D399" />
        </Animatable.View>

        <Text style={styles.title}>Success!</Text>
        <Text style={styles.message}>
          The product has been replaced successfully.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    backgroundColor: "#ECFDF5",
    padding: 30,
    borderRadius: 100,
    marginBottom: 25,
    shadowColor: "#34D399",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    shadowColor: "#34D399",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SuccessProduct;
