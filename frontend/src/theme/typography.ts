import { Platform, TextStyle } from "react-native";

export const typography: { [key: string]: TextStyle } = {
  h1: {
    fontFamily: Platform.select({
      ios: "SpaceGrotesk-SemiBold",
      android: "SpaceGrotesk-SemiBold",
      default: "System",
    }),
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 28,
    color: "#14171C",
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: Platform.select({
      ios: "SpaceGrotesk-SemiBold",
      android: "SpaceGrotesk-SemiBold",
      default: "System",
    }),
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 22,
    color: "#14171C",
    letterSpacing: -0.3,
  },
  h3: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
    color: "#14171C",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: "#14171C",
  },
  bodySecondary: {
    fontSize: 12,
    lineHeight: 16,
    color: "#5C6470",
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    color: "#5C6470",
  },
  mono: {
    fontFamily: Platform.select({
      ios: "Courier New",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 11,
    color: "#5C6470",
  },
  impactNumber: {
    fontFamily: Platform.select({
      ios: "SpaceGrotesk-Bold",
      android: "SpaceGrotesk-Bold",
      default: "System",
    }),
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 44,
    letterSpacing: -1,
  },
};
