import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  SlideInRight,
  ZoomIn,
  FlipInYRight,
} from "react-native-reanimated";
import { MaterialCategory } from "../../types/Material";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 40) / 2; // Two columns with some spacing

const categoryIcons = {
  [MaterialCategory.JEE]: <FontAwesome5 name="atom" size={36} color="white" />,
  [MaterialCategory.NCERT]: (
    <MaterialIcons name="book" size={36} color="white" />
  ),
  [MaterialCategory.NEET]: (
    <FontAwesome5 name="heartbeat" size={36} color="white" />
  ),
  [MaterialCategory.OLYMPIAD]: (
    <MaterialIcons name="emoji-events" size={36} color="white" />
  ),
  [MaterialCategory.CUET]: (
    <MaterialIcons name="school" size={36} color="white" />
  ),
  [MaterialCategory.NTSE]: (
    <FontAwesome5 name="brain" size={36} color="white" />
  ),
};

const categoryNames = {
  [MaterialCategory.JEE]: "JEE",
  [MaterialCategory.NCERT]: "NCERT",
  [MaterialCategory.NEET]: "NEET",
  [MaterialCategory.OLYMPIAD]: "Olympiad",
  [MaterialCategory.CUET]: "CUET",
  [MaterialCategory.NTSE]: "NTSE",
};

// Modern gradient combinations for each category
const categoryGradients = {
  [MaterialCategory.JEE]: ["#FF416C", "#FF4B2B"] as const,
  [MaterialCategory.NCERT]: ["#4776E6", "#8E54E9"] as const,
  [MaterialCategory.NEET]: ["#00B09B", "#96C93D"] as const,
  [MaterialCategory.OLYMPIAD]: ["#FDC830", "#F37335"] as const,
  [MaterialCategory.CUET]: ["#5C258D", "#4389A2"] as const,
  [MaterialCategory.NTSE]: ["#1A2980", "#26D0CE"] as const,
};

const CategoryCard = ({
  category,
  index,
}: {
  category: MaterialCategory;
  index: number;
}) => {
  const router = useRouter();
  const delay = 150 + index * 150;

  // Choose animation type based on position
  let animation;
  if (index % 4 === 0) animation = ZoomIn.delay(delay).springify();
  else if (index % 4 === 1) animation = SlideInRight.delay(delay).springify();
  else if (index % 4 === 2) animation = FadeInDown.delay(delay).springify();
  else animation = FlipInYRight.delay(delay).springify();

  return (
    <Animated.View
      entering={animation}
      style={{ width: CARD_SIZE, height: CARD_SIZE }}
      className="p-1"
    >
      <TouchableOpacity
        onPress={() => router.push(`/category/${category}`)}
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ elevation: 6 }}
      >
        <LinearGradient
          colors={categoryGradients[category]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full items-center justify-center p-4"
        >
          <Animated.View entering={ZoomIn.delay(delay + 200)} className="mb-3">
            {categoryIcons[category]}
          </Animated.View>
          <Text className="text-white text-lg font-bold text-center">
            {categoryNames[category]}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Home = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top }} className="relative">
        {/* Curvy Header Background */}
        <View className="absolute top-0 left-0 right-0">
          <LinearGradient
            colors={["#FF7F24", "#FF9A57"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full h-52"
          >
            {/* Wave SVG-like shape using Views */}
            <View
              className="absolute bottom-0 left-0 right-0 h-12 bg-background"
              style={{
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                transform: [{ scaleX: 1.1 }],
              }}
            />
          </LinearGradient>
        </View>

        {/* Header Content */}
        <View className="px-5 pt-4 pb-20 z-10">
          <View className="flex-row justify-between items-center">
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              className="flex-1"
            >
              <Text className="text-white text-lg font-medium">
                Hello there,
              </Text>
              <Text className="text-white text-3xl font-bold">
                Welcome back!
              </Text>
            </Animated.View>

            <Animated.View
              entering={ZoomIn.delay(300)}
              className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
            >
              <TouchableOpacity onPress={() => router.push("/auth")}>
                <MaterialIcons name="person" size={24} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Animated.Text
          entering={SlideInRight.delay(500)}
          className="text-textDark text-xl font-semibold mb-4"
        >
          Study Categories
        </Animated.Text>

        <View className="flex-row flex-wrap justify-between">
          {Object.values(MaterialCategory).map((category, index) => (
            <CategoryCard key={category} category={category} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
