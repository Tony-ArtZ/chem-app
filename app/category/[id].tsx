import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  MaterialCategory,
  MaterialType,
  Material,
  FileType,
} from "../../types/Material";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useMemo } from "react";
import { useMaterials } from "@/hooks/useMaterials";

// Modern gradient combinations for each category
const categoryGradients = {
  [MaterialCategory.JEE]: ["#FF416C", "#FF4B2B"],
  [MaterialCategory.NCERT]: ["#4776E6", "#8E54E9"],
  [MaterialCategory.NEET]: ["#00B09B", "#96C93D"],
  [MaterialCategory.OLYMPIAD]: ["#FDC830", "#F37335"],
  [MaterialCategory.CUET]: ["#5C258D", "#4389A2"],
  [MaterialCategory.NTSE]: ["#1A2980", "#26D0CE"],
};

// Class options by category
const getClassOptions = (category: MaterialCategory): number[] => {
  switch (category) {
    case MaterialCategory.JEE:
    case MaterialCategory.NEET:
      return [11, 12];
    case MaterialCategory.NCERT:
      return Array.from({ length: 7 }, (_, i) => i + 6); // 6 to 12
    case MaterialCategory.NTSE:
    case MaterialCategory.CUET:
      return [10, 11, 12];
    case MaterialCategory.OLYMPIAD:
    default:
      return [];
  }
};

// Icon mapping for different material types
const materialTypeIcons = {
  [MaterialType.MATERIAL]: "book-open-variant",
  [MaterialType.PYQ]: "clipboard-text-multiple",
  [MaterialType.SOLUTION]: "clipboard-check",
};

// Icon mapping for different file types
const fileTypeIcons = {
  [FileType.PDF]: { name: "file-pdf-box", color: "#FF5252" },
  [FileType.VIDEO]: { name: "video", color: "#2196F3" },
  [FileType.IMAGE]: { name: "image", color: "#4CAF50" },
};

const CategoryDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<MaterialType>(
    MaterialType.MATERIAL
  );

  // Type guard to ensure the id is a valid MaterialCategory
  const isCategoryValid = (value: string): value is MaterialCategory => {
    return Object.values(MaterialCategory).includes(value as MaterialCategory);
  };

  const categoryId = isCategoryValid(id) ? id : MaterialCategory.JEE;

  const getCategoryTitle = (category: MaterialCategory) => {
    switch (category) {
      case MaterialCategory.JEE:
        return "JEE Materials";
      case MaterialCategory.NCERT:
        return "NCERT Materials";
      case MaterialCategory.NEET:
        return "NEET Materials";
      case MaterialCategory.OLYMPIAD:
        return "Olympiad Materials";
      case MaterialCategory.CUET:
        return "CUET Materials";
      case MaterialCategory.NTSE:
        return "NTSE Materials";
      default:
        return "Study Materials";
    }
  };

  // Get class options for the current category
  const classOptions = useMemo(() => getClassOptions(categoryId), [categoryId]);

  // Set default selected class when category changes
  React.useEffect(() => {
    if (classOptions.length > 0) {
      setSelectedClass(classOptions[0]);
    } else {
      setSelectedClass(null);
    }
  }, [categoryId, classOptions]);

  // Fetch materials from Supabase
  const {
    materials: filteredMaterials,
    loading,
    error,
  } = useMaterials({
    category: categoryId,
    type: selectedTab,
    classNumber: selectedClass,
  });

  // Group materials by chapter
  const groupedMaterials = useMemo(() => {
    const grouped = filteredMaterials.reduce((acc, material) => {
      const chapterKey =
        material.chapter === null ? "General" : `Chapter ${material.chapter}`;

      if (!acc[chapterKey]) {
        acc[chapterKey] = [];
      }

      acc[chapterKey].push(material);
      return acc;
    }, {} as Record<string, Material[]>);

    return Object.entries(grouped).sort(([keyA], [keyB]) => {
      if (keyA === "General") return 1;
      if (keyB === "General") return -1;
      return keyA.localeCompare(keyB);
    });
  }, [filteredMaterials]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      <View className="relative">
        {/* Curvy Header */}
        <LinearGradient
          colors={categoryGradients[categoryId]}
          className="w-full"
          style={{ paddingTop: insets.top }}
        >
          <View className="px-4 py-6 flex flex-row items-center gap-4  h-fit pb-16">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full  items-center justify-center "
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-white">
                {getCategoryTitle(categoryId)}
              </Text>
            </View>
          </View>

          {/* Wave-like curve */}
          <View
            className="absolute bottom-0 left-0 right-0 h-12 bg-background"
            style={{
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              transform: [{ scaleX: 1.1 }],
            }}
          />
        </LinearGradient>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 -mt-2">
        {/* Class Filter */}
        {classOptions.length > 0 && (
          <View className="mb-4">
            <Text className="text-textDark text-lg font-bold mb-2">Class</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {classOptions.map((classOption) => (
                  <TouchableOpacity
                    key={classOption}
                    onPress={() =>
                      setSelectedClass(
                        selectedClass === classOption ? null : classOption
                      )
                    }
                    className={`px-4 py-2 rounded-full border ${
                      selectedClass === classOption
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`${
                        selectedClass === classOption
                          ? "text-white font-medium"
                          : "text-textDark"
                      }`}
                    >
                      Class {classOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Materials List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#ff7f24" />
              <Text className="text-gray-500 mt-4">Loading materials...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="error-outline" size={64} color="#f44336" />
              <Text className="text-gray-500 mt-4 text-center">
                Error loading materials. Please try again later.
              </Text>
            </View>
          ) : groupedMaterials.length > 0 ? (
            groupedMaterials.map(([chapter, materials]) => (
              <View key={chapter} className="mb-6">
                <Text className="text-lg font-bold text-textDark mb-2">
                  {chapter}
                </Text>
                <View className="space-y-2">
                  {materials.map((material) => (
                    <TouchableOpacity
                      key={material.id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                      onPress={() => {
                        router.push(`/viewer/${material.id}`);
                      }}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-10 h-10 rounded-md items-center justify-center mr-3"
                          style={{
                            backgroundColor: categoryGradients[categoryId][1],
                          }}
                        >
                          <MaterialCommunityIcons
                            name={materialTypeIcons[material.type]}
                            size={22}
                            color="white"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-textDark font-medium">
                            {material.name}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            {material.class && (
                              <Text className="text-gray-500 text-xs mr-2">
                                Class {material.class}
                              </Text>
                            )}
                            <View className="flex-row items-center">
                              <MaterialCommunityIcons
                                name={fileTypeIcons[material.file_type].name}
                                size={14}
                                color={fileTypeIcons[material.file_type].color}
                              />
                              <Text className="text-gray-500 text-xs ml-1">
                                {material.file_type.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{
                            backgroundColor:
                              fileTypeIcons[material.file_type].color + "20",
                          }}
                        >
                          <MaterialCommunityIcons
                            name={
                              material.file_type === FileType.PDF
                                ? "file-pdf-box"
                                : material.file_type === FileType.VIDEO
                                ? "play-circle"
                                : "image"
                            }
                            size={20}
                            color={fileTypeIcons[material.file_type].color}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="folder-off" size={64} color="#ccc" />
              <Text className="text-gray-400 mt-4 text-center">
                No materials found for the selected filters
              </Text>
            </View>
          )}
          <View className="h-20" />
        </ScrollView>
      </View>

      {/* Bottom Tab Navigator */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-2 pb-5"
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      >
        <View className="flex-row justify-around">
          {Object.values(MaterialType).map((type) => (
            <TouchableOpacity
              key={type}
              className="items-center"
              onPress={() => setSelectedTab(type)}
            >
              <View
                className={`p-2 rounded-full ${
                  selectedTab === type ? `bg-primary-light` : "bg-transparent"
                }`}
              >
                <MaterialCommunityIcons
                  name={materialTypeIcons[type]}
                  size={24}
                  color={selectedTab === type ? "#ff7f24" : "#888"}
                />
              </View>
              <Text
                className={`text-xs mt-1 ${
                  selectedTab === type
                    ? "text-primary font-medium"
                    : "text-gray-500"
                }`}
              >
                {type === MaterialType.MATERIAL
                  ? "Notes"
                  : type === MaterialType.PYQ
                  ? "PYQ"
                  : "Solutions"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CategoryDetails;
