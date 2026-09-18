import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Mistake } from "../types";

interface MistakeListItemProps {
  mistake: Mistake;
}

export const MistakeListItem: React.FC<MistakeListItemProps> = ({ mistake }) => {
  const [expanded, setExpanded] = useState(false);

  const getMistakeTypeLabel = (type: string) => {
    switch (type) {
      case "CALCULATION_ERROR":
        return "Calculation error";
      case "MISREAD":
        return "Misread";
      case "FORGOT_FORMULA":
        return "Forgot formula";
      case "CONCEPT_GAP":
      default:
        return "Concept gap";
    }
  };

  const isCareless =
    mistake.mistakeType === "CALCULATION_ERROR" ||
    mistake.mistakeType === "MISREAD";

  const formattedDate = mistake.createdAt
    ? new Date(mistake.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.headerRow}
        activeOpacity={0.7}
      >
        <View style={styles.leftCol}>
          <Text style={styles.chapterName} numberOfLines={1}>
            {mistake.chapterId?.name || "Uncategorized chapter"}
          </Text>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.typeTag,
                isCareless ? styles.carelessTag : styles.defaultTag,
              ]}
            >
              {getMistakeTypeLabel(mistake.mistakeType)}
            </Text>
            {formattedDate ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaDate}>{formattedDate}</Text>
              </>
            ) : null}
          </View>
        </View>

        <Text style={styles.expandAction}>{expanded ? "Hide" : "View"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.detailsBox}>
          {mistake.photoUrl ? (
            <Image
              source={{ uri: mistake.photoUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}

          {mistake.questionText ? (
            <View style={styles.transcriptionBox}>
              <Text style={styles.boxLabel}>Extracted Question:</Text>
              <Text style={styles.transcriptionText}>
                {mistake.questionText}
              </Text>
            </View>
          ) : null}

          {mistake.aiExplanation ? (
            <View style={styles.notesBox}>
              <Text style={styles.boxLabel}>Gemini Diagnostic:</Text>
              <Text style={styles.notesText}>{mistake.aiExplanation}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  chapterName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeTag: {
    fontSize: 11,
    fontWeight: "500",
  },
  carelessTag: {
    color: colors.accentRed,
  },
  defaultTag: {
    color: colors.textSecondary,
  },
  metaDot: {
    ...typography.caption,
    marginHorizontal: 4,
  },
  metaDate: {
    ...typography.caption,
  },
  expandAction: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  detailsBox: {
    paddingBottom: 14,
    paddingTop: 4,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  transcriptionBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  boxLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  transcriptionText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  notesBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});
