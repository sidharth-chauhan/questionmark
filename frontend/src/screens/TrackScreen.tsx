import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { UploadCard } from "../components/UploadCard";
import { MistakeListItem } from "../components/MistakeListItem";
import { Loader } from "../components/Loader";
import { apiClient } from "../api/client";
import { Mistake, Test, Subject } from "../types";

export const TrackScreen: React.FC = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedMistakeType, setSelectedMistakeType] = useState<string>("");

  const fetchData = async () => {
    try {
      const [mistakesRes, testsRes, profileRes] = await Promise.all([
        apiClient.get("/mistakes"),
        apiClient.get("/tests"),
        apiClient.get("/users/me"),
      ]);
      setMistakes(mistakesRes.data?.mistakes || []);
      setTests(testsRes.data || []);
      if (profileRes.data?.subjects) {
        setSubjects(profileRes.data.subjects);
      }
    } catch (err) {
      console.error("Failed to load mistakes:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, []);

  const handleUploadSuccess = (newMistake: Mistake) => {
    setMistakes((prev) => [newMistake, ...prev]);
  };

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedSubjectId) {
      const subId =
        typeof m.chapterId?.subjectId === "object"
          ? (m.chapterId.subjectId as any)._id
          : m.chapterId?.subjectId;
      if (subId !== selectedSubjectId) return false;
    }
    if (selectedMistakeType && m.mistakeType !== selectedMistakeType) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loader message="Loading mistakes..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Page Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Track mistakes</Text>
          <Text style={styles.subtitle}>
            Photograph questions you got wrong to identify root patterns.
          </Text>
        </View>

        {/* Upload Box — Genuine Focal Point */}
        <UploadCard onSuccess={handleUploadSuccess} tests={tests} />

        {/* Past Mistakes Section */}
        <View style={styles.pastMistakesSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Past mistakes</Text>
              <Text style={styles.sectionCount}>
                ({filteredMistakes.length})
              </Text>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <TouchableOpacity
              onPress={() => setSelectedSubjectId("")}
              style={[
                styles.filterChip,
                !selectedSubjectId && styles.filterChipActive,
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedSubjectId && styles.filterChipTextActive,
                ]}
              >
                All subjects
              </Text>
            </TouchableOpacity>
            {subjects.map((sub) => (
              <TouchableOpacity
                key={sub._id}
                onPress={() =>
                  setSelectedSubjectId(
                    selectedSubjectId === sub._id ? "" : sub._id
                  )
                }
                style={[
                  styles.filterChip,
                  selectedSubjectId === sub._id && styles.filterChipActive,
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedSubjectId === sub._id && styles.filterChipTextActive,
                  ]}
                >
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() =>
                setSelectedMistakeType(
                  selectedMistakeType === "CALCULATION_ERROR"
                    ? ""
                    : "CALCULATION_ERROR"
                )
              }
              style={[
                styles.filterChip,
                selectedMistakeType === "CALCULATION_ERROR" &&
                  styles.filterChipActive,
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedMistakeType === "CALCULATION_ERROR" &&
                    styles.filterChipTextActive,
                ]}
              >
                Calculation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setSelectedMistakeType(
                  selectedMistakeType === "MISREAD" ? "" : "MISREAD"
                )
              }
              style={[
                styles.filterChip,
                selectedMistakeType === "MISREAD" && styles.filterChipActive,
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedMistakeType === "MISREAD" &&
                    styles.filterChipTextActive,
                ]}
              >
                Misread
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Hairline-separated list */}
          <View style={styles.mistakesList}>
            {filteredMistakes.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  No mistakes logged yet. Photograph your first wrong question
                  above.
                </Text>
              </View>
            ) : (
              filteredMistakes.map((mistake) => (
                <MistakeListItem key={mistake._id} mistake={mistake} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: 4,
  },
  pastMistakesSection: {
    marginTop: 26,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  sectionTitle: {
    ...typography.h2,
    fontWeight: "600",
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mistakesList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyBox: {
    paddingVertical: 28,
    alignItems: "center",
  },
  emptyText: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 18,
  },
});