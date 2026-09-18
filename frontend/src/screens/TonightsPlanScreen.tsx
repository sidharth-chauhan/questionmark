import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, Plus, Minus, X, Check } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { StreakBadge } from "../components/StreakBadge";
import { Loader } from "../components/Loader";
import { apiClient } from "../api/client";
import { DailyPlan, WeakChapterStat, Subject, Chapter } from "../types";

type AddTab = "weak" | "syllabus";

export const TonightsPlanScreen: React.FC = () => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weakChapters, setWeakChapters] = useState<WeakChapterStat[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // Add-topic panel (collapsed by default to cut down on scrolling)
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addTab, setAddTab] = useState<AddTab>("weak");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const fetchPlan = async (date: Date) => {
    try {
      const dateStr = date.toISOString().split("T")[0];
      const [planRes, weakRes, syllabusRes] = await Promise.all([
        apiClient.get(`/daily-plan/today?date=${dateStr}`),
        apiClient.get("/weak-spots"),
        apiClient.get("/syllabus"),
      ]);
      setPlan(planRes.data.plan);
      setStreak(planRes.data.streak || 0);
      setWeakChapters(weakRes.data?.report?.topWeakChapters || []);
      setSubjects(syllabusRes.data?.subjects || []);
      setChapters(syllabusRes.data?.chapters || []);
    } catch (err) {
      console.error("Failed to load study calendar:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPlan(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPlan(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleComplete = async () => {
    if (!plan || plan.done) return;
    setIsCompleting(true);
    try {
      const res = await apiClient.post(`/daily-plan/${plan._id}/complete`);
      setPlan((prev) => (prev ? { ...prev, done: true } : null));
      setStreak(res.data.streakDay || streak + 1);
    } catch (err) {
      console.error("Failed to complete plan:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleAddChapter = async (chapterId: string) => {
    setIsAdding(chapterId);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await apiClient.post("/daily-plan/add", { date: dateStr, chapterId });
      setPlan(res.data.plan);
    } catch (err) {
      console.error("Failed to add custom chapter:", err);
    } finally {
      setIsAdding(null);
    }
  };

  const handleRemoveChapter = async (chapterId: string) => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await apiClient.post("/daily-plan/remove", { date: dateStr, chapterId });
      setPlan(res.data.plan);
    } catch (err) {
      console.error("Failed to remove chapter:", err);
    }
  };

  const handleUpdateTime = async (chapterId: string, newMinutes: number) => {
    if (newMinutes < 5) return;
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await apiClient.post("/daily-plan/update-time", {
        date: dateStr,
        chapterId,
        minutes: newMinutes,
      });
      setPlan(res.data.plan);
    } catch (err) {
      console.error("Failed to update plan time:", err);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
  const dateDisplay = selectedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const totalMinutes = plan?.chapterIds
    ? plan.chapterIds.reduce(
        (total: number, chapter: any) => total + ((plan as any).durations?.[chapter._id] || 20),
        0
      )
    : 0;

  const filteredChapters = chapters.filter(
    (c) => c.subjectId === selectedSubjectId || (c.subjectId as any)?._id === selectedSubjectId
  );

  if (isLoading && !plan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loader message="Loading study schedule..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header with streak counter */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Study calendar</Text>
            <Text style={styles.subtitle}>Manage your schedule and active weak spots.</Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        {/* Compact calendar strip */}
        <View style={styles.calendarStrip}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navBtn} activeOpacity={0.75}>
            <ChevronLeft size={16} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.currentDateBox}>
            <Text style={styles.currentDateText}>{isToday ? "Today" : dateDisplay}</Text>
            {!isToday && (
              <TouchableOpacity onPress={() => setSelectedDate(new Date())} activeOpacity={0.75}>
                <Text style={styles.jumpTodayText}>Jump to today</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navBtn} activeOpacity={0.75}>
            <ChevronRight size={16} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Scheduled topics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Scheduled topics</Text>
            <View style={styles.cardHeaderMetaPill}>
              <Text style={styles.cardHeaderMeta}>{totalMinutes} min total</Text>
            </View>
          </View>

          <View style={styles.blocksList}>
            {plan?.chapterIds && plan.chapterIds.length > 0 ? (
              plan.chapterIds.map((chapter: any, index: number) => {
                const blockTime = (plan as any).durations?.[chapter._id] || 20;
                return (
                  <View key={chapter._id} style={styles.blockRow}>
                    <View style={styles.blockNumber}>
                      <Text style={styles.blockNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.blockInfo}>
                      <Text style={styles.blockName} numberOfLines={1}>
                        {chapter.name}
                      </Text>
                      <Text style={styles.blockDesc}>Review key theorems, formulae and error traps</Text>
                    </View>

                    <View style={styles.blockActions}>
                      <View style={styles.timeControl}>
                        <TouchableOpacity
                          onPress={() => handleUpdateTime(chapter._id, blockTime - 5)}
                          style={styles.timeBtn}
                          activeOpacity={0.7}
                        >
                          <Minus size={12} color={colors.primary} strokeWidth={2.4} />
                        </TouchableOpacity>
                        <Text style={styles.blockDuration}>{blockTime}m</Text>
                        <TouchableOpacity
                          onPress={() => handleUpdateTime(chapter._id, blockTime + 5)}
                          style={styles.timeBtn}
                          activeOpacity={0.7}
                        >
                          <Plus size={12} color={colors.primary} strokeWidth={2.4} />
                        </TouchableOpacity>
                      </View>

                      {!plan?.done && (
                        <TouchableOpacity
                          onPress={() => handleRemoveChapter(chapter._id)}
                          style={styles.removeBtn}
                          activeOpacity={0.75}
                        >
                          <X size={12} color={colors.accentRed} strokeWidth={2.4} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyPlanBox}>
                <Text style={styles.emptyPlanText}>
                  No revision scheduled for this date. Add a topic below.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionContainer}>
            {plan?.done ? (
              <View style={styles.doneBanner}>
                <Check size={15} color={colors.accentGreen} strokeWidth={2.5} />
                <Text style={styles.doneText}>Completed for this day.</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleComplete}
                disabled={isCompleting || !plan || plan.chapterIds.length === 0}
                style={[
                  styles.completeBtn,
                  (isCompleting || !plan || plan.chapterIds.length === 0) && styles.completeBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                {isCompleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.completeBtnText}>Mark day's revision complete</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Collapsible add-topic panel — keeps the page short until you actually want it */}
        <View style={styles.addSection}>
          <TouchableOpacity
            onPress={() => setShowAddPanel((v) => !v)}
            style={styles.addToggleBtn}
            activeOpacity={0.8}
          >
            <Plus size={14} color={colors.primary} strokeWidth={2.4} />
            <Text style={styles.addToggleText}>{showAddPanel ? "Hide add topic" : "Add a topic"}</Text>
          </TouchableOpacity>

          {showAddPanel && (
            <View style={styles.addPanelCard}>
              <View style={styles.segmentRow}>
                <TouchableOpacity
                  onPress={() => setAddTab("weak")}
                  style={[styles.segmentBtn, addTab === "weak" && styles.segmentBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, addTab === "weak" && styles.segmentTextActive]}>
                    Weak spots
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddTab("syllabus")}
                  style={[styles.segmentBtn, addTab === "syllabus" && styles.segmentBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, addTab === "syllabus" && styles.segmentTextActive]}>
                    By subject
                  </Text>
                </TouchableOpacity>
              </View>

              {addTab === "weak" ? (
                weakChapters.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipScrollRow}
                  >
                    {weakChapters.map((chapter) => (
                      <TouchableOpacity
                        key={chapter.chapterId}
                        onPress={() => handleAddChapter(chapter.chapterId)}
                        disabled={isAdding === chapter.chapterId}
                        style={styles.addChip}
                        activeOpacity={0.75}
                      >
                        {isAdding === chapter.chapterId ? (
                          <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                          <>
                            <Plus size={12} color={colors.primary} strokeWidth={2.4} />
                            <Text style={styles.addChipText} numberOfLines={1}>
                              {chapter.chapterName}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.emptyPanelText}>No active weak spots found.</Text>
                )
              ) : (
                <>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipScrollRow}
                  >
                    {subjects.map((sub) => (
                      <TouchableOpacity
                        key={sub._id}
                        onPress={() => setSelectedSubjectId(selectedSubjectId === sub._id ? "" : sub._id)}
                        style={[styles.filterChip, selectedSubjectId === sub._id && styles.filterChipActive]}
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
                  </ScrollView>

                  {selectedSubjectId ? (
                    filteredChapters.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[styles.chipScrollRow, { marginTop: 8 }]}
                      >
                        {filteredChapters.map((chapter) => (
                          <TouchableOpacity
                            key={chapter._id}
                            onPress={() => handleAddChapter(chapter._id)}
                            disabled={isAdding === chapter._id}
                            style={styles.addChip}
                            activeOpacity={0.75}
                          >
                            {isAdding === chapter._id ? (
                              <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                              <>
                                <Plus size={12} color={colors.primary} strokeWidth={2.4} />
                                <Text style={styles.addChipText} numberOfLines={1}>
                                  {chapter.name}
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text style={[styles.emptyPanelText, { marginTop: 8 }]}>
                        No chapters found for this subject.
                      </Text>
                    )
                  ) : null}
                </>
              )}
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
    marginBottom: 16,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySecondary, marginTop: 4 },

  calendarStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#14171C",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSubtle,
  },
  currentDateBox: { flex: 1, alignItems: "center" },
  currentDateText: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  jumpTodayText: { fontSize: 11, color: colors.primary, fontWeight: "600", marginTop: 2 },

  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 4,
  },
  cardHeaderTitle: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },
  cardHeaderMetaPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cardHeaderMeta: { ...typography.caption },

  blocksList: {},
  blockRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  blockNumberText: { fontSize: 12, fontWeight: "700", color: colors.primary },
  blockInfo: { flex: 1, paddingRight: 8 },
  blockName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  blockDesc: { ...typography.caption, marginTop: 2 },
  blockActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 2,
  },
  timeBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  blockDuration: { ...typography.mono, fontSize: 11, marginHorizontal: 2 },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentRedTint,
  },
  emptyPlanBox: { paddingVertical: 18 },
  emptyPlanText: { ...typography.bodySecondary },
  actionContainer: { paddingTop: 16 },
  completeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  completeBtnDisabled: { opacity: 0.5 },
  completeBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  doneBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#EAF3EE",
    paddingVertical: 12,
    borderRadius: 12,
  },
  doneText: { color: colors.accentGreen, fontSize: 12.5, fontWeight: "600" },

  addSection: { marginTop: 16 },
  addToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addToggleText: { fontSize: 13, fontWeight: "700", color: colors.primary },
  addPanelCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    shadowColor: "#14171C",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  segmentRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: "#14171C",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: { fontSize: 12.5, fontWeight: "600", color: colors.textSecondary },
  segmentTextActive: { color: colors.textPrimary },
  chipScrollRow: { flexDirection: "row", gap: 8, paddingVertical: 2 },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
    maxWidth: 200,
  },
  addChipText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 12.5, fontWeight: "500", color: colors.textSecondary },
  filterChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  emptyPanelText: { ...typography.bodySecondary },
});