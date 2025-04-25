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
import { API_URL } from "../Utility/jsonFile";
// import { API_URL } from "@env";
  
  const { width } = Dimensions.get("window");
  
  const VerifyOTP = () => {
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const route = useRoute();
    const { from, country_code, mobile_number, user_name } = route.params || {};
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [counter, setCounter] = useState(10);
    const [showResend, setShowResend] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const validateOtp = (value) => {
      if (!value) {
        setError("OTP is required");
      } else if (value.length !== 6 || !/^\d{6}$/.test(value)) {
        setError("OTP must be a 6-digit number");
      } else {
        setError("");
      }
      setOtp(value);
    };

    React.useEffect(() => {
      let timer;
      if (counter > 0) {
        timer = setTimeout(() => setCounter(counter - 1), 1000);
      } else {
        setShowResend(true);
      }
      return () => clearTimeout(timer);
    }, [counter]);

    const handleVerifyOTP = async () => {
        if (error || !otp) {
          setError("Please enter a valid OTP");
          return;
        }
        let apiUrl = "";
        let nextScreen = "";
        if (from === "signup") {
          apiUrl = `${API_URL}/users/verifySignUp`;
          nextScreen = "SignUpSuccess";  
        } else if (from === "signin") {
          apiUrl = `${API_URL}/users/verifySignIn`;  
          nextScreen = "HomeScreen"; 
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
          // console.log("data", data);
          
          if (response.ok) {
            // Alert.alert("Success", "OTP Verified!");
            if (from === "signin") {
              login(data.data.token, data.data.user);
            }
            navigation.navigate(nextScreen); 
            setLoading(false)
          } else {
            Alert.alert("Error", data.error || "Invalid OTP");
            setLoading(false)
          }
        } catch (error) {
          Alert.alert("Error", "Failed to verify OTP. Please try again.");
          setLoading(false)
        }
      };

      const handleResendSignUp = async () => {
          setResetLoading(true)
          // console.log("signUp");
          
          try {
            const response = await fetch(
              `${API_URL}/users/signUpUser`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_name: user_name,
                  mobile_number: mobile_number,
                  country_code: country_code,
                }),
              }
            );
            
      
            const result = await response.json();
            // console.log("sign Up response verify", result);
            
            if (response.ok) {
              Alert.alert("Success", "OTP sent successfully. Please check your WhatsApp");
              setCounter(10);
              setShowResend(false);
            } else {
              Alert.alert("Error", result.message || "Failed to sign Up.");
            }
          } catch (error) {
            console.log("error", error);
            
           Alert.alert("Error", "Network error. Please try again.");
          } finally {
            setResetLoading(false)
          }
        };

    const handleResendSignIn = async () => {
        setResetLoading(true)
        // console.log("signin");
        try {
          const response = await fetch(
            `${API_URL}/users/signInUser`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mobile_number: mobile_number,
                country_code: country_code,
              }),
            }
          );
    
          const result = await response.json();
    
          if (response.ok) {
            Alert.alert("Success", "OTP send successfully. Please check your WhatsApp");
            setCounter(10);
            setShowResend(false);
          } else {
            Alert.alert("Error", result.message || "Failed to sign in.");
          }
        } catch (error) {
          Alert.alert("Error", "Network error. Please try again.");
        } finally {
          setResetLoading(false)
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
                keyboardType="number-pad"
                value={otp}
                onChangeText={validateOtp}
                maxLength={6}
              />
            </View>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "#10B981" }]}
            onPress={handleVerifyOTP}
          >
            {loading ? <ActivityIndicator color="#fff" style={{ paddingVertical: 2 }} /> : <Text style={styles.buttonText}>Verify</Text>}
          </TouchableOpacity>
        </View>
  
        <View style={styles.signUpContainer}>
        {showResend ? (
          <Pressable
            onPress={from === "signup" ? handleResendSignUp : handleResendSignIn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
              {resetLoading ? (
                <>
                  <ActivityIndicator color="#10B981" size={17} style={{ marginRight: 5 }} />
                  <Text style={[styles.signUpLink, { fontSize: 16 }]}>Resend OTP</Text>
                </>
              ) : (
                <Text style={[styles.signUpLink, { fontSize: 16 }]}>Resend OTP</Text>
              )}
            </View>
          </Pressable>
        ) : (
          <>
            <Text style={styles.signUpText}>Resend OTP in</Text>
            <Text style={styles.signUpLink}> 00:{counter < 10 ? `0${counter}` : counter}</Text>
          </>
        )}
      </View>

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
    errorText: {
      color: "red",
      fontSize: 9,
      // marginTop: 4,
      position: 'absolute',
      right: 20,
      bottom: -13,
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
      backgroundColor: "#10B981",
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
      color: "#10B981",
      fontWeight: "bold",
    },
  });
  