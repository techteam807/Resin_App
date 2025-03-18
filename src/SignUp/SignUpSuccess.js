import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { useNavigation } from "@react-navigation/native";
  import { Entypo } from "@expo/vector-icons";
  
  export default function SignUpSuccess() {
    const navigation = useNavigation();
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.checkBox}>
            <Entypo style={styles.check} name="check" color="white" />
          </View>
          <Text style={styles.successful}>Success</Text>
          <Text style={styles.successful2}>Your registration is complete.</Text>
          <Text style={styles.successful3}>
            "Please wait for admin approval to proceed."
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Sign_in");
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const { width, height } = Dimensions.get("window");
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
      alignItems: "center",
      justifyContent: "center",
    },
    subContainer: {
      padding: 40,
      alignItems: "center",
    },
    successful: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: "#4CAF50", 
      marginBottom: 10,
    },
    successful2: {
      textAlign: "center",
      fontSize: 14,
      color: "#6B7280", 
      marginBottom: 5,
    },
    successful3: {
      textAlign: "center",
      fontSize: 14,
      color: "#6B7280",
      fontStyle: "italic",
      marginBottom: 20,
    },
    checkBox: {
      width: width * 0.35,
      height: width * 0.35,
      backgroundColor: "#4CAF50", 
      borderRadius: 9999, 
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      elevation: 5, 
    },
    check: {
      fontSize: 80,
    },
    button: {
      backgroundColor: "#10B981",
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    buttonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
  });
  