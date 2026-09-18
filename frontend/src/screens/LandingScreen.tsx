import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Target, Sparkles, TrendingDown, Calendar } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export const LandingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navBar}>
          <View style={styles.logoBrandRow}>
            <View style={styles.logoIconBox}>
              <Target size={16} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.logoTitle}>
              Question<Text style={styles.logoTitleHighlight}>Mark</Text>
            </Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.getStartedBtn}>
              <Text style={styles.getStartedBtnText}>Get started</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.heroSection, isDesktop ? styles.heroSectionDesktop : styles.heroSectionMobile]}>
          <View style={styles.heroTextCol}>
            <View style={styles.pillBadge}>
              <Sparkles size={14} color={colors.primary} strokeWidth={2.5} />
              <Text style={styles.pillBadgeText}>AI-powered JEE diagnostics</Text>
            </View>
            <Text style={[styles.heroHeadline, isDesktop ? { fontSize: 52, lineHeight: 60 } : { fontSize: 36, lineHeight: 42 }]}>
              Stop losing marks to careless errors.
            </Text>
            <Text style={styles.heroSubtitle}>
              Turn your weak spots into rank boosts. Upload mock tests, track patterns, and get targeted daily revision plans.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.heroCtaBtn}>
              <Text style={styles.heroCtaText}>Start tracking for free</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.heroVisualCol, isDesktop ? { marginLeft: 40 } : { marginTop: 40 }]}>
            <View style={styles.mockupWindow}>
              <View style={styles.mockupHeader}>
                <View style={styles.mockupDotRed} />
                <View style={styles.mockupDotAmber} />
                <View style={styles.mockupDotGreen} />
              </View>
              <View style={styles.mockupBody}>
                <View style={styles.mockupCard}>
                  <Text style={styles.mockupCardTitle}>Projected rank penalty</Text>
                  <View style={styles.mockupScoreRow}>
                    <TrendingDown size={32} color={colors.accentAmber} strokeWidth={2} />
                    <Text style={styles.mockupScore}>+2,000</Text>
                    <Text style={styles.mockupScoreUnit}>ranks</Text>
                  </View>
                  <View style={styles.mockupStatsRow}>
                    <View>
                      <Text style={styles.mockupStatLabel}>Careless mistakes</Text>
                      <Text style={styles.mockupStatValue}>1</Text>
                    </View>
                    <View>
                      <Text style={styles.mockupStatLabel}>Marks lost</Text>
                      <Text style={[styles.mockupStatValue, { color: colors.accentRed }]}>-5</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>Everything you need to secure your rank</Text>
          <View style={[styles.featuresGrid, isDesktop ? styles.featuresGridDesktop : styles.featuresGridMobile]}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Sparkles size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>AI Error Tagging</Text>
              <Text style={styles.featureDesc}>
                Snap a photo of a wrong question. Gemini instantly categorizes it as a concept gap, formula slip, or misread.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Target size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>Rank Impact Scoring</Text>
              <Text style={styles.featureDesc}>
                See exactly how many thousands of ranks your avoidable calculation errors are costing you in the real exam.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Calendar size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>Daily Revision Plans</Text>
              <Text style={styles.featureDesc}>
                Stop guessing what to study. Get algorithmically generated nightly revision blocks based on your active weak spots.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 64 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  logoBrandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIconBox: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  logoTitle: { ...typography.h2, fontSize: 22, color: colors.textPrimary, letterSpacing: -0.5 },
  logoTitleHighlight: { color: colors.primary },
  navRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  loginBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  loginBtnText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  getStartedBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  getStartedBtnText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },

  heroSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },
  heroSectionDesktop: { flexDirection: "row", alignItems: "center" },
  heroSectionMobile: { flexDirection: "column" },
  heroTextCol: { flex: 1, alignItems: "flex-start" },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillBadgeText: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  heroHeadline: {
    fontFamily: "System",
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.textSecondary,
    marginBottom: 32,
    maxWidth: 520,
  },
  heroCtaBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  heroCtaText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },

  heroVisualCol: { flex: 1, width: "100%", alignItems: "center" },
  mockupWindow: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  mockupHeader: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mockupDotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accentRed },
  mockupDotAmber: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accentAmber },
  mockupDotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accentGreen },
  mockupBody: { padding: 24, backgroundColor: colors.background },
  mockupCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mockupCardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 8 },
  mockupScoreRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  mockupScore: { fontSize: 42, fontWeight: "800", color: colors.accentAmber, letterSpacing: -1, marginHorizontal: 8 },
  mockupScoreUnit: { fontSize: 16, color: colors.textSecondary, fontWeight: "500", marginTop: 12 },
  mockupStatsRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  mockupStatLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  mockupStatValue: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },

  featuresSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  featuresSectionTitle: {
    ...typography.h2,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  featuresGrid: { gap: 24 },
  featuresGridDesktop: { flexDirection: "row" },
  featuresGridMobile: { flexDirection: "column" },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: { ...typography.h3, fontSize: 18, marginBottom: 12 },
  featureDesc: { ...typography.bodySecondary, fontSize: 15, lineHeight: 24 },
});