import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TrackScreen } from "../screens/TrackScreen";
import { WeakSpotsScreen } from "../screens/WeakSpotsScreen";
import { TonightsPlanScreen } from "../screens/TonightsPlanScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { colors } from "../theme/colors";
import { Target, AlertTriangle, Calendar, User } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
          height: Platform.OS === "web" ? 66 : 60,
          paddingBottom: Platform.OS === "web" ? 2 : 8,
          paddingTop: Platform.OS === "web" ? 8 : 8,
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
