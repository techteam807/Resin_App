import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const user = await AsyncStorage.getItem("user");
      setUserToken(token);
      setUser(user ? JSON.parse(user) : null);
      setLoading(false);
    };
    loadToken();
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
    <AuthContext.Provider value={{ userToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
