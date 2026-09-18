import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Flame } from "lucide-react-native";
import { colors } from "../theme/colors";

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Flame size={13} color={colors.accentAmber} strokeWidth={2.2} />
      <Text style={styles.number}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  number: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accentAmber,
    marginLeft: 5,
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
  },
});