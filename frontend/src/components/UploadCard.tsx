import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon, Sparkles, X } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { apiClient } from "../api/client";
import { Test, Mistake, Subject, Chapter } from "../types";

interface UploadCardProps {
  onSuccess: (newMistake: Mistake) => void;
  tests: Test[];
}

const AnimatedPressable: React.FC<{
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onPress, style, children, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const UploadCard: React.FC<UploadCardProps> = ({ onSuccess, tests }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  useEffect(() => {
    apiClient
      .get("/syllabus")
      .then((res) => {
        setSubjects(res.data.subjects || []);
        setChapters(res.data.chapters || []);
      })
      .catch((err) => console.error("Failed to load syllabus", err));
  }, []);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to photograph questions from test papers."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setErrorMsg("Failed to open camera");
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Photo library access is needed to select question photos."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Image picker error:", err);
      setErrorMsg("Failed to select image");
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      setErrorMsg("Please photograph or select a question image.");
      return;
    }
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "mistake.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("photo", blob, filename);
      } else {
        formData.append("photo", { uri: imageUri, name: filename, type: fileType } as any);
      }
      if (selectedTestId) formData.append("testId", selectedTestId);
      if (selectedChapterId) formData.append("chapterId", selectedChapterId);

      const res = await apiClient.post("/mistakes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUri(null);
      setSelectedSubjectId("");
      setSelectedChapterId("");
      onSuccess(res.data.mistake || res.data);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to upload mistake. Check your network connection."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Log a wrong question</Text>
      <Text style={styles.cardSubtitle}>
        Capture mock test errors to compute rank penalties and targeted revision.
      </Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewActions}>
            <AnimatedPressable onPress={handleTakePhoto} style={styles.previewPill}>
              <Camera size={13} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.previewPillText}>Retake</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={handlePickImage} style={styles.previewPill}>
              <ImageIcon size={13} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.previewPillText}>Change</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={() => setImageUri(null)} style={styles.previewPillDanger}>
              <X size={13} color={colors.accentRed} strokeWidth={2} />
              <Text style={[styles.previewPillText, { color: colors.accentRed }]}>Remove</Text>
            </AnimatedPressable>
          </View>
        </View>
      ) : (
        <View style={styles.captureBox}>
          <View style={styles.captureIconWrap}>
            <Camera size={20} color={colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={styles.capturePrompt}>Snap a photo of the incorrect question</Text>
          <View style={styles.captureButtonsRow}>
            <AnimatedPressable onPress={handleTakePhoto} style={styles.cameraButton}>
              <Camera size={14} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.cameraButtonText}>Take photo</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={handlePickImage} style={styles.galleryButton}>
              <ImageIcon size={14} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.galleryButtonText}>Choose file</Text>
            </AnimatedPressable>
          </View>
        </View>
      )}

      {tests.length > 0 && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mock test</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
            <TouchableOpacity
              onPress={() => setSelectedTestId("")}
              style={[styles.chip, !selectedTestId && styles.chipActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, !selectedTestId && styles.chipTextActive]}>
                No specific test
              </Text>
            </TouchableOpacity>
            {tests.map((t) => (
              <TouchableOpacity
                key={t._id}
                onPress={() => setSelectedTestId(t._id)}
                style={[styles.chip, selectedTestId === t._id && styles.chipActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, selectedTestId === t._id && styles.chipTextActive]}>
                  {t.testName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Subject and chapter</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
          <TouchableOpacity
            onPress={() => {
              setSelectedSubjectId("");
              setSelectedChapterId("");
            }}
            style={[styles.chip, styles.chipAi, !selectedSubjectId && styles.chipActive]}
            activeOpacity={0.75}
          >
            <Sparkles size={12} color={!selectedSubjectId ? "#FFFFFF" : colors.primary} strokeWidth={2} />
            <Text style={[styles.chipText, !selectedSubjectId && styles.chipTextActive, { marginLeft: 4 }]}>
              Auto-detect
            </Text>
          </TouchableOpacity>
          {subjects.map((s) => (
            <TouchableOpacity
              key={s._id}
              onPress={() => {
                setSelectedSubjectId(s._id);
                setSelectedChapterId("");
              }}
              style={[styles.chip, selectedSubjectId === s._id && styles.chipActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, selectedSubjectId === s._id && styles.chipTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedSubjectId ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.scrollChips, { marginTop: 8 }]}
          >
            {chapters
              .filter(
                (c) =>
                  c.subjectId === selectedSubjectId ||
                  (c.subjectId as any)?._id === selectedSubjectId
              )
              .map((c) => (
                <TouchableOpacity
                  key={c._id}
                  onPress={() => setSelectedChapterId(c._id)}
                  style={[styles.chip, selectedChapterId === c._id && styles.chipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, selectedChapterId === c._id && styles.chipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : null}
      </View>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <AnimatedPressable
        onPress={handleUpload}
        disabled={isUploading}
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
      >
        {isUploading ? (
          <View style={styles.buttonInner}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Gemini is analyzing...</Text>
          </View>
        ) : (
          <View style={styles.buttonInner}>
            <Sparkles size={14} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload and auto-tag</Text>
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#14171C",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...typography.bodySecondary,
    marginBottom: 16,
  },
  captureBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    paddingVertical: 26,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  captureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  capturePrompt: {
    ...typography.bodySecondary,
    marginBottom: 16,
  },
  captureButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cameraButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  galleryButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  previewContainer: {
    marginBottom: 18,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  previewPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewPillDanger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.accentRedTint,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: 8,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  scrollChips: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipAi: {
    borderColor: colors.primary,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  errorText: {
    color: colors.accentRed,
    fontSize: 12,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});