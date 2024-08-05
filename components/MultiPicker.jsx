import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MultiPicker = ({ selectedValue, onValueChange, items }) => {
  return (
    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
      {items.map((pickerItems, index) => (
        <Picker
          key={index}
          selectedValue={selectedValue[index]}
          onValueChange={(value) => onValueChange(value, index)}
          style={{ flex: 1, borderColor: 'gray', borderWidth: 1, marginHorizontal: 5 }}
        >
          {pickerItems.map((item) => (
            <Picker.Item
              key={item.value}
              value={item.value}
              label={item.label}
            />
          ))}
        </Picker>
      ))}
    </View>
  );
};

export default MultiPicker;