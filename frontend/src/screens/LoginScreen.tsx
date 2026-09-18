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
      setErrorMsg(
        err.response?.data?.message || "Invalid credentials. Please try again."
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
            <Text style={styles.logoTitle}>QuestionMark</Text>
            <Text style={styles.subtitle}>
              Sign in to review mistake patterns and nightly revision blocks.
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
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="aspirant@example.com"
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
                <Text style={styles.submitBtnText}>Sign in</Text>
              )}
            </TouchableOpacity>

            {/* Demo credentials hint */}
            <View style={styles.demoBox}>
              <Text style={styles.demoLabel}>Demo account:</Text>
              <Text style={styles.demoText}>
                student@jee.com / password123
              </Text>
            </View>

            {/* Switch to register */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Need an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                style={styles.switchBtn}
              >
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  logoTitle: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
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
  demoBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  demoText: {
    ...typography.mono,
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
