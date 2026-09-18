import { TextStyle } from "react-native";

const base: TextStyle = {
  fontFamily: "System",
};

export const typography = {
  h1: {
    ...base,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: "#14171C",
  } as TextStyle,
  h2: {
    ...base,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: "#14171C",
  } as TextStyle,
  h3: {
    ...base,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
    color: "#14171C",
  } as TextStyle,
  body: {
    ...base,
    fontSize: 14,
    fontWeight: "400",
    color: "#14171C",
    lineHeight: 20,
  } as TextStyle,
  bodySecondary: {
    ...base,
    fontSize: 13,
    fontWeight: "400",
    color: "#5C6470",
    lineHeight: 19,
  } as TextStyle,
  caption: {
    ...base,
    fontSize: 12,
    fontWeight: "500",
    color: "#5C6470",
  } as TextStyle,
  mono: {
    ...base,
    fontSize: 11,
    fontWeight: "600",
    color: "#5C6470",
    letterSpacing: 0.2,
  } as TextStyle,
  impactNumber: {
    ...base,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
  } as TextStyle,
};