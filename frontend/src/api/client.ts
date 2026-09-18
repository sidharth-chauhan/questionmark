import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// In React Native development:
// - Android Emulator uses 10.0.2.2 to access host machine
// - iOS Simulator uses localhost
// - Physical devices can use EXPO_PUBLIC_API_URL or your local network IP
const getDefaultBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://localhost:5000/api";
};

export const API_BASE_URL = getDefaultBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Attach JWT token from AsyncStorage to all outbound requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("qm_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Error reading token from AsyncStorage:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth failures
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized response
      try {
        await AsyncStorage.multiRemove(["qm_token", "qm_user"]);
      } catch {}
    }
    return Promise.reject(error);
  }
);
