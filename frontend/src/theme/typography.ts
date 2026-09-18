import { Platform, TextStyle } from "react-native";
import { colors } from "./colors";

const base: TextStyle = {
  fontFamily: "System",
};

export const typography = {
  h1: {
    ...base,
    fontSize: Platform.OS === "web" ? 34 : 26,
    fontWeight: "800",
    letterSpacing: -0.8,
    color: colors.textPrimary,
  } as TextStyle,
  h2: {
    ...base,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: colors.textPrimary,
  } as TextStyle,
  h3: {
    ...base,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
    color: colors.textPrimary,
  } as TextStyle,
  body: {
    ...base,
    fontSize: 14,
    fontWeight: "400",
    color: colors.textPrimary,
    lineHeight: 20,
  } as TextStyle,
  bodySecondary: {
    ...base,
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 19,
  } as TextStyle,
  caption: {
    ...base,
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  } as TextStyle,
  mono: {
    ...base,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.2,
  } as TextStyle,
  impactNumber: {
    ...base,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    color: colors.textPrimary,
  } as TextStyle,
};