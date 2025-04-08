import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";
import { useFocusEffect, useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authloading, setAuthLoading] = useState(true);

  const [session, setSession] = useState<Session | null>(null);

  useFocusEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);

      if (session?.user) {
        router.replace("/protected/upload");
      }
    });
  });

  const router = useRouter();

  const validateInputs = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 1) {
      setError("Please enter your password");
      return false;
    }

    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      // Successfully logged in
      // router.replace("/protected/upload");
    } catch (error: any) {
      setError(
        error.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: "chem-app://reset-password",
        }
      );

      if (resetError) throw resetError;

      Alert.alert(
        "Password Reset",
        "If an account exists with this email, you will receive password reset instructions."
      );
    } catch (error: any) {
      // Show general message to prevent email enumeration
      Alert.alert(
        "Password Reset",
        "If an account exists with this email, you will receive password reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authloading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-primary text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="flex-grow justify-center"
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-8 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
              <Ionicons name="school" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-textDark mb-2">
              Teacher Login
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              Welcome back! Please sign in to continue
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-4 p-3 bg-red-100 rounded-lg">
              <Text className="text-red-700">{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-5">
            {/* Email Input */}
            <View className="space-y-2"></View>
            <Text className="text-textDark font-medium ml-1">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
              <Ionicons name="mail-outline" size={20} color="#888" />
              <TextInput
                className="flex-1 ml-3 text-textDark"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="space-y-2">
            <Text className="text-textDark font-medium ml-1">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <TextInput
                className="flex-1 ml-3 text-textDark"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className="items-end"
            onPress={handleForgotPassword}
          >
            <Text className="text-primary font-medium">Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-primary py-4 rounded-xl items-center mt-4 ${
              loading ? "opacity-70" : ""
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Additional Information */}
        <View className="mt-12 items-center">
          <Text className="text-gray-500 mb-2">
            Need help? Contact IT support
          </Text>
          <Text className="text-textDark font-medium">
            sbps.elabs@proton.me
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
