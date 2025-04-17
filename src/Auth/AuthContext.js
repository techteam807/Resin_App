import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert, Platform, Linking } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("user");
        setUserToken(token);
        setUser(userData ? JSON.parse(userData) : null);
      } catch (e) {
        console.error("Error loading token/user:", e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const getLocation = async () => {
    try {
      console.log("📍 Requesting location...");

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Needed",
          "We need your location to continue. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
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
      console.log("✅ Location fetched:", coords);
    } catch (err) {
      console.error("❌ Failed to get location:", err);
    }
  };

  const login = async (token, user) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserToken(token);
      setUser(user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");
      setUserToken(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        login,
        logout,
        loading,
        location,
        getLocation, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
