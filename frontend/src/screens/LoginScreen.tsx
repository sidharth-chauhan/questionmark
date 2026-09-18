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

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("student@jee.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.logoTitle}>QuestionMark</Text>
            <Text style={styles.subtitle}>
              Sign in to review mistake patterns and nightly revision blocks.
            </Text>
          </View>

          <View style={styles.card}>
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="aspirant@example.com"
                placeholderTextColor={colors.textMuted}
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
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <View style={styles.demoBox}>
              <Text style={styles.demoLabel}>Demo account</Text>
              <Text style={styles.demoText}>student@jee.com · password123</Text>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Need an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.switchBtn}>
                <Text style={styles.switchLink}>Create student profile</Text>
              </TouchableOpacity>
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
  scrollContent: { paddingHorizontal: 22, paddingTop: 56, paddingBottom: 32 },
  header: { marginBottom: 28 },
  logoTitle: { ...typography.h1, fontSize: 28, fontWeight: "800" },
  subtitle: { ...typography.bodySecondary, marginTop: 6, lineHeight: 20 },
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
  errorBox: {
    backgroundColor: colors.accentRedTint,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.accentRed, fontSize: 12.5, fontWeight: "500" },
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
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  demoBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  demoText: { ...typography.mono },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
  },
  switchText: { ...typography.bodySecondary },
  switchBtn: { paddingVertical: 2 },
  switchLink: { fontSize: 12.5, color: colors.primary, fontWeight: "700" },
});