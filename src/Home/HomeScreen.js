import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import logo from "../../assets/logomain2.png";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const closeDropdown = () => setDropdownVisible(false);

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={styles.mainContainer}>
        <View
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={logo}
                style={{
                  height: 23,
                  width: 120,
                  backgroundColor: "white",
                  marginTop: 8,
                }}
              />
            </View>
            <View style={styles.welcomeContainer}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.welcomeText}>Hello,</Text>
                  <Text style={styles.companyText}>{user?.user_name}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setDropdownVisible(!dropdownVisible);
                  }}
                  style={styles.dropdownToggle}
                >
                  <MaterialIcons name="account-circle" size={44} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {dropdownVisible && (
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("BarcodeScanner")}
            >
              <MaterialIcons name="qr-code-scanner" size={32} color="#3b82f6" />
              <Text style={styles.cardText}>Scan Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("WarehouseScanner")}
            >
              <MaterialIcons name="warehouse" size={32} color="#3b82f6" />
              <Text style={styles.cardText}>Scan Warehouse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 25,
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
    maxWidth: "60%",
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#64748b",
    fontFamily: "outfit",
  },
  companyText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    flexShrink: 1,
    color: "#0f172a",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconContainer: {
    paddingVertical: 10,
    borderRadius: 15,
  },
  dropdownToggle: {
    padding: 8,
    borderRadius: 50,
  },
  dropdownMenu: {
    position: "absolute",
    top: 100,
    right: 30,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
  },

  dropdownText: {
    color: "#FF5C5C",
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
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
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
  },
});
