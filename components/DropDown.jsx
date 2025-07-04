import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

// Define the styles for the picker select
const pickerSelectStyles = {
  inputIOS: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 10,
  },
  inputAndroid: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 10,
  },
};

const DropDown = ({ selectedValue, onValueChange, items }) => {
  return (
    <View className="p-3">
      <Text className="text-xs mt-2">
        Identify the prompt that best describes you:
      </Text>
     
     <TouchableOpacity activeOpacity={1}>
      <RNPickerSelect 
      onValueChange={onValueChange}
      items={items}
      style={pickerSelectStyles}
      value={selectedValue || undefined} // Ensure the value is not null
      placeholder={{ label: 'Select a prompt', value: undefined }} // Use undefined, not null

    /></TouchableOpacity>
    </View>
  );
};

export default DropDown;
