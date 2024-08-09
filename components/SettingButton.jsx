import { TouchableOpacity, Image, View, Text } from "react-native";
import { icons } from "../constants";


const SettinButton = ({
  handlePress,
  containerStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      clasName={`bg-gray-200 border-2 border-gray-300 rounded-2xl p-4 ${containerStyles}`} 
    >
      <View className={`flex-row items-center`}>
        <Image
          source={icons.setting}
          className={`w-7 h-7`} // Adjust size and margin
          resizeMode="contain"
        />

      </View>
    </TouchableOpacity>
  );
};

export default SettinButton;
