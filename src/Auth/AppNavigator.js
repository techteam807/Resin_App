import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BarcodeScanner from "../BarcodeScanner";
import DetailScreen from "../DetailScreen";
import ProductScanner from "../ProductScanner";
import SuccessProduct from "../SuccessProduct";
import HomeScreen from "../Home/HomeScreen";
import WarehouseScanner from "../Warehouse/WarehouseScanner";
import WarehouseDatailScreen from "../Warehouse/WarehouseDatailScreen";
import WarehouseProductScanner from "../Warehouse/WarehouseProductScanner";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
    <Stack.Screen name="DetailScreen" component={DetailScreen} />
    <Stack.Screen name="ProductScanner" component={ProductScanner} />
    <Stack.Screen name="SuccessProduct" component={SuccessProduct} />
    <Stack.Screen name="WarehouseScanner" component={WarehouseScanner} />
    <Stack.Screen name="WarehouseDatailScreen" component={WarehouseDatailScreen} />
    <Stack.Screen name="WarehouseProductScanner" component={WarehouseProductScanner} />
  </Stack.Navigator>
);

export default AppNavigator;
