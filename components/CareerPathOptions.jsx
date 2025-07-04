// ../../components/CareerPathOptions.js

import React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';

const CareerPathOptions = ({ options, selectedValues, onPressOption }) => {
  const renderOption = ({ item }) => {
    const selectedIndex = selectedValues.indexOf(item.value);
    const isSelected = selectedIndex !== -1; // Check if item is selected

    return (
      <View>
        <View className="flex-row items-center justify-between p-4 rounded-lg my-2">
          <View className="flex-1">
            <Text className="text-lg mx-3">{item.label}</Text>
            <Text className="text-sm mx-3 text-gray-500">{item.description}</Text>
          </View>
          <Pressable
            onPress={() => onPressOption(item.value)}
            style={{
              borderWidth: 2,
              borderColor: isSelected ? '#5bb450' : 'lightgray',
              borderRadius: 25,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
                  <Text style={{ color: isSelected ? '#5bb450' : 'lightgray', fontSize: 17, fontWeight: 'bold' }}>
                  {isSelected ? (selectedIndex + 1) : '+'}
            </Text>
          </Pressable>
        </View>
        <View className="border-b border-gray-300 mx-10" />
      </View>
    );
  };

  return (
    <FlatList
      className="mt-3.5"
      data={options}
      renderItem={renderOption}
      keyExtractor={(item) => item.value}
    />
  );
};

export default CareerPathOptions;
