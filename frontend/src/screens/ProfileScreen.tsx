import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut, Check } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { Loader } from "../components/Loader";
import { Subject, Test, TargetExam } from "../types";

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit form state
  const [name, setName] = useState(user?.name || "");
  const [targetExam, setTargetExam] = useState<TargetExam>(
    user?.targetExam || "JEE_MAIN"
  );
  const [targetYear, setTargetYear] = useState<number>(user?.targetYear || 2025);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New test input state
  const [testName, setTestName] = useState("");
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, testsRes] = await Promise.all([
          apiClient.get("/users/me"),
          apiClient.get("/tests"),
        ]);

        if (profileRes.data?.subjects) {
          setSubjects(profileRes.data.subjects);
        }
        if (profileRes.data?.user) {
          setName(profileRes.data.user.name || "");
          setTargetExam(profileRes.data.user.targetExam || "JEE_MAIN");
          setTargetYear(profileRes.data.user.targetYear || 2025);
        }
        if (testsRes.data) {
          setTests(testsRes.data);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await apiClient.patch("/users/me", {
        name: name.trim(),
        targetExam,
        targetYear,
      });
      updateUser(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Error", "Could not save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) return;
    setIsCreatingTest(true);
    try {
      const res = await apiClient.post("/tests", {
        testName: testName.trim(),
        testDate: new Date().toISOString(),
      });
      setTests((prev) => [res.data, ...prev]);
      setTestName("");
    } catch (err) {
      console.error("Failed to create test:", err);
      Alert.alert("Error", "Could not create mock test.");
    } finally {
      setIsCreatingTest(false);
    }
  };

  const confirmSignOut = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to sign out?")) {
        logout();
      }
    } else {
      Alert.alert("Sign out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", style: "destructive", onPress: logout },
      ]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loader message="Loading profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Student details and target milestones.</Text>
            </View>
          </View>

          {/* Student Details Form — Genuine Focal Point */}
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Student name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.textInput}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                value={user?.email || ""}
                editable={false}
                style={[styles.textInput, styles.textInputDisabled]}
              />
            </View>

            {/* Target Exam Selection */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Target exam</Text>
              <View style={styles.chipsRow}>
                <TouchableOpacity
                  onPress={() => setTargetExam("JEE_MAIN")}
                  style={[styles.chip, targetExam === "JEE_MAIN" && styles.chipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, targetExam === "JEE_MAIN" && styles.chipTextActive]}>
                    JEE Main
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTargetExam("JEE_ADVANCED")}
                  style={[styles.chip, targetExam === "JEE_ADVANCED" && styles.chipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, targetExam === "JEE_ADVANCED" && styles.chipTextActive]}>
                    JEE Advanced
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Target Year Selection */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Target year</Text>
              <View style={styles.chipsRow}>
                {[2025, 2026, 2027].map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    onPress={() => setTargetYear(yr)}
                    style={[styles.chip, targetYear === yr && styles.chipActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.chipText, targetYear === yr && styles.chipTextActive]}>{yr}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Coaching center</Text>
              <TextInput
                value="Self-study (independent aspirant)"
                editable={false}
                style={[styles.textInput, styles.textInputDisabled]}
              />
            </View>

            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={isSaving}
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : saveSuccess ? (
                <View style={styles.saveSuccessRow}>
                  <Check size={15} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.saveBtnText}>Saved</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>Save changes</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Enrolled Subjects */}
          <View style={styles.section}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionTitle}>Enrolled subjects</Text>
              <Text style={styles.sectionSubtitle}>Core subjects monitored for mistake diagnostics.</Text>
            </View>

            <View style={styles.hairlineList}>
              {subjects.length > 0 ? (
                subjects.map((sub) => (
                  <View key={sub._id} style={styles.subjectRow}>
                    <Text style={styles.subjectName}>{sub.name}</Text>
                    <View style={styles.statusChip}>
                      <Text style={styles.subjectStatus}>Active</Text>
                    </View>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectName}>Physics</Text>
                    <View style={styles.statusChip}>
                      <Text style={styles.subjectStatus}>Active</Text>
                    </View>
                  </View>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectName}>Chemistry</Text>
                    <View style={styles.statusChip}>
                      <Text style={styles.subjectStatus}>Active</Text>
                    </View>
                  </View>
                  <View style={[styles.subjectRow, styles.subjectRowLast]}>
                    <Text style={styles.subjectName}>Math</Text>
                    <View style={styles.statusChip}>
                      <Text style={styles.subjectStatus}>Active</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Mock Tests Logged */}
          <View style={styles.section}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionTitle}>Logged tests</Text>
              <Text style={styles.sectionSubtitle}>Mock test series tagged with error photos.</Text>
            </View>

            {/* Quick add test */}
            <View style={styles.addTestRow}>
              <TextInput
                value={testName}
                onChangeText={setTestName}
                placeholder="e.g. Allen Minor 4, FIITJEE AITS 2"
                placeholderTextColor={colors.textMuted}
                style={[styles.textInput, styles.addTestInput]}
              />
              <TouchableOpacity
                onPress={handleCreateTest}
                disabled={isCreatingTest || !testName.trim()}
                style={[
                  styles.addTestBtn,
                  (!testName.trim() || isCreatingTest) && styles.addTestBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                {isCreatingTest ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addTestBtnText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.hairlineList}>
              {tests.length === 0 ? (
                <View style={styles.emptyTestsBox}>
                  <Text style={styles.emptyTestsText}>
                    No test series added yet. Add tests above to organize your errors by mock exam.
                  </Text>
                </View>
              ) : (
                tests.map((t, idx) => (
                  <View
                    key={t._id}
                    style={[styles.testRow, idx === tests.length - 1 && styles.testRowLast]}
                  >
                    <View style={styles.testInfo}>
                      <Text style={styles.testName}>{t.testName}</Text>
                      <Text style={styles.testDate}>
                        {t.testDate ? new Date(t.testDate).toLocaleDateString("en-IN") : "Recent"}
                      </Text>
                    </View>
                    <View style={styles.testErrorsPill}>
                      <Text style={styles.testErrorsCount}>
                        {t.mistakesCount || 0} {(t.mistakesCount || 0) === 1 ? "error" : "errors"}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySecondary, marginTop: 4 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  signOutText: { fontSize: 12, color: colors.accentRed, fontWeight: "600" },
  card: {
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 18,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { ...typography.caption, marginBottom: 7, fontWeight: "600", color: colors.textPrimary },
  textInput: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textInputDisabled: {
    color: colors.textMuted,
  },
  chipsRow: { flexDirection: "row", gap: 9, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12.5, fontWeight: "500", color: colors.textSecondary },
  chipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  saveSuccessRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectRowLast: { borderBottomWidth: 0 },
  subjectName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  statusChip: {
    backgroundColor: "rgba(92, 174, 130, 0.15)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  subjectStatus: { color: colors.accentGreen, fontSize: 11.5, fontWeight: "700" },
  addTestRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  addTestInput: { flex: 1 },
  addTestBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  addTestBtnDisabled: { opacity: 0.4 },
  addTestBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  testRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testRowLast: { borderBottomWidth: 0 },
  testInfo: { flex: 1, paddingRight: 10 },
  testName: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  testDate: { ...typography.caption, marginTop: 2 },
  testErrorsPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  testErrorsCount: { fontSize: 11.5, fontWeight: "600", color: colors.textSecondary },
  emptyTestsBox: { paddingVertical: 20 },
  emptyTestsText: { ...typography.bodySecondary },
});