import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import Img1 from "../../assets/Sign_in1.jpg";
import { API_URL } from "@env";

const { width } = Dimensions.get("window");

const Sign_in = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    console.log(API_URL);
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users/signInUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: mobileNumber,
            country_code: country,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "OTP sent successfully. Please check your WhatsApp", [
          { text: "OK", onPress: () => navigation.navigate("VerifyOTP", {
              from: "signin",
              country_code: country,
              mobile_number: mobileNumber,
            })
          }
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to sign in.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={Img1} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.heading}>Let's Sign In</Text>

      <View style={styles.formContainer}>
        <View style={styles.fieldset}>
          <Text style={styles.legend}>Mobile Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#4B5563" style={styles.icon} />
            <Text style={styles.prefix}>{country}</Text>
            <TextInput
              placeholder="Enter Your Phone"
              style={styles.textInput}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>
          {errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}
        </View>
        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ paddingVertical: 2 }}
            />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <Pressable
        style={styles.signUpContainer}
        onPress={() => navigation.navigate("Sign_up")}
      >
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <Text style={styles.signUpLink}> Sign Up</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Sign_in;

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
  prefix: {
    fontSize: 16,
    color: "#4B5563",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    fontSize: 9,
    // marginTop: 4,
    position: 'absolute',
    right: 2,
    bottom: -13,
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
  disabledButton: {
    backgroundColor: "#10B981",
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
