import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CardButton = ({ title, cards, handleCardPress }) => {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl text-green-600 font-bold mb-4">{title}</Text>
        <View className="flex flex-wrap justify-center">
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardPress(card)}
              className={`w-40 h-40 p-4 m-2 rounded-lg border-2 ${
                card.selected ? 'border-green-600 bg-green-100' : 'border-gray-300'
              }`}
            >
              <Text className={`text-center text-lg font-semibold ${card.selected ? 'text-green-600' : 'text-gray-800'}`}>
                {card.title}
              </Text>
              <Text className="text-center text-sm text-gray-600 mt-2">{card.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

export default CardButton