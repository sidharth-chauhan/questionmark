import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  number: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accentAmber, // One of only two places where #C7862B appears
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
