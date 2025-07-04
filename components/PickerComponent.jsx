import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { TouchableOpacity, Modal } from 'react-native';

const PickerComponent = ({ title, onValueChange, otherStyles }) => {
  const [date, setDate] = useState(new Date()); // Store selected date
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      onValueChange(currentDate); // Send selected date to parent
      setShowPicker(false);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
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
        className={`border-2 border-gray-200 w-full p-5 h-16 justify-center bg-white rounded-xl`}
      >
        <Text className="text-[#7b7b8b] font-pregular text-base ml-2">
          {date ? date.toLocaleDateString() : 'DD-MM-YYYY'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
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
              value={date}
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
