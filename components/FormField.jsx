import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { icons } from '../constants';
import moment from 'moment';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, mode = 'text', onPress, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChangeText(selectedDate);
    }
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      {mode === 'gender' ? (
        <TabsContainer value={value} handleChangeText={handleChangeText} />
      ) : (
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
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





const TabsContainer = ({ value, handleChangeText }) => {
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <View className="flex flex-row justify-between mt-2">
      {genderOptions.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleChangeText(option)}
          className={`flex-1 px-4 py-2 rounded-lg border-2 ${
            value === option ? 'border-secondary bg-secondary' : 'border-black-200'
          }`}
        >
          <Text className={`text-center text-base ${value === option ? 'text-white' : 'text-gray-100'} font-pmedium`}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FormField;
