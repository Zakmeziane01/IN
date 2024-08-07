import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const TabsContainer = ({title, options, value, handleChangeText,containerStyles,otherStyles}) => {
  return (
    <View className={`flex justify-between mt-2, space-y-2 ${otherStyles} ${containerStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium mt-4">{title}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleChangeText(option)}
          className={`flex-1 px-4 py-2 rounded-lg border-2 ${
            value === option ? 'border-secondary bg-secondary' : 'border-black-200'
          } ${index !== 0 ? 'mt-2' : ''}`} // Add margin-top to all items except the first one
        >
          <Text className={`text-center text-base ${value === option ? 'text-white' : 'text-gray-100'} font-pmedium`}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabsContainer;
