import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { apiClient } from "../api/client";
import { Test, Mistake, Subject, Chapter } from "../types";

interface UploadCardProps {
  onSuccess: (newMistake: Mistake) => void;
  tests: Test[];
}

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
    apiClient.get("/syllabus")
      .then(res => {
        setSubjects(res.data.subjects || []);
        setChapters(res.data.chapters || []);
      })
      .catch(err => console.error("Failed to load syllabus", err));
  }, []);

  // Camera action
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

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setErrorMsg("Failed to open camera");
    }
  };

  // Gallery action
  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  // Upload handler
  const handleUpload = async () => {
    if (!imageUri) {
      setErrorMsg("Please photograph or select a question image.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();

      // In React Native, file in FormData requires uri, name, and type
      const filename = imageUri.split("/").pop() || "mistake.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("photo", blob, filename);
      } else {
        formData.append("photo", {
          uri: imageUri,
          name: filename,
          type: fileType,
        } as any);
      }

      if (selectedTestId) {
        formData.append("testId", selectedTestId);
      }

      if (selectedChapterId) {
        formData.append("chapterId", selectedChapterId);
      }

      const res = await apiClient.post("/mistakes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset state
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

      {/* Image Capture / Preview Box */}
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.previewActions}>
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={styles.previewButton}
            >
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.previewButton}
            >
              <Text style={styles.previewButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              style={styles.previewButton}
            >
              <Text style={[styles.previewButtonText, { color: colors.accentRed }]}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.captureBox}>
          <Text style={styles.capturePrompt}>
            Snap a photo of the incorrect question
          </Text>
          <View style={styles.captureButtonsRow}>
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={styles.cameraButton}
              activeOpacity={0.8}
            >
              <Text style={styles.cameraButtonText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.galleryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.galleryButtonText}>Choose from gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Test series selector (optional) */}
      {tests.length > 0 && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mock test (optional)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollChips}
          >
            <TouchableOpacity
              onPress={() => setSelectedTestId("")}
              style={[
                styles.chip,
                !selectedTestId && styles.chipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  !selectedTestId && styles.chipTextActive,
                ]}
              >
                No specific test
              </Text>
            </TouchableOpacity>
            {tests.map((t) => (
              <TouchableOpacity
                key={t._id}
                onPress={() => setSelectedTestId(t._id)}
                style={[
                  styles.chip,
                  selectedTestId === t._id && styles.chipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedTestId === t._id && styles.chipTextActive,
                  ]}
                >
                  {t.testName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Subject & Chapter selector (optional) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Subject & Chapter (optional)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollChips}
        >
          <TouchableOpacity
            onPress={() => { setSelectedSubjectId(""); setSelectedChapterId(""); }}
            style={[styles.chip, !selectedSubjectId && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, !selectedSubjectId && styles.chipTextActive]}>
              AI Auto-detect
            </Text>
          </TouchableOpacity>
          {subjects.map((s) => (
            <TouchableOpacity
              key={s._id}
              onPress={() => { setSelectedSubjectId(s._id); setSelectedChapterId(""); }}
              style={[styles.chip, selectedSubjectId === s._id && styles.chipActive]}
              activeOpacity={0.7}
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
              .filter((c) => c.subjectId === selectedSubjectId || (c.subjectId as any)?._id === selectedSubjectId)
              .map((c) => (
                <TouchableOpacity
                  key={c._id}
                  onPress={() => setSelectedChapterId(c._id)}
                  style={[styles.chip, selectedChapterId === c._id && styles.chipActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selectedChapterId === c._id && styles.chipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : null}
      </View>

      {/* Error message */}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {/* Upload button */}
      <TouchableOpacity
        onPress={handleUpload}
        disabled={isUploading}
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        activeOpacity={0.8}
      >
        {isUploading ? (
          <View style={styles.buttonInner}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Gemini AI is analyzing...</Text>
          </View>
        ) : (
          <Text style={styles.uploadButtonText}>Upload & Auto-Tag with AI</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 4,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...typography.caption,
    marginBottom: 14,
  },
  captureBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  capturePrompt: {
    ...typography.caption,
    marginBottom: 12,
  },
  captureButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  cameraButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 3,
  },
  cameraButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  galleryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 3,
  },
  galleryButtonText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "500",
  },
  previewContainer: {
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 3,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 6,
  },
  previewButton: {
    paddingVertical: 2,
  },
  previewButtonText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.primary,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: 6,
    fontWeight: "500",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 6,
  },
  scrollChips: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  typeOptionsGrid: {
    gap: 6,
  },
  typeOption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  typeOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  errorText: {
    color: colors.accentRed,
    fontSize: 11,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 3,
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
    fontSize: 12,
    fontWeight: "600",
  },
});
