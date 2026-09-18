import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TrackScreen } from "../screens/TrackScreen";
import { WeakSpotsScreen } from "../screens/WeakSpotsScreen";
import { TonightsPlanScreen } from "../screens/TonightsPlanScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Target, AlertTriangle, Calendar, User } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Track");

  if (Platform.OS === "web") {
    const renderScreen = () => {
      switch (activeTab) {
        case "Track": return <TrackScreen />;
        case "WeakSpots": return <WeakSpotsScreen />;
        case "TonightsPlan": return <TonightsPlanScreen />;
        case "Profile": return <ProfileScreen />;
        default: return <TrackScreen />;
      }
    };

    const navItems = [
      { id: "Track", label: "Track", icon: Target },
      { id: "WeakSpots", label: "Weak spots", icon: AlertTriangle },
      { id: "TonightsPlan", label: "Tonight's plan", icon: Calendar },
      { id: "Profile", label: "Profile", icon: User },
    ];

    return (
      <View style={styles.webLayout}>
        <View style={styles.sidebar}>
          <View style={styles.logoBox}>
            <Text style={styles.logoTitle}>QuestionMark</Text>
            <Text style={styles.logoSubtitle}>JEE diagnostic tool</Text>
          </View>
          <View style={styles.navMenu}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setActiveTab(item.id)}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  activeOpacity={0.8}
                >
                  <Icon color={isActive ? "#FFFFFF" : colors.textSecondary} size={18} strokeWidth={2.5} />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.contentArea}>
          {renderScreen()}
        </View>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: -0.2,
        },
      }}
    >
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          tabBarLabel: "Track",
          tabBarIcon: ({ color, size }) => (
            <Target size={size || 20} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="WeakSpots"
        component={WeakSpotsScreen}
        options={{
          tabBarLabel: "Weak spots",
          tabBarIcon: ({ color, size }) => (
            <AlertTriangle size={size || 20} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="TonightsPlan"
        component={TonightsPlanScreen}
        options={{
          tabBarLabel: "Tonight's plan",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size || 20} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size || 20} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  webLayout: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },
  sidebar: {
    width: 250,
    backgroundColor: colors.background,
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  logoBox: {
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  logoTitle: {
    ...typography.h2,
    fontSize: 20,
    color: colors.primary,
  },
  logoSubtitle: {
    ...typography.caption,
    marginTop: 4,
    color: colors.textSecondary,
  },
  navMenu: {
    gap: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  navTextActive: {
    color: "#FFFFFF",
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
