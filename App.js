import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { AuthContext, AuthProvider } from "./src/Auth/AuthContext";
import AuthNavigator from "./src/Auth/AuthNavigator";
import AppNavigator from "./src/Auth/AppNavigator";

const RootNavigator = () => {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <NavigationContainer>{userToken ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
