import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BarcodeScanner from "./src/BarcodeScanner";
import DetailScreen from "./src/DetailScreen";
import ProductScanner from "./src/ProductScanner";
import SuccessProduct from "./src/SuccessProduct";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true, animationEnabled: true, }}>
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="ProductScanner" component={ProductScanner} />
        <Stack.Screen name="SuccessProduct" component={SuccessProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
