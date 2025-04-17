import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import logo from "../../assets/BetterwaterTM_Black.png";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import bgImage from "../../assets/Add a heading (3).png";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout, user, getLocation } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const closeDropdown = () => setDropdownVisible(false);

  useFocusEffect(
    useCallback(() => {
      getLocation(); 
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={styles.mainContainer}>
        <View
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.welcomeContainer}>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setDropdownVisible(!dropdownVisible);
                  }}
                  style={styles.dropdownToggle}
                >
                  <MaterialIcons
                    name="account-circle"
                    size={45}
                    color="#64748b"
                  />
                </TouchableOpacity>
                <View>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.companyText}
                  >
                    {user?.user_name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <Image
                source={logo}
                style={{
                  height: 24,
                  width: 130,
                  backgroundColor: "white",
                  marginTop: 8,
                }}
              />
            </View>
          </View>
          {dropdownVisible && (
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  onPress={() => logout()}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <ImageBackground
          source={bgImage}
          style={styles.cardWrapper}
          resizeMode="cover"
        >
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("BarcodeScanner")}
            >
              <MaterialIcons name="qr-code-scanner" size={22} color="black" />
              <Text style={styles.cardText}>Scan Customer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("WarehouseScanner")}
            >
              <MaterialIcons name="warehouse" size={22} color="black" />
              <Text style={styles.cardText}>Scan Warehouse</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F2F3F7",
  },
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    elevation: 5,
    flexWrap: "wrap",
  },
  welcomeContainer: {
    flexDirection: "column",
    maxWidth: "50%",
  },
  welcomeText: {
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "outfit",
  },
  companyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "outfit-bold",
    width: width * 0.4,
    overflow: "hidden",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 5,
  },
  iconContainer: {
    paddingVertical: 10,
    borderRadius: 15,
  },
  dropdownToggle: {
    paddingVertical: 5,
    borderRadius: 60,
  },
  dropdownMenu: {
    position: "absolute",
    top: 75,
    left: 25,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    position: "relative",
    zIndex: 5,
  },

  dropdownText: {
    color: "#FF5C5C",
    fontSize: 16,
  },
  cardWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingBottom: 40,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 55,
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    gap: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
});
