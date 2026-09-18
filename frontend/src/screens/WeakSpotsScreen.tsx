import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { RankImpactCard } from "../components/RankImpactCard";
import { WeakChapterRow } from "../components/WeakChapterRow";
import { Loader } from "../components/Loader";
import { apiClient } from "../api/client";
import { WeakSpotsReport, Mistake } from "../types";

export const WeakSpotsScreen: React.FC = () => {
  const [report, setReport] = useState<WeakSpotsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRecomputing, setIsRecomputing] = useState(false);

  // Review past mistakes state
  const [activeReviewChapter, setActiveReviewChapter] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [reviewMistakes, setReviewMistakes] = useState<Mistake[]>([]);
  const [isFetchingReview, setIsFetchingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<{
    [id: string]: boolean;
  }>({});

  const fetchReport = async () => {
    try {
      const res = await apiClient.get("/weak-spots");
      setReport(res.data?.report || res.data);
    } catch (err) {
      console.error("Failed to load weak spots report:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReport();
  }, []);

  const handleRecompute = async () => {
    setIsRecomputing(true);
    try {
      const res = await apiClient.post("/weak-spots/recompute");
      setReport(res.data?.report || res.data);
    } catch (err) {
      console.error("Failed to recompute weak spots:", err);
    } finally {
      setIsRecomputing(false);
    }
  };

  // Fetch the latest 5 mistakes for the selected chapter
  const handleViewClick = async (chapterId: string, chapterName: string) => {
    setActiveReviewChapter({ id: chapterId, name: chapterName });
    setIsFetchingReview(true);
    setReviewError(null);
    setReviewMistakes([]);

    try {
      const res = await apiClient.get(`/mistakes?chapterId=${chapterId}&limit=5`);
      setReviewMistakes(res.data.mistakes || []);
    } catch (err: any) {
      console.error("Failed to fetch past mistakes:", err);
      setReviewError("Could not load past mistakes for this chapter.");
    } finally {
      setIsFetchingReview(false);
    }
  };

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loader message="Analyzing test performance..." />
      </SafeAreaView>
    );
  }

  const breakdown = report?.mistakeTypeBreakdown || {
    CONCEPT_GAP: 0,
    CALCULATION_ERROR: 0,
    MISREAD: 0,
    FORGOT_FORMULA: 0,
  };

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
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Weak spots</Text>
            <Text style={styles.subtitle}>
              Rank penalty analysis & chapter diagnostics.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRecompute}
            disabled={isRecomputing}
            style={styles.recomputeBtn}
          >
            {isRecomputing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.recomputeText}>Recalculate</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 1. Rank-Impact Figure */}
        <RankImpactCard
          score={report?.rankImpactScore || 0}
          carelessMistakesCount={
            (breakdown.CALCULATION_ERROR || 0) + (breakdown.MISREAD || 0)
          }
          marksLost={
            ((breakdown.CALCULATION_ERROR || 0) + (breakdown.MISREAD || 0)) * 5
          }
        />

        {/* Review Module (Visible when View is clicked) */}
        {activeReviewChapter && (
          <View style={styles.practiceCard}>
            <View style={styles.practiceHeader}>
              <View style={styles.practiceHeaderInfo}>
                <Text style={styles.practiceTitle}>
                  Review: {activeReviewChapter.name}
                </Text>
                <Text style={styles.practiceSubtitle}>
                  Your latest 5 recorded errors in this chapter
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveReviewChapter(null)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>

            {isFetchingReview ? (
              <Loader message="Fetching recorded images..." />
            ) : reviewError ? (
              <Text style={styles.practiceErrorText}>{reviewError}</Text>
            ) : reviewMistakes.length === 0 ? (
              <Text style={styles.practiceSubtitle}>No recorded mistakes found.</Text>
            ) : (
              <View style={styles.questionsContainer}>
                {reviewMistakes.map((m, idx) => (
                  <View key={m._id} style={styles.questionItem}>
                    <Text style={styles.questionNumber}>
                      Question {idx + 1}
                    </Text>

                    {/* Display the actual uploaded photo */}
                    {m.photoUrl ? (
                      <Image
                        source={{ uri: m.photoUrl }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    ) : null}

                    <Text style={styles.questionText}>{m.questionText}</Text>

                    <TouchableOpacity
                      onPress={() => toggleSolution(m._id)}
                      style={styles.toggleSolutionBtn}
                    >
                      <Text style={styles.toggleSolutionText}>
                        {expandedSolutions[m._id]
                          ? "Hide AI hint"
                          : "Ask AI for a hint or solution"}
                      </Text>
                    </TouchableOpacity>

                    {/* Display the AI Explanation */}
                    {expandedSolutions[m._id] && (
                      <View style={styles.aiHintBox}>
                        <Text style={styles.aiHintLabel}>✨ Gemini Diagnosis</Text>
                        <Text style={styles.solutionText}>{m.aiExplanation}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 2. Top Weak Chapters List */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.sectionTitle}>Top weak chapters</Text>
            <Text style={styles.sectionSubtitle}>
              Chapters with the highest frequency of errors in mock tests.
            </Text>
          </View>

          {report?.topWeakChapters && report.topWeakChapters.length > 0 ? (
            <View style={styles.hairlineList}>
              {report.topWeakChapters.map((chapter, index) => (
                <WeakChapterRow
                  key={chapter.chapterId}
                  chapter={chapter}
                  rank={index + 1}
                  onPracticeClick={handleViewClick}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Log questions to identify your most vulnerable chapters.
              </Text>
            </View>
          )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 16,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: 2,
  },
  recomputeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  recomputeText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.primary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitleBlock: {
    marginBottom: 8,
  },
  sectionTitle: {
    ...typography.h2,
  },
  sectionSubtitle: {
    ...typography.caption,
    marginTop: 1,
  },
  hairlineList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyBox: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyText: {
    ...typography.caption,
  },
  practiceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 4,
    marginTop: 16,
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 12,
  },
  practiceHeaderInfo: {
    flex: 1,
    paddingRight: 10,
  },
  practiceTitle: {
    ...typography.h3,
  },
  practiceSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  closeBtn: {
    paddingVertical: 2,
  },
  closeBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  practiceErrorText: {
    color: colors.accentRed,
    fontSize: 11,
  },
  questionsContainer: {
    gap: 16,
  },
  questionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  questionNumber: {
    ...typography.mono,
    marginBottom: 4,
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
  questionText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    backgroundColor: colors.surfaceSubtle,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  toggleSolutionBtn: {
    marginVertical: 4,
  },
  toggleSolutionText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  aiHintBox: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  aiHintLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  solutionText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});