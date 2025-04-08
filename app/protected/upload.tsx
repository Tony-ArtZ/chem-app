import { ScrollView, SafeAreaView, View } from "react-native";
import { Stack } from "expo-router";
import { UploadForm } from "@/components/UploadForm";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const Upload = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Upload Material",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fff8f0",
          },
          headerTitleStyle: {
            color: "#333333",
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      />
      <LinearGradient colors={["#fff8f0", "#fff"]} className="flex-1">
        <ScrollView className="flex-1">
          <View className="bg-white rounded-2xl overflow-hidden shadow-md mx-2 my-2">
            <UploadForm />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Upload;
