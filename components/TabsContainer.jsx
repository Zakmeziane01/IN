import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const TabsContainer = ({ options, value, handleChangeText, showIcon = true }) => {
  return (
    <View>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleChangeText(option)}
          className={`flex-row items-center rounded-xl min-h-[62px] justify-between border-2 my-3 ${
            value === option ? 'border-secondary' : 'border-gray-200'
          } bg-white ${index !== 0 ? 'mt-4' : ''}`} 
        >
          <View className="flex-row items-center">   
            {showIcon && (
              <MaterialIcons
                name={option === 'Male' ? 'male' : option === 'Female' ? 'female' : 'transgender'}
                size={24}
                color={value === option ? 'green' : 'gray'}
              />
            )}
            <Text className={`ml-2 text-base text-[#7b7b8b] font-pregular`}>
              {option}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#5bb450',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              {value === option && (
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#5bb450',
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabsContainer;
