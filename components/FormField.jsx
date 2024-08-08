import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles,otherStyles2, mode = 'text', onPress, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      {mode === 'gender' ? (
        <TabsContainer value={value} handleChangeText={handleChangeText} />
      ) : (
        <View className={`w-full h-16 ${otherStyles2} px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center`}>
          {mode === 'date' ? (
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1 }}>
              <Text className="flex-1 text-white font-psemibold text-base">
                {value ? moment(value).format('MMMM Do, YYYY') : placeholder}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              className="flex-1 text-white font-psemibold text-base"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#7B7B8B"
              onChangeText={handleChangeText}
              secureTextEntry={title === 'Password' && !showPassword}
              {...props}
            />
          )}
          {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
      )}
      {mode === 'date' && showDatePicker && (
        <DateTimePicker value={value || new Date()} mode="date" display="default" onChange={handleDateChange} />
      )}
    </View>
  );
};

export default FormField;
