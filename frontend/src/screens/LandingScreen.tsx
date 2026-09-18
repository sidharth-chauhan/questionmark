import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Target,
  Sparkles,
  TrendingDown,
  Calendar,
  Camera,
  Flame,
  Star,
  ArrowRight,
} from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export const LandingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navbar */}
        <View style={styles.navBar}>
          <View style={styles.logoBrandRow}>
            <Image
              source={require("../../assests/pic/questionmark-vibrant-v2-512.png")}
              style={styles.logoIconImage}
              resizeMode="contain"
            />
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

        {/* Hero */}
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
            <View style={styles.heroCtaRow}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.heroCtaBtn}>
                <Text style={styles.heroCtaText}>Start tracking for free</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroSecondaryBtn}>
                <Text style={styles.heroSecondaryText}>See how it works</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heroTrustLine}>No credit card required · Free forever plan</Text>
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
                <View style={styles.mockupMiniChip}>
                  <Flame size={13} color={colors.accentAmber} strokeWidth={2.5} />
                  <Text style={styles.mockupMiniChipText}>7 day streak</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={[styles.statsRow, isDesktop ? styles.statsRowDesktop : styles.statsRowMobile]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12,000+</Text>
              <Text style={styles.statLabel}>Mistakes tracked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>Fewer repeat errors</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Subjects covered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>AI diagnosis</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionEyebrow}>WHY QUESTIONMARK</Text>
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
                <Target size={22} color={colors.accentRed} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>Rank Impact Scoring</Text>
              <Text style={styles.featureDesc}>
                See exactly how many thousands of ranks your avoidable calculation errors are costing you in the real exam.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Calendar size={22} color={colors.accentGreen} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>Daily Revision Plans</Text>
              <Text style={styles.featureDesc}>
                Stop guessing what to study. Get algorithmically generated nightly revision blocks based on your active weak spots.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Flame size={22} color={colors.accentAmber} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>Streak Tracking</Text>
              <Text style={styles.featureDesc}>
                Build a daily logging habit. Visual streaks keep you consistent through the final stretch before your exam.
              </Text>
            </View>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howSection}>
          <Text style={styles.sectionEyebrow}>HOW IT WORKS</Text>
          <Text style={styles.featuresSectionTitle}>From mistake to mastery in three steps</Text>
          <View style={[styles.howGrid, isDesktop ? styles.howGridDesktop : styles.howGridMobile]}>
            <View style={styles.howStep}>
              <View style={styles.howStepNumberRow}>
                <View style={styles.howNumberBadge}>
                  <Text style={styles.howNumberText}>1</Text>
                </View>
                <Camera size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.howStepTitle}>Photograph the mistake</Text>
              <Text style={styles.howStepDesc}>
                Right after a mock test, snap every question you got wrong. No manual typing needed.
              </Text>
            </View>
            <View style={styles.howStep}>
              <View style={styles.howStepNumberRow}>
                <View style={styles.howNumberBadge}>
                  <Text style={styles.howNumberText}>2</Text>
                </View>
                <Sparkles size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.howStepTitle}>AI tags the error type</Text>
              <Text style={styles.howStepDesc}>
                Gemini classifies each slip as a concept gap, calculation error, or misread — instantly.
              </Text>
            </View>
            <View style={styles.howStep}>
              <View style={styles.howStepNumberRow}>
                <View style={styles.howNumberBadge}>
                  <Text style={styles.howNumberText}>3</Text>
                </View>
                <Calendar size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.howStepTitle}>Get your nightly plan</Text>
              <Text style={styles.howStepDesc}>
                Wake up to a focused revision block built around your actual weak chapters, not generic advice.
              </Text>
            </View>
          </View>
        </View>

        {/* Testimonial */}
        <View style={styles.testimonialSection}>
          <View style={styles.testimonialCard}>
            <View style={styles.testimonialStarsRow}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={16} color={colors.accentAmber} fill={colors.accentAmber} strokeWidth={0} />
              ))}
            </View>
            <Text style={styles.testimonialQuote}>
              "I used to lose 15-20 marks every mock test to silly calculation slips. QuestionMark showed me it was
              always the same two chapters — fixing that alone moved my rank up by thousands."
            </Text>
            <Text style={styles.testimonialAuthor}>Aarav S.</Text>
            <Text style={styles.testimonialRole}>JEE Advanced aspirant, Batch of 2026</Text>
          </View>
        </View>

        {/* Final CTA band */}
        <View style={styles.ctaBand}>
          <Text style={styles.ctaBandTitle}>Ready to stop repeating the same mistakes?</Text>
          <Text style={styles.ctaBandSubtitle}>
            Join thousands of JEE aspirants turning careless errors into rank gains.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.ctaBandBtn}>
            <Text style={styles.ctaBandBtnText}>Create your free account</Text>
            <ArrowRight size={18} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.logoBrandRow}>
            <Image
              source={require("../../assests/pic/questionmark-vibrant-v2-512.png")}
              style={styles.footerLogoImage}
              resizeMode="contain"
            />
            <Text style={styles.footerLogoTitle}>
              Question<Text style={styles.logoTitleHighlight}>Mark</Text>
            </Text>
          </View>
          <Text style={styles.footerTagline}>Targeting errors, not volume.</Text>
          <Text style={styles.footerCopyright}>© {new Date().getFullYear()} QuestionMark. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 0 },

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
  logoBrandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoIconImage: { width: 30, height: 30, borderRadius: 8 },
  logoTitle: { ...typography.h2, fontSize: 22, color: colors.textPrimary, letterSpacing: -0.5 },
  logoTitleHighlight: { color: colors.accentRed },
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
    paddingTop: 56,
    paddingBottom: 72,
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
    marginBottom: 28,
    maxWidth: 520,
  },
  heroCtaRow: { flexDirection: "row", alignItems: "center", gap: 16, flexWrap: "wrap" },
  heroCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  heroCtaText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  heroSecondaryBtn: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  heroSecondaryText: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
  heroTrustLine: { marginTop: 16, fontSize: 13, color: colors.textMuted },

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
  mockupBody: { padding: 24, backgroundColor: colors.background, gap: 16 },
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
  mockupMiniChip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mockupMiniChipText: { fontSize: 12, fontWeight: "600", color: colors.textPrimary },

  statsStrip: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 32,
  },
  statsRow: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  statsRowDesktop: { flexDirection: "row", justifyContent: "space-between" },
  statsRowMobile: { flexDirection: "column" },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 30, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5 },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: "center" },

  featuresSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 10,
  },
  featuresSectionTitle: {
    ...typography.h2,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  featuresGrid: { gap: 20 },
  featuresGridDesktop: { flexDirection: "row" },
  featuresGridMobile: { flexDirection: "column" },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 28,
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
  featureTitle: { ...typography.h3, fontSize: 17, marginBottom: 10 },
  featureDesc: { ...typography.bodySecondary, fontSize: 14, lineHeight: 22 },

  howSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 88,
  },
  howGrid: { gap: 24 },
  howGridDesktop: { flexDirection: "row" },
  howGridMobile: { flexDirection: "column" },
  howStep: { flex: 1 },
  howStepNumberRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  howNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  howNumberText: { fontSize: 14, fontWeight: "800", color: colors.primary },
  howStepTitle: { ...typography.h3, fontSize: 17, marginBottom: 8 },
  howStepDesc: { ...typography.bodySecondary, fontSize: 14, lineHeight: 22 },

  testimonialSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 88,
  },
  testimonialCard: {
    maxWidth: 680,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 36,
    alignItems: "center",
  },
  testimonialStarsRow: { flexDirection: "row", gap: 4, marginBottom: 20 },
  testimonialQuote: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  testimonialAuthor: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  testimonialRole: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  ctaBand: {
    marginTop: 88,
    marginHorizontal: 24,
    maxWidth: 1152,
    alignSelf: "center",
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  ctaBandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  ctaBandSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 28,
    maxWidth: 440,
  },
  ctaBandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  ctaBandBtnText: { fontSize: 16, fontWeight: "700", color: colors.primary },

  footer: {
    marginTop: 72,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLogoImage: { width: 24, height: 24, borderRadius: 6 },
  footerLogoTitle: { ...typography.h2, fontSize: 18, color: colors.textPrimary, letterSpacing: -0.5 },
  footerTagline: { fontSize: 13, color: colors.textSecondary, marginTop: 10 },
  footerCopyright: { fontSize: 12, color: colors.textMuted, marginTop: 20 },
});