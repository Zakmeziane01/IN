import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const PickerComponent = ({ title, value, onValueChange, options, containerStyles, otherStyles }) => {
  return (
    <View className={`w-full ${containerStyles}`}>
      {title && (
        <Text className="font-psemibold text-black mt-3 mb-3">{title}</Text>
      )}
      <View className={`w-full px-4 py-2 bg-white rounded-lg border  ${otherStyles}`}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={options}
          value={value}
          style={{
            inputIOS: {
              paddingVertical: 8,
              color: 'black',
              fontSize: 16,
            },
            inputAndroid: {
              paddingVertical: 8,
              color: 'black',
              fontSize: 16,
            },
            placeholder: {
              color: 'gray',
              fontSize: 16,
            },
          }}
          placeholder={{ label: "Select your option", value: null }}
        />
      </View>
    </View>
  );
};

export default PickerComponent;
