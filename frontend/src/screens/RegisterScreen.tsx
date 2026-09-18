import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import { TargetExam } from "../types";

export const RegisterScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetExam, setTargetExam] = useState<TargetExam>("JEE_MAIN");
  const [targetYear, setTargetYear] = useState<number>(2025);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register(name.trim(), email.trim(), password, targetExam, targetYear);
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMsg(
        err.response?.data?.error?.message ||
          "Registration failed. Please check details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoTitle}>Create aspirant profile</Text>
            <Text style={styles.subtitle}>
              Begin tracking question slips and computing rank impact.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Student name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={colors.textSecondary}
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="rahul@example.com"
                placeholderTextColor={colors.textSecondary}
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                style={styles.textInput}
              />
            </View>

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

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[
                styles.submitBtn,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Create account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already registered?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.switchBtn}
              >
                <Text style={styles.switchLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  logoTitle: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    borderRadius: 4,
  },
  errorBox: {
    backgroundColor: "#FDF2F0",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    padding: 10,
    borderRadius: 3,
    marginBottom: 14,
  },
  errorText: {
    color: colors.accentRed,
    fontSize: 12,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: 4,
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 3,
    fontSize: 13,
    color: colors.textPrimary,
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
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 3,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  switchText: {
    ...typography.caption,
  },
  switchBtn: {
    paddingVertical: 2,
  },
  switchLink: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
});
