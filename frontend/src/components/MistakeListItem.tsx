import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Mistake } from "../types";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleExpanded}
        style={styles.headerRow}
        activeOpacity={0.7}
      >
        <View style={styles.leftCol}>
          <View
            style={[
              styles.dot,
              { backgroundColor: isCareless ? colors.accentRed : colors.textMuted },
            ]}
          />
          <View style={styles.textCol}>
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
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaDate}>{formattedDate}</Text>
                </>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.chevron, expanded && styles.chevronOpen]}>
          <ChevronDown size={16} color={colors.textSecondary} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.detailsBox}>
          {mistake.photoUrl ? (
            <Image
              source={{ uri: mistake.photoUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}

          {mistake.questionText ? (
            <View style={styles.transcriptionBox}>
              <Text style={styles.boxLabel}>Extracted question</Text>
              <Text style={styles.transcriptionText}>{mistake.questionText}</Text>
            </View>
          ) : null}

          {mistake.aiExplanation ? (
            <View style={styles.notesBox}>
              <Text style={styles.boxLabel}>Gemini diagnostic</Text>
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
    paddingVertical: 14,
  },
  leftCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  chapterName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeTag: {
    fontSize: 12,
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
    marginHorizontal: 5,
  },
  metaDate: {
    ...typography.caption,
  },
  chevron: {
    padding: 4,
    transform: [{ rotate: "0deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  detailsBox: {
    paddingBottom: 16,
    paddingTop: 2,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    marginBottom: 10,
  },
  transcriptionBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  boxLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  transcriptionText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  notesBox: {
    backgroundColor: colors.primaryTint,
    padding: 12,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});