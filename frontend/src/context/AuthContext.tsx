import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../api/client";
import { User, TargetExam, AuthResponse } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    pass: string,
    targetExam: TargetExam,
    targetYear: number
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore stored session from AsyncStorage on app launch
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("qm_token");
        const storedUser = await AsyncStorage.getItem("qm_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify with backend
          try {
            const res = await apiClient.get("/users/me");
            if (res.data?.user) {
              setUser(res.data.user);
              await AsyncStorage.setItem(
                "qm_user",
                JSON.stringify(res.data.user)
              );
            }
          } catch (err: any) {
            if (err.response?.status === 401) {
              await AsyncStorage.multiRemove(["qm_token", "qm_user"]);
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to restore session from AsyncStorage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorage();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password: pass,
    });
    const { token: receivedToken, user: receivedUser } = res.data;
    
    await AsyncStorage.setItem("qm_token", receivedToken);
    await AsyncStorage.setItem("qm_user", JSON.stringify(receivedUser));
    
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    targetExam: TargetExam,
    targetYear: number
  ) => {
    const res = await apiClient.post<AuthResponse>("/auth/register", {
      name,
      email,
      password: pass,
      targetExam,
      targetYear,
    });
    const { token: receivedToken, user: receivedUser } = res.data;
    
    await AsyncStorage.setItem("qm_token", receivedToken);
    await AsyncStorage.setItem("qm_user", JSON.stringify(receivedUser));
    
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(["qm_token", "qm_user"]);
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await AsyncStorage.setItem("qm_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
