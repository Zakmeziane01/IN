import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { TouchableOpacity, Modal } from 'react-native';

const PickerComponent = ({ title, value, onValueChange, containerStyles, otherStyles2, otherStyles }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState(null); // Initialize pickerValue to null

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setPickerValue(currentDate);
      confirmSelection(currentDate);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const confirmSelection = (selectedDate) => {
    const confirmedDate = selectedDate || pickerValue;
    setDate(confirmedDate);
    onValueChange(confirmedDate);
    setShowPicker(false);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View className={`space-y-2 mx-3 ${otherStyles}`}>
      {title && (
        <Text className="font-semibold mt-3 mb-3 text-gray-800">
          {title}
        </Text>
      )}

      <TouchableOpacity 
        onPress={showDatePicker} 
        className={`border-2 border-gray-200 w-full p-5 h-16 justify-center  ${
          pickerValue ? 'border-green-600 border-2 bg-white rounded-xl' : 'border-gray-200 border-2 bg-white rounded-xl'
        }`}
      >
        <Text 
         className="flex-2 text-[#7b7b8b] font-pregular text-base ml-2"
        >
          {pickerValue ? pickerValue.toLocaleDateString() : 'DD-MM-YYYY'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <DateTimePicker
            value={pickerValue || new Date()} 
            mode="date"
            display="spinner" 
            onChange={onChange}
            style={{ backgroundColor: 'white' }}
          />
        ) : (
          <Modal 
            transparent={true} 
            animationType="fade" 
            visible={showPicker} 
            onRequestClose={() => setShowPicker(false)}
          >
            <DateTimePicker
              value={pickerValue || new Date()} 
              mode="date"
              display="default" 
              onChange={onChange}
            />
          </Modal>
        )
      )}
    </View>
  );
};

export default PickerComponent;
