import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useFocusEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (!session) {
        router.replace("/auth");
      }
    });
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff7f24", // Blue color when selected
        tabBarInactiveTintColor: "#64748b", // Slate color when not selected
        tabBarStyle: {
          // Add some padding to improve appearance
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="upload"
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cloud-upload" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          tabBarLabel: "Register",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="app-registration" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
