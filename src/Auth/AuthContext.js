import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { AppState } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const user = await AsyncStorage.getItem("user");
      setUserToken(token);
      setUser(user ? JSON.parse(user) : null);
      setLoading(false);
    };
    loadToken();
  }, []);

  const getLocation = async () => {
    try {
      setLocation(null)
      // console.log("📍 Getting location...", location);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Location Permission Needed",
          "We need your location to continue. Please enable it in settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }
  
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);
  
      // console.log("✅ Location fetched:", coords);
    } catch (err) {
      console.error("❌ Location error:", err);
    }
  };
  

  useEffect(() => {
    getLocation();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        getLocation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const login = async (token, user) => {
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUserToken(token);
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("user");
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, user, login, logout, loading, location }}
    >
      {children}
    </AuthContext.Provider>
  );
};
