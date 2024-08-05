import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons'; 

const IconButton = ({ handlePress, containerStyles, iconStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-xl min-h-[72px] flex flex-row items-center justify-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <View className={`flex items-center justify-center ${iconStyles}`}>
        <FontAwesome name="arrow-right" size={30} color="white"  />
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;