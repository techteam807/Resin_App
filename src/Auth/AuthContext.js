import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

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
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Location permission denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLocation(loc.coords);
          console.log(" Latitude:", latitude);
          console.log(" Longitude:", longitude);
        }
      );
    };
    loadToken();
    startLocationTracking();
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
