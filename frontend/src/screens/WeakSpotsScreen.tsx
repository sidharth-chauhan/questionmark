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
import { RefreshCw, X, Sparkles } from "lucide-react-native";
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

  const [activeReviewChapter, setActiveReviewChapter] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [reviewMistakes, setReviewMistakes] = useState<Mistake[]>([]);
  const [isFetchingReview, setIsFetchingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<{ [id: string]: boolean }>({});

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
    setExpandedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
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
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Weak spots</Text>
            <Text style={styles.subtitle}>Rank penalty analysis and chapter diagnostics.</Text>
          </View>

          <TouchableOpacity
            onPress={handleRecompute}
            disabled={isRecomputing}
            style={styles.recomputeBtn}
            activeOpacity={0.75}
          >
            {isRecomputing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <RefreshCw size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.recomputeText}>Recalculate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <RankImpactCard
          score={report?.rankImpactScore || 0}
          carelessMistakesCount={(breakdown.CALCULATION_ERROR || 0) + (breakdown.MISREAD || 0)}
          marksLost={((breakdown.CALCULATION_ERROR || 0) + (breakdown.MISREAD || 0)) * 5}
        />

        {activeReviewChapter && (
          <View style={styles.practiceCard}>
            <View style={styles.practiceHeader}>
              <View style={styles.practiceHeaderInfo}>
                <Text style={styles.practiceTitle}>Review: {activeReviewChapter.name}</Text>
                <Text style={styles.practiceSubtitle}>Your latest 5 recorded errors in this chapter</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveReviewChapter(null)}
                style={styles.closeBtn}
                activeOpacity={0.75}
              >
                <X size={16} color={colors.textSecondary} strokeWidth={2} />
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
                    <Text style={styles.questionNumber}>Question {idx + 1}</Text>

                    {m.photoUrl ? (
                      <Image source={{ uri: m.photoUrl }} style={styles.image} resizeMode="cover" />
                    ) : null}

                    <Text style={styles.questionText}>{m.questionText}</Text>

                    <TouchableOpacity
                      onPress={() => toggleSolution(m._id)}
                      style={styles.toggleSolutionBtn}
                      activeOpacity={0.75}
                    >
                      <Sparkles size={13} color={colors.primary} strokeWidth={2} />
                      <Text style={styles.toggleSolutionText}>
                        {expandedSolutions[m._id] ? "Hide AI hint" : "Ask AI for a hint or solution"}
                      </Text>
                    </TouchableOpacity>

                    {expandedSolutions[m._id] && (
                      <View style={styles.aiHintBox}>
                        <Text style={styles.aiHintLabel}>Gemini diagnosis</Text>
                        <Text style={styles.solutionText}>{m.aiExplanation}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

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
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySecondary, marginTop: 4 },
  recomputeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  recomputeText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  section: { marginTop: 28 },
  sectionTitleBlock: { marginBottom: 10 },
  sectionTitle: { ...typography.h2, fontWeight: "700" },
  sectionSubtitle: { ...typography.bodySecondary, marginTop: 2 },
  hairlineList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#14171C",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  emptyBox: { paddingVertical: 24, alignItems: "center" },
  emptyText: { ...typography.bodySecondary, textAlign: "center" },
  practiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 14,
  },
  practiceHeaderInfo: { flex: 1, paddingRight: 10 },
  practiceTitle: { ...typography.h3 },
  practiceSubtitle: { ...typography.bodySecondary, marginTop: 2 },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  practiceErrorText: { color: colors.accentRed, fontSize: 12 },
  questionsContainer: { gap: 18 },
  questionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
  },
  questionNumber: { ...typography.mono, marginBottom: 6 },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  toggleSolutionBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginVertical: 4 },
  toggleSolutionText: { fontSize: 12, color: colors.primary, fontWeight: "600" },
  aiHintBox: {
    backgroundColor: colors.primaryTint,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  aiHintLabel: { fontSize: 11, fontWeight: "700", color: colors.primary, marginBottom: 6 },
  solutionText: { fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
});