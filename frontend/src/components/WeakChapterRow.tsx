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
        <Text style={styles.rankNumber}>{rank}.</Text>
        <View style={styles.infoCol}>
          <Text style={styles.chapterName} numberOfLines={1}>
            {chapter.chapterName}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.subject}>{chapter.subjectName}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.mistakeCount}>
              {chapter.count} {chapter.count === 1 ? "error" : "errors"}
            </Text>
            {chapter.carelessCount > 0 && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.carelessTag}>
                  {chapter.carelessCount} careless
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onPracticeClick(chapter.chapterId, chapter.chapterName)}
        style={styles.practiceButton}
        activeOpacity={0.7}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    paddingRight: 12,
  },
  rankNumber: {
    ...typography.caption,
    width: 20,
    marginTop: 1,
  },
  infoCol: {
    flex: 1,
  },
  chapterName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subject: {
    ...typography.caption,
  },
  metaDot: {
    ...typography.caption,
    marginHorizontal: 4,
  },
  mistakeCount: {
    ...typography.caption,
  },
  carelessTag: {
    ...typography.caption,
    color: colors.accentRed,
  },
  practiceButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  practiceText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.primary,
  },
});
