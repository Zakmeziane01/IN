import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const RadioButton = ({ options, selectedOption, onOptionSelect, containerStyles, labelStyles }) => {
  return (
    <View className={containerStyles}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onOptionSelect(option)}
          activeOpacity={0.7}
          className="flex flex-row items-center my-1.5"
        >
          <View
            className={`h-6 w-6 rounded-full border-2 border-primary justify-center items-center ${selectedOption === option ? 'bg-primary' : 'bg-transparent'}`}
          >
            {selectedOption === option && <View className="h-3 w-3 rounded-full bg-white" />}
          </View>
          <Text className={`ml-2 text-lg ${labelStyles}`}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;


