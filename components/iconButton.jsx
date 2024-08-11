import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const IconButton = ({ handlePress, containerStyles, iconStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`mt-3 mb-3${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <View className={`mt-3 mb-3  bg-gray-500 rounded-s-full  ${iconStyles}`}>
        <FontAwesome name="arrow-right" size={40} color="white" />
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;
