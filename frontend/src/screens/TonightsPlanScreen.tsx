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
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { StreakBadge } from "../components/StreakBadge";
import { Loader } from "../components/Loader";
import { apiClient } from "../api/client";
import { DailyPlan, WeakChapterStat, Subject, Chapter } from "../types";

export const TonightsPlanScreen: React.FC = () => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weakChapters, setWeakChapters] = useState<WeakChapterStat[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Date state for calendar
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const fetchPlan = async (date: Date) => {
    try {
      const dateStr = date.toISOString().split("T")[0];
      const [planRes, weakRes, syllabusRes] = await Promise.all([
        apiClient.get(`/daily-plan/today?date=${dateStr}`),
        apiClient.get("/weak-spots"),
        apiClient.get("/syllabus")
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
  }, [selectedDate]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPlan(selectedDate);
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
      const res = await apiClient.post("/daily-plan/add", {
        date: dateStr,
        chapterId,
      });
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
      const res = await apiClient.post("/daily-plan/remove", {
        date: dateStr,
        chapterId,
      });
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
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header with Streak counter */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Study Calendar</Text>
            <Text style={styles.subtitle}>
              Manage your schedule and active weak spots.
            </Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>{"< Prev"}</Text>
          </TouchableOpacity>
          <View style={styles.currentDateBox}>
            <Text style={styles.currentDateText}>{isToday ? "Today" : dateDisplay}</Text>
          </View>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>{"Next >"}</Text>
          </TouchableOpacity>
        </View>

        {/* Revision Blocks */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              Scheduled topics
            </Text>
            <Text style={styles.cardHeaderMeta}>
              {plan?.chapterIds ? plan.chapterIds.reduce((total: number, chapter: any) => total + ((plan as any).durations?.[chapter._id] || 20), 0) : 0} min total
            </Text>
          </View>

          <View style={styles.blocksList}>
            {plan?.chapterIds && plan.chapterIds.length > 0 ? (
              plan.chapterIds.map((chapter: any, index: number) => {
                const blockTime = (plan as any).durations?.[chapter._id] || 20;
                return (
                  <View key={chapter._id} style={styles.blockRow}>
                    <View style={styles.blockInfo}>
                      <View style={styles.blockTitleRow}>
                        <Text style={styles.blockTag}>Block {index + 1}</Text>
                        <Text style={styles.blockName}>{chapter.name}</Text>
                      </View>
                      <Text style={styles.blockDesc}>
                        Review key theorems, formulae & error traps
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <View style={styles.timeControl}>
                        <TouchableOpacity onPress={() => handleUpdateTime(chapter._id, blockTime - 5)} style={styles.timeBtn}>
                          <Text style={styles.timeBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.blockDuration}>{blockTime} min</Text>
                        <TouchableOpacity onPress={() => handleUpdateTime(chapter._id, blockTime + 5)} style={styles.timeBtn}>
                          <Text style={styles.timeBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      {!plan?.done && (
                        <TouchableOpacity onPress={() => handleRemoveChapter(chapter._id)} style={{ marginTop: 8 }}>
                          <Text style={{ fontSize: 11, color: colors.accentRed, fontWeight: "600" }}>Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyPlanBox}>
                <Text style={styles.emptyPlanText}>
                  No revision scheduled for this date.
                </Text>
              </View>
            )}
          </View>

          {/* Action button */}
          <View style={styles.actionContainer}>
            {plan?.done ? (
              <View style={styles.doneBanner}>
                <Text style={styles.doneText}>✓ Completed for this day.</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleComplete}
                disabled={isCompleting || !plan || plan.chapterIds.length === 0}
                style={[
                  styles.completeBtn,
                  (isCompleting || !plan || plan.chapterIds.length === 0) && styles.completeBtnDisabled,
                ]}
                activeOpacity={0.8}
              >
                {isCompleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.completeBtnText}>
                    Mark day's revision complete
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Add Custom Chapters Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.sectionTitle}>Add from Weak Spots</Text>
            <Text style={styles.sectionSubtitle}>
              Manually push priority topics into your schedule.
            </Text>
          </View>

          <View style={styles.hairlineList}>
            {weakChapters.length > 0 ? (
              weakChapters.map((chapter) => (
                <View key={chapter.chapterId} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{chapter.chapterName}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAddChapter(chapter.chapterId)}
                    disabled={isAdding === chapter.chapterId}
                  >
                    {isAdding === chapter.chapterId ? (
                       <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                       <Text style={styles.addBtnText}>+ Add to plan</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyHistoryBox}>
                <Text style={styles.emptyHistoryText}>
                  No active weak spots found.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Browse All Chapters Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.sectionTitle}>Browse syllabus</Text>
            <Text style={styles.sectionSubtitle}>
              Select a subject to add custom chapters to your plan.
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {subjects.map((sub) => (
              <TouchableOpacity
                key={sub._id}
                onPress={() => setSelectedSubjectId(selectedSubjectId === sub._id ? "" : sub._id)}
                style={[styles.filterChip, selectedSubjectId === sub._id && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, selectedSubjectId === sub._id && styles.filterChipTextActive]}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedSubjectId ? (
            <View style={styles.hairlineList}>
              {chapters
                .filter((c) => c.subjectId === selectedSubjectId || (c.subjectId as any)?._id === selectedSubjectId)
                .map((chapter) => (
                  <View key={chapter._id} style={styles.historyRow}>
                    <Text style={styles.historyDate}>{chapter.name}</Text>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => handleAddChapter(chapter._id)}
                      disabled={isAdding === chapter._id}
                    >
                      {isAdding === chapter._id ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <Text style={styles.addBtnText}>+ Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ) : null}
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
  calendarStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  currentDateBox: {
    flex: 1,
    alignItems: "center",
  },
  currentDateText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardHeaderMeta: {
    ...typography.caption,
  },
  blocksList: {
    gap: 8,
  },
  blockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockInfo: {
    flex: 1,
    paddingRight: 10,
  },
  blockTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  blockTag: {
    ...typography.mono,
  },
  blockName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  blockDesc: {
    ...typography.caption,
    marginTop: 1,
  },
  timeControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeBtn: {
    paddingHorizontal: 6,
  },
  timeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  blockDuration: {
    ...typography.mono,
    marginHorizontal: 4,
  },
  emptyPlanBox: {
    paddingVertical: 16,
  },
  emptyPlanText: {
    ...typography.caption,
  },
  actionContainer: {
    paddingTop: 12,
  },
  completeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 3,
    alignItems: "center",
  },
  completeBtnDisabled: {
    opacity: 0.5,
  },
  completeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  doneBanner: {
    paddingVertical: 8,
    alignItems: "center",
  },
  doneText: {
    color: colors.accentGreen,
    fontSize: 12,
    fontWeight: "600",
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
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  emptyHistoryBox: {
    paddingVertical: 16,
  },
  emptyHistoryText: {
    ...typography.caption,
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 10,
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});