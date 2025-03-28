import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Sign_in from "../Login/Sign_in";
import Sign_up from "../SignUp/Sign_up";
import VerifyOTP from "../VerifyOTP/VerifyOTP";
import SignUpSuccess from "../SignUp/SignUpSuccess";
import { StatusBar } from "react-native";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sign_in" component={Sign_in} />
      <Stack.Screen name="Sign_up" component={Sign_up} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
    </Stack.Navigator>
  </>
);

export default AuthNavigator;
