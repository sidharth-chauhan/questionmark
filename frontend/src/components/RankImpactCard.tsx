import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingDown } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

interface RankImpactCardProps {
  score: number;
  carelessMistakesCount: number;
  marksLost: number;
}

export const RankImpactCard: React.FC<RankImpactCardProps> = ({
  score,
  carelessMistakesCount,
  marksLost,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Projected rank penalty</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Mock diagnostic</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <TrendingDown size={26} color={colors.accentAmber} strokeWidth={2} style={{ marginRight: 6 }} />
        <Text style={styles.scoreNumber}>+{score.toLocaleString("en-IN")}</Text>
        <Text style={styles.scoreUnit}>ranks</Text>
      </View>

      <Text style={styles.description}>
        Estimated rank drop in JEE caused strictly by avoidable calculation slips
        and question misreads.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Careless mistakes</Text>
          <Text style={styles.statValue}>{carelessMistakesCount}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Marks lost</Text>
          <Text style={[styles.statValue, { color: colors.accentRed }]}>-{marksLost}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { ...typography.h3 },
  tag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  scoreNumber: { ...typography.impactNumber, color: colors.accentAmber },
  scoreUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 7,
    fontWeight: "500",
  },
  description: {
    ...typography.bodySecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
  },
  statItem: { flex: 1 },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  statLabel: { ...typography.caption, marginBottom: 3 },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});