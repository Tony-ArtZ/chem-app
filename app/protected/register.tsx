import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";
import { useRouter } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const validateInputs = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "teacher",
          },
        },
      });

      if (signUpError) throw signUpError;

      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully.",
        [{ text: "OK", onPress: () => router.push("/auth") }]
      );
    } catch (error: any) {
      setError(error.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

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
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-textDark mb-2">
              Teacher Registration
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              Create your account to get started
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
            <View className="space-y-2">
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
                  placeholder="Create password (min. 6 characters)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="space-y-2">
              <Text className="text-textDark font-medium ml-1">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#888"
                />
                <TextInput
                  className="flex-1 ml-3 text-textDark"
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-primary py-4 rounded-xl items-center mt-6 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-500">
                Want to login with a different account?{" "}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  await supabase.auth.signOut();
                  router.push("/auth");
                }}
              >
                <Text className="text-primary font-medium">Logout</Text>
              </TouchableOpacity>
            </View>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
