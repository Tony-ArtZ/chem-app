import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCategory, MaterialType, FileType } from "@/types/Material";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";

interface UploadFormProps {
  onUploadComplete?: () => void;
}

export const UploadForm = ({ onUploadComplete }: UploadFormProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MaterialCategory>(
    MaterialCategory.JEE
  );
  const [materialType, setMaterialType] = useState<MaterialType>(
    MaterialType.MATERIAL
  );
  const [fileType, setFileType] = useState<FileType>(FileType.PDF);
  const [chapter, setChapter] = useState<string>("");
  const [classValue, setClassValue] = useState<string>("11");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(
    null
  );
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define available classes based on category
  const getAvailableClasses = () => {
    switch (category) {
      case MaterialCategory.JEE:
      case MaterialCategory.NEET:
        return [11, 12];
      case MaterialCategory.NCERT:
        return [6, 7, 8, 9, 10, 11, 12];
      case MaterialCategory.CUET:
      case MaterialCategory.NTSE:
        return [10, 11, 12];
      case MaterialCategory.OLYMPIAD:
        return null; // No class for Olympiad
      default:
        return [11, 12];
    }
  };

  const availableClasses = getAvailableClasses();

  const handleFilePick = async () => {
    if (fileType === FileType.VIDEO) {
      // Don't pick files for video type as we'll use YouTube URL
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: fileType === FileType.PDF ? "application/pdf" : "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        setFile(result);
      }
    } catch (err) {
      setError("Error selecting file");
      console.error(err);
    }
  };

  const validateYoutubeUrl = (url: string): boolean => {
    // Basic validation for YouTube URL
    return (
      url.trim().length > 0 &&
      (url.includes("youtube.com/watch") ||
        url.includes("youtu.be/") ||
        url.includes("youtube.com/embed"))
    );
  };

  const handleUpload = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (fileType === FileType.VIDEO) {
      if (!validateYoutubeUrl(youtubeUrl)) {
        setError("Please enter a valid YouTube URL");
        return;
      }
    } else if (!file || file.canceled) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fileUrl = "";

      // For video type, we just use the YouTube URL
      if (fileType === FileType.VIDEO) {
        fileUrl = youtubeUrl;
      } else {
        // For PDF and images, upload to Supabase storage
        if (file?.assets && file.assets.length > 0) {
          const selectedFile = file.assets[0];
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `materials/${category}/${fileName}`;

          // Upload file to Supabase storage
          const { data: storageData, error: storageError } =
            await supabase.storage.from("materials").upload(filePath, {
              uri: selectedFile.uri,
              type: selectedFile.mimeType,
              name: selectedFile.name,
            });

          if (storageError) {
            throw new Error(storageError.message);
          }

          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from("materials")
            .getPublicUrl(filePath);

          fileUrl = urlData.publicUrl;
        }
      }

      // Insert metadata into database
      const { error: dbError } = await supabase.from("materials").insert({
        name,
        file_type: fileType,
        file_url: fileUrl,
        chapter: chapter ? parseInt(chapter) : null,
        class: availableClasses ? parseInt(classValue) : null,
        type: materialType,
        category,
      });

      if (dbError) {
        throw new Error(dbError.message);
      }

      Alert.alert("Success", "Material uploaded successfully");
      resetForm();
      if (onUploadComplete) onUploadComplete();
    } catch (err: any) {
      setError(err.message || "Error uploading file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory(MaterialCategory.JEE);
    setMaterialType(MaterialType.MATERIAL);
    setFileType(FileType.PDF);
    setChapter("");
    setClassValue("11");
    setFile(null);
    setYoutubeUrl("");
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary py-5 px-4 rounded-b-3xl shadow-md mb-4">
        <View className="flex-row items-center justify-center">
          <Ionicons name="cloud-upload-outline" size={28} color="white" />
          <Text className="text-2xl font-bold ml-2 text-white">
            Upload Study Material
          </Text>
        </View>
        <Text className="text-white text-center mt-2 opacity-80">
          Share resources with the community
        </Text>
      </View>

      <View className="p-5">
        {error && (
          <View className="bg-red-100 p-3 rounded-xl mb-5">
            <Text className="text-primary-dark font-medium text-center">
              {error}
            </Text>
          </View>
        )}

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-textDark">
            Material Name
          </Text>
          <TextInput
            className="border border-secondary rounded-xl p-4 bg-white text-textDark"
            value={name}
            onChangeText={setName}
            placeholder="Enter material name"
            placeholderTextColor="#666"
          />
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-textDark">
            Category
          </Text>
          <View className="border border-secondary rounded-xl overflow-hidden bg-white shadow-sm">
            <Picker
              selectedValue={category}
              onValueChange={(value) => {
                setCategory(value);
                // Reset class value for compatibility
                if (value === MaterialCategory.OLYMPIAD) {
                  setClassValue("");
                } else if (
                  value === MaterialCategory.JEE ||
                  value === MaterialCategory.NEET
                ) {
                  setClassValue("11");
                } else if (
                  value === MaterialCategory.CUET ||
                  value === MaterialCategory.NTSE
                ) {
                  setClassValue("10");
                } else if (value === MaterialCategory.NCERT) {
                  setClassValue("6");
                }
              }}
              className="h-12 text-textDark"
            >
              {Object.values(MaterialCategory).map((cat) => (
                <Picker.Item key={cat} label={cat.toUpperCase()} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-textDark">
            Material Type
          </Text>
          <View className="border border-secondary rounded-xl overflow-hidden bg-white shadow-sm">
            <Picker
              selectedValue={materialType}
              onValueChange={(value) => setMaterialType(value)}
              className="h-12 text-textDark"
            >
              {Object.values(MaterialType).map((type) => (
                <Picker.Item
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  value={type}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-textDark">
            File Type
          </Text>
          <View className="border border-secondary rounded-xl overflow-hidden bg-white shadow-sm">
            <Picker
              selectedValue={fileType}
              onValueChange={(value) => setFileType(value)}
              className="h-12 text-textDark"
            >
              {Object.values(FileType).map((type) => (
                <Picker.Item
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  value={type}
                />
              ))}
            </Picker>
          </View>
        </View>

        {category !== MaterialCategory.OLYMPIAD && (
          <View className="mb-5">
            <Text className="text-base font-semibold mb-2 text-textDark">
              Class
            </Text>
            <View className="border border-secondary rounded-xl overflow-hidden bg-white shadow-sm">
              <Picker
                selectedValue={classValue}
                onValueChange={(value) => setClassValue(value)}
                className="h-12 text-textDark"
                enabled={availableClasses !== null}
              >
                {availableClasses?.map((cls) => (
                  <Picker.Item
                    key={cls}
                    label={`Class ${cls}`}
                    value={cls.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-textDark">
            Chapter Number (optional)
          </Text>
          <TextInput
            className="border border-secondary rounded-xl p-4 bg-white text-textDark"
            value={chapter}
            onChangeText={setChapter}
            placeholder="Enter chapter number"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {fileType === FileType.VIDEO ? (
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 text-textDark">
              YouTube Video URL
            </Text>
            <TextInput
              className="border border-secondary rounded-xl p-4 bg-white text-textDark"
              value={youtubeUrl}
              onChangeText={setYoutubeUrl}
              placeholder="Enter YouTube video URL"
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="url"
            />
            {youtubeUrl !== "" && !validateYoutubeUrl(youtubeUrl) && (
              <Text className="text-red-500 mt-1">
                Please enter a valid YouTube URL
              </Text>
            )}
          </View>
        ) : (
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 text-textDark">
              Upload File
            </Text>
            <TouchableOpacity
              className={`${
                file && !file.canceled ? "bg-accent" : "bg-primary-light"
              } p-4 rounded-xl flex-row items-center justify-center shadow-sm`}
              onPress={handleFilePick}
            >
              <Ionicons
                name={
                  file && !file.canceled
                    ? "document-text"
                    : "cloud-upload-outline"
                }
                size={24}
                color="#333"
                style={{ marginRight: 8 }}
              />
              <Text className="text-textDark font-semibold text-base">
                {file && !file.canceled ? "Change File" : "Select File"}
              </Text>
            </TouchableOpacity>

            {file &&
              !file.canceled &&
              file.assets &&
              file.assets.length > 0 && (
                <View className="mt-3 bg-white p-3 rounded-xl border border-secondary flex-row items-center">
                  <Ionicons
                    name={fileType === FileType.PDF ? "document-text" : "image"}
                    size={20}
                    color="#ff7f24"
                  />
                  <Text
                    className="ml-2 text-gray-600 flex-1"
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {file.assets[0].name}
                  </Text>
                  <TouchableOpacity onPress={() => setFile(null)}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
          </View>
        )}

        <TouchableOpacity
          className={`${
            loading ? "bg-primary-light" : "bg-primary"
          } p-4 rounded-xl items-center mt-4 shadow-md flex-row justify-center`}
          onPress={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="rocket-outline"
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-lg">
                Upload Material
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
