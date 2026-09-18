import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { MainTabs } from "./MainTabs";
import { AuthStack } from "./AuthStack";
import { Loader } from "../components/Loader";
import { colors } from "../theme/colors";

export const RootNavigator: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.webWrapper}>
        <View style={[styles.appContainer, styles.loadingContainer]}>
          <Loader message="Loading QuestionMark..." />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.webWrapper}>
      <View style={styles.appContainer}>
        <NavigationContainer>
          {user && token ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === "web"
      ? {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }
      : {}),
  },
  appContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
