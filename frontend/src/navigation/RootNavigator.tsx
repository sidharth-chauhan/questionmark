import React from "react";
import { View, StyleSheet } from "react-native";
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
      <View style={styles.loadingContainer}>
        <Loader message="Loading QuestionMark..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user && token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
