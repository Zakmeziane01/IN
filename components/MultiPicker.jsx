import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MultiPicker = ({ selectedValue, onValueChange, items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.highlight} />
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
        {items.map((pickerItems, index) => (
          <Picker
            key={index}
            selectedValue={selectedValue[index]}
            onValueChange={(value) => onValueChange(value, index)}
            style={styles.picker}
            itemStyle={styles.item} // Custom styles for items
          > 
            {pickerItems.map((item) => (
              <Picker.Item
                key={item.value}
                value={item.value}
                label={item.label}
                style={styles.item} // Apply the same custom styles
              />
            ))}
          </Picker>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Relative positioning for the overlay
  },
  highlight: {
    position: 'absolute',
    width: '92%', // Adjust width as needed
    height: 60, // Increased height for larger selection area
    backgroundColor: 'rgba(91, 180, 80, 0.2)', // Light green with some transparency
    borderRadius: 10,
    borderColor: '#5bb450', // Add a black border color
    borderWidth: 4, // Add a border width of 4
    zIndex: 1, // Ensure it stays above the pickers
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#5bb450',
    borderWidth: 0,
    backgroundColor: 'white', // Set background to white
  },
  item: {
    fontSize: 24, // Adjust font size for picker items
    backgroundColor: 'white', // Set item background color to white
  },
});

export default MultiPicker;
