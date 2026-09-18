import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TrackScreen } from "../screens/TrackScreen";
import { WeakSpotsScreen } from "../screens/WeakSpotsScreen";
import { TonightsPlanScreen } from "../screens/TonightsPlanScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Target, AlertTriangle, Calendar, User, Menu, LogOut } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

export const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Track");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

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
        <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
          <View style={[styles.logoBox, isCollapsed && styles.logoBoxCollapsed]}>
            {!isCollapsed && (
              <View style={styles.logoTextWrap}>
                <Text style={styles.logoTitle}>QuestionMark</Text>
                <Text style={styles.logoSubtitle}>JEE diagnostic tool</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.menuBtn}>
              <Menu size={20} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <View style={styles.navMenu}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setActiveTab(item.id)}
                  style={[styles.navItem, isActive && styles.navItemActive, isCollapsed && styles.navItemCollapsed]}
                  activeOpacity={0.8}
                >
                  <Icon color={isActive ? "#FFFFFF" : colors.textSecondary} size={18} strokeWidth={2.5} />
                  {!isCollapsed && (
                    <Text style={[styles.navText, isActive && styles.navTextActive]}>
                      {item.label}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.spacer} />
          <TouchableOpacity
            onPress={() => {
              if (window.confirm("Are you sure you want to sign out?")) {
                logout();
              }
            }}
            style={[styles.navItem, isCollapsed && styles.navItemCollapsed]}
            activeOpacity={0.8}
          >
            <LogOut color={colors.accentRed} size={18} strokeWidth={2.5} />
            {!isCollapsed && <Text style={styles.signOutText}>Sign out</Text>}
          </TouchableOpacity>
        </View>
        <View style={styles.contentArea}>
          <View style={styles.webContentConstrain}>
            {renderScreen()}
          </View>
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
  sidebarCollapsed: {
    width: 80,
    paddingHorizontal: 12,
  },
  logoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  logoBoxCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  logoTextWrap: {
    flex: 1,
    paddingRight: 8,
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
  menuBtn: {
    padding: 4,
    marginTop: -2,
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
  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
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
  spacer: {
    flex: 1,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accentRed,
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webContentConstrain: {
    flex: 1,
    width: "100%",
    maxWidth: 880,
    alignSelf: "center",
  },
});
