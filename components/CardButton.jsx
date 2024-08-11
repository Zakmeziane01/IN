import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CardButton = ({ cards, handleCardPress }) => {
  // Split the cards into two arrays: top row and bottom row
  const topRowCards = cards.slice(0, 2);
  const bottomRowCards = cards.slice(2);

  return (
    <View className="flex-1 justify-center items-center p-4">

      {/* Top row */}
      <View className="w-full flex flex-row justify-between mb-4">
        {topRowCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCardPress(card)}
            className={`w-[48%] h-55 p-2 rounded-lg border-2 mb-3 ${
              card.selected ? 'border-green-600 bg-green-100' : 'border-gray-300'
            }`}
          >
            <Text className={`text-center text-sm font-semibold ${card.selected ? 'text-green-600' : 'text-gray-800'}`}>
              {card.title}
            </Text>
            <Text className="text-center text-sm text-gray-600 mt-2">{card.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom row */}
      <View className="w-full flex flex-row justify-between">
        {bottomRowCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCardPress(card)}
            className={`w-[48%] h-55 p-2 rounded-lg border-2 mb-2 ${
              card.selected ? 'border-green-600 bg-green-100' : 'border-gray-300'
            }`}
          >
            <Text className={`text-center text- font-semibold ${card.selected ? 'text-green-600' : 'text-gray-800'}`}>
              {card.title}
            </Text>
            <Text className="text-center text-sm text-gray-600 mt-2">{card.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CardButton;
