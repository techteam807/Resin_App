import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    Pressable,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native"; 
  import MaterialIcons from "@expo/vector-icons/MaterialIcons";
  import Img3 from "../../assets/OTP.jpg";
import { AuthContext } from "../Auth/AuthContext";
  
  const { width } = Dimensions.get("window");
  
  const VerifyOTP = () => {
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const route = useRoute();
    const { from, country_code, mobile_number } = route.params || {};
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    

    const handleVerifyOTP = async () => {
        if (!otp) {
          Alert.alert("Error", "Please enter OTP");
          return;
        }
        let apiUrl = "";
        let nextScreen = "";
    
        if (from === "signup") {
          apiUrl = "https://resion-backend.vercel.app/users/verifySignUp";
          nextScreen = "SignUpSuccess";  
        } else if (from === "signin") {
          apiUrl = "https://resion-backend.vercel.app/users/verifySignIn";  
          nextScreen = "BarcodeScanner"; 
        } else {
          Alert.alert("Error", "Invalid request");
          return;
        }
        setLoading(true)
        try {
          const response = await fetch(
            apiUrl,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ otp, country_code, mobile_number }),
            }
          );
          const data = await response.json();
          
          if (response.ok) {
            Alert.alert("Success", "OTP Verified!");
            if (from === "signin") {
              login(data.data.token, data.data.user);
            }
            navigation.navigate(nextScreen); 
            setLoading(false)
          } else {
            Alert.alert("Error", response.error || "Invalid OTP");
            setLoading(false)
          }
        } catch (error) {
          Alert.alert("Error", "Failed to verify OTP. Please try again.");
          setLoading(false)
        }
      };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={Img3} style={styles.image} resizeMode="contain" />
        </View>
        <Text style={styles.heading}>Verify Your OTP</Text>
  
        <View style={styles.formContainer}>
          <View style={styles.fieldset}>
            <Text style={styles.legend}>Verify OTP</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="verified-user"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter OTP"
                style={styles.textInput}
                keyboardType="phone-pad"
                value={otp}
                onChangeText={setOtp}
              />
            </View>
          </View>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOTP}
          >
            {loading ? <ActivityIndicator color="#fff" style={{ paddingVertical: 2 }} /> : <Text style={styles.buttonText}>Verify</Text>}
          </TouchableOpacity>
        </View>
  
        <Pressable
          style={styles.signUpContainer}
          onPress={() => navigation.navigate("Sign_in")} 
        >
          <Text style={styles.signUpText}>Already have an account?</Text>
          <Text style={styles.signUpLink}> Sign In</Text>
        </Pressable>
      </ScrollView>
    );
  };
  
  export default VerifyOTP;
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#ffffff",
      paddingHorizontal: 20,
      paddingTop: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    imageContainer: {
      width: "100%",
      alignItems: "center",
    },
    image: {
      width: width * 0.9,
      height: width * 0.6,
    },
    heading: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
    },
    formContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    fieldset: {
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 5,
      padding: 8,
      position: "relative",
    },
    legend: {
      position: "absolute",
      top: -10,
      left: 10,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 5,
      fontSize: 12,
      color: "#4B5563",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginLeft: 5,
      marginRight: 8,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 8,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: 25,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: "#4CAF50",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    signUpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    signUpText: {
      fontSize: 16,
      color: "#333",
    },
    signUpLink: {
      fontSize: 16,
      color: "#4CAF50",
      fontWeight: "bold",
    },
  });
  