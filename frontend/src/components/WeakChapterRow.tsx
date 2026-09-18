import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { WeakChapterStat } from "../types";

interface WeakChapterRowProps {
  chapter: WeakChapterStat;
  rank: number;
  onPracticeClick: (chapterId: string, chapterName: string) => void;
}

export const WeakChapterRow: React.FC<WeakChapterRowProps> = ({
  chapter,
  rank,
  onPracticeClick,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>{rank}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.chapterName} numberOfLines={1}>
            {chapter.chapterName}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.subject}>{chapter.subjectName}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.mistakeCount}>
              {chapter.count} {chapter.count === 1 ? "error" : "errors"}
            </Text>
            {chapter.carelessCount > 0 && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.carelessTag}>{chapter.carelessCount} careless</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onPracticeClick(chapter.chapterId, chapter.chapterName)}
        style={styles.practiceButton}
        activeOpacity={0.75}
      >
        <Text style={styles.practiceText}>Practice</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  infoCol: { flex: 1 },
  chapterName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  subject: { ...typography.caption },
  metaDot: { ...typography.caption, marginHorizontal: 5 },
  mistakeCount: { ...typography.caption },
  carelessTag: { ...typography.caption, color: colors.accentRed },
  practiceButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  practiceText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});