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
import Map from "../Map/Map";
import { StatusBar } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ProductScanner" component={ProductScanner} />
      <Stack.Screen name="SuccessProduct" component={SuccessProduct} />
      <Stack.Screen name="WarehouseScanner" component={WarehouseScanner} />
      <Stack.Screen
        name="WarehouseDatailScreen"
        component={WarehouseDatailScreen}
      />
      <Stack.Screen
        name="WarehouseProductScanner"
        component={WarehouseProductScanner}
      />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  </>
);

export default AppNavigator;
