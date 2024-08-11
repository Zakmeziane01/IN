import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  containerStyles,
  mode = 'text',
  multiline = false, // Add a multiline prop
  numberOfLines = 1, // Allow setting the initial number of lines
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-60 font-pmedium">{title}</Text>
      <View className={`w-full px-4 bg-white rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row text-center ${containerStyles}`}>
        <TextInput
          className="flex-1 text-black font-psemibold text-base py-2" // Added padding to ensure better vertical alignment
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          multiline={multiline} // Enable multiline
          numberOfLines={numberOfLines} // Set the initial number of lines
          textAlignVertical={multiline ? "top" : "center"} // Align text at the top if multiline
          {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
