import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import { supabase } from "../../utils/supabase";
import { Material, FileType } from "../../types/Material";
import { Ionicons } from "@expo/vector-icons";

const MaterialViewer = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("materials")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setMaterial(data as Material);
      } catch (err: any) {
        console.error("Error fetching material:", err);
        setError(err.message || "Failed to load material");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMaterial();
    }
  }, [id]);

  // Function to extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderContent = () => {
    if (!material) return null;

    switch (material.file_type) {
      case FileType.IMAGE:
        return (
          <View className="bg-gray-100 rounded-lg overflow-hidden items-center justify-center shadow-md">
            <Image
              source={{ uri: material.file_url }}
              className="w-full h-96 bg-white"
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={`Image: ${material.name}`}
            />
          </View>
        );

      case FileType.PDF:
        return (
          <TouchableOpacity
            className="bg-white rounded-xl p-6 items-center border border-gray-200 shadow-sm mx-2 my-4"
            onPress={() => Linking.openURL(material.file_url)}
            activeOpacity={0.7}
          >
            <View className="w-20 h-20 bg-red-600 rounded-lg justify-center items-center mb-4 shadow-sm">
              <Ionicons name="document-text" size={40} color="white" />
            </View>
            <Text className="text-lg font-bold mb-2 text-textDark">
              Open PDF Document
            </Text>
            <Text className="text-primary text-base text-center">
              {material.name}
            </Text>
          </TouchableOpacity>
        );

      case FileType.VIDEO:
        const videoId = getYoutubeVideoId(material.file_url);
        if (!videoId) {
          return (
            <View className="p-4 bg-red-50 rounded-lg border border-red-200">
              <Text className="text-red-600 text-center font-medium">
                Invalid YouTube URL
              </Text>
            </View>
          );
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <View className="h-72 rounded-xl overflow-hidden shadow-md my-4">
            <WebView
              className="flex-1"
              javaScriptEnabled={true}
              source={{ uri: embedUrl }}
              allowsFullscreenVideo={true}
            />
          </View>
        );

      default:
        return (
          <View className="p-4 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-red-600 text-center font-medium">
              Unsupported file type
            </Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-background">
        <ActivityIndicator size="large" color="#ff7f24" />
        <Text className="mt-4 text-base text-textDark">
          Loading material...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-background">
        <Ionicons name="alert-circle" size={48} color="red" />
        <Text className="mt-4 text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  if (!material) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-background">
        <Ionicons name="document-outline" size={48} color="gray" />
        <Text className="mt-4 text-base text-gray-600 text-center">
          Material not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6 bg-primary">
        <Text className="text-2xl font-bold text-white">{material.name}</Text>
      </View>

      <View className="p-4 bg-white mb-3 shadow-sm mx-4 my-4 rounded-lg">
        <Text className="text-lg font-bold text-textDark mb-3">Details</Text>

        {material.chapter && (
          <View className="flex-row mb-2 border-b border-gray-100 pb-2">
            <Text className="font-medium text-gray-600 w-24">Chapter:</Text>
            <Text className="text-textDark flex-1">{material.chapter}</Text>
          </View>
        )}

        {material.class && (
          <View className="flex-row mb-2 border-b border-gray-100 pb-2">
            <Text className="font-medium text-gray-600 w-24">Class:</Text>
            <Text className="text-textDark flex-1">{material.class}</Text>
          </View>
        )}

        <View className="flex-row mb-2 border-b border-gray-100 pb-2">
          <Text className="font-medium text-gray-600 w-24">Type:</Text>
          <Text className="text-textDark flex-1 capitalize">
            {material.type}
          </Text>
        </View>

        <View className="flex-row mb-2">
          <Text className="font-medium text-gray-600 w-24">Category:</Text>
          <View className="flex-row items-center">
            <View className="bg-secondary px-3 py-1 rounded-full">
              <Text className="text-textDark uppercase text-xs font-bold">
                {material.category}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 pb-10">
        <Text className="text-lg font-bold text-textDark mb-3">Content</Text>
        {renderContent()}
      </View>
    </ScrollView>
  );
};

export default MaterialViewer;
