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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Student details and target milestones.
            </Text>
          </View>

          <TouchableOpacity onPress={confirmSignOut} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
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
              placeholderTextColor={colors.textSecondary}
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
                style={[
                  styles.chip,
                  targetExam === "JEE_MAIN" && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    targetExam === "JEE_MAIN" && styles.chipTextActive,
                  ]}
                >
                  JEE Main
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTargetExam("JEE_ADVANCED")}
                style={[
                  styles.chip,
                  targetExam === "JEE_ADVANCED" && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    targetExam === "JEE_ADVANCED" && styles.chipTextActive,
                  ]}
                >
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
                >
                  <Text
                    style={[
                      styles.chipText,
                      targetYear === yr && styles.chipTextActive,
                    ]}
                  >
                    {yr}
                  </Text>
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

          <View style={styles.saveRow}>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={isSaving}
              style={styles.saveBtn}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save changes</Text>
              )}
            </TouchableOpacity>

            {saveSuccess && (
              <Text style={styles.saveSuccessText}>✓ Saved</Text>
            )}
          </View>
        </View>

        {/* Enrolled Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.sectionTitle}>Enrolled subjects</Text>
            <Text style={styles.sectionSubtitle}>
              Core subjects monitored for mistake diagnostics.
            </Text>
          </View>

          <View style={styles.hairlineList}>
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <View key={sub._id} style={styles.subjectRow}>
                  <Text style={styles.subjectName}>{sub.name}</Text>
                  <Text style={styles.subjectStatus}>Active</Text>
                </View>
              ))
            ) : (
              <>
                <View style={styles.subjectRow}>
                  <Text style={styles.subjectName}>Physics</Text>
                  <Text style={styles.subjectStatus}>Active</Text>
                </View>
                <View style={styles.subjectRow}>
                  <Text style={styles.subjectName}>Chemistry</Text>
                  <Text style={styles.subjectStatus}>Active</Text>
                </View>
                <View style={styles.subjectRow}>
                  <Text style={styles.subjectName}>Math</Text>
                  <Text style={styles.subjectStatus}>Active</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Mock Tests Logged */}
        <View style={styles.section}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.sectionTitle}>Logged tests</Text>
            <Text style={styles.sectionSubtitle}>
              Mock test series tagged with error photos.
            </Text>
          </View>

          {/* Quick add test */}
          <View style={styles.addTestRow}>
            <TextInput
              value={testName}
              onChangeText={setTestName}
              placeholder="e.g. Allen Minor 4, FIITJEE AITS 2"
              placeholderTextColor={colors.textSecondary}
              style={[styles.textInput, styles.addTestInput]}
            />
            <TouchableOpacity
              onPress={handleCreateTest}
              disabled={isCreatingTest || !testName.trim()}
              style={[
                styles.addTestBtn,
                (!testName.trim() || isCreatingTest) && styles.addTestBtnDisabled,
              ]}
            >
              <Text style={styles.addTestBtnText}>Add test</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hairlineList}>
            {tests.length === 0 ? (
              <View style={styles.emptyTestsBox}>
                <Text style={styles.emptyTestsText}>
                  No test series added yet. Add tests above to organize your
                  errors by mock exam.
                </Text>
              </View>
            ) : (
              tests.map((t) => (
                <View key={t._id} style={styles.testRow}>
                  <View>
                    <Text style={styles.testName}>{t.testName}</Text>
                    <Text style={styles.testDate}>
                      {t.testDate
                        ? new Date(t.testDate).toLocaleDateString("en-IN")
                        : "Recent"}
                    </Text>
                  </View>
                  <Text style={styles.testErrorsCount}>
                    {t.mistakesCount || 0}{" "}
                    {(t.mistakesCount || 0) === 1 ? "error" : "errors"}
                  </Text>
                </View>
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
  signOutBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  signOutText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 4,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 3,
    fontSize: 12,
    color: colors.textPrimary,
  },
  textInputDisabled: {
    backgroundColor: colors.surfaceSubtle,
    color: colors.textSecondary,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 3,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  saveSuccessText: {
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
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  subjectStatus: {
    ...typography.caption,
  },
  addTestRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  addTestInput: {
    flex: 1,
  },
  addTestBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 3,
  },
  addTestBtnDisabled: {
    opacity: 0.4,
  },
  addTestBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  testRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  testDate: {
    ...typography.caption,
    marginTop: 1,
  },
  testErrorsCount: {
    ...typography.caption,
  },
  emptyTestsBox: {
    paddingVertical: 16,
  },
  emptyTestsText: {
    ...typography.caption,
  },
});
