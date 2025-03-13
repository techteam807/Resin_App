import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BarcodeScanner from "../BarcodeScanner";
import DetailScreen from "../DetailScreen";
import ProductScanner from "../ProductScanner";
import SuccessProduct from "../SuccessProduct";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
    <Stack.Screen name="DetailScreen" component={DetailScreen} />
    <Stack.Screen name="ProductScanner" component={ProductScanner} />
    <Stack.Screen name="SuccessProduct" component={SuccessProduct} />
  </Stack.Navigator>
);

export default AppNavigator;
