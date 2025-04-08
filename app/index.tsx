import {
  Text,
  View,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useRef } from "react";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import "../global.css";
import { useRouter } from "expo-router";

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const formulaFadeAnim = useRef(new Animated.Value(0)).current;
  const leftLineAnim = useRef(new Animated.Value(0)).current;
  const rightLineAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, 500);

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Enhanced pulse with color change
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();

    // Formula and line animations with staggered timing
    setTimeout(() => {
      Animated.stagger(200, [
        Animated.timing(leftLineAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(formulaFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rightLineAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const flaskColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E45C00", "#8E44AD"],
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-background"
    >
      <View className="flex-1 items-center justify-center py-12 px-4">
        {/* Decorative atom in corner */}
        <Animated.View
          className="absolute top-6 right-6"
          style={{
            transform: [{ rotate: spin }],
          }}
        >
          <FontAwesome5 name="atom" size={28} color="#FFB74D" />
        </Animated.View>

        {/* Decorative formula in corner */}
        <View className="absolute top-6 left-6">
          <MaterialCommunityIcons name="molecule" size={28} color="#FFA07A" />
        </View>

        {/* Logo with animation */}
        <Animated.View
          className="mb-6 mt-auto"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image
            source={require("../assets/images/school-logo.png")}
            className="h-40 w-40"
            resizeMode="contain"
          />
        </Animated.View>

        {/* Main Title */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
          }}
        >
          <Text className="text-3xl font-bold text-textDark mb-2 text-center">
            Chemistry Department
          </Text>
          <Text className="text-xl text-primary mb-4 text-center">
            Interactive Learning Platform
          </Text>
        </Animated.View>

        {/* Central flask icon with enhanced pulse animation */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 30,
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Animated.View>
            <MaterialCommunityIcons
              name="flask-outline"
              size={58}
              color={flaskColor}
            />
          </Animated.View>
        </Animated.View>

        {/* Enhanced decorative element - molecule formula */}
        <View className="w-full flex-row justify-center items-center my-4">
          <Animated.View
            style={{
              height: 2,
              width: 60,
              backgroundColor: "#FF9D5C",
              borderRadius: 4,
              marginHorizontal: 10,
              opacity: 0.8,
              transform: [
                { scaleX: leftLineAnim },
                {
                  translateX: leftLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          />
          <Animated.View
            style={{
              opacity: formulaFadeAnim,
              transform: [
                {
                  scale: formulaFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            }}
          >
            <Text
              className="text-primary-dark text-lg font-semibold"
              style={{ fontFamily: "System", letterSpacing: 1 }}
            >
              H₂SO₄
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              height: 2,
              width: 60,
              backgroundColor: "#FF9D5C",
              borderRadius: 4,
              marginHorizontal: 10,
              opacity: 0.8,
              transform: [
                { scaleX: rightLineAnim },
                {
                  translateX: rightLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          />
        </View>

        {/* Button */}
        <Animated.View
          className="mt-8"
          style={{
            opacity: fadeAnim,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push("/home");
            }}
          >
            <View
              className="bg-primary py-4 px-10 rounded-full flex-row items-center"
              style={{
                backgroundColor: "#ff7f24",
              }}
            >
              <Text className="text-white font-bold text-lg mr-2">
                Get Started
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Text */}
        <View className="mt-auto mb-4">
          <Text className="text-textDark text-sm text-center">
            Explore the world of chemistry
          </Text>
          <View className="flex-row justify-center items-center mt-2">
            <MaterialCommunityIcons
              name="flask-round-bottom"
              size={14}
              color="#E45C00"
            />
            <Text className="text-primary-dark text-xs mx-1">Version 1.0</Text>
            <MaterialCommunityIcons
              name="flask-round-bottom"
              size={14}
              color="#E45C00"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
