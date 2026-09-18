import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
        <Text style={styles.tag}>Mock diagnostic</Text>
      </View>

      <View style={styles.scoreRow}>
        {/* Large bold number — One of only two places where #C7862B appears */}
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
          <Text style={[styles.statValue, { color: colors.accentRed }]}>
            -{marksLost}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    ...typography.h3,
  },
  tag: {
    ...typography.caption,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
    marginBottom: 6,
  },
  scoreNumber: {
    ...typography.impactNumber,
    color: colors.accentAmber, // Strictly for rank-impact figure
  },
  scoreUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: "500",
  },
  description: {
    ...typography.caption,
    lineHeight: 16,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  statLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
