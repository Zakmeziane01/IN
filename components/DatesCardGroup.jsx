import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState('Collaborators');

  return (
    <View className="flex-row rounded-lg overflow-hidden w-[90%] self-center">
      <TouchableOpacity
        className={`flex-1 py-3 justify-center items-center ${activeTab === 'Collaborators' ? 'bg-secondary-200' : 'bg-green-200'}`}
        onPress={() => setActiveTab('Collaborators')}
      >
        <Text className={`${activeTab === 'Collaborators' ? 'text-white' : 'text-black'} text-lg`}>
          Collaborators
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-3 justify-center items-center ${activeTab === 'Groups' ? 'bg-green-500' : 'bg-green-200'}`}
        onPress={() => setActiveTab('Groups')}
      >
        <Text className={`${activeTab === 'Groups' ? 'text-white' : 'text-black'} text-lg`}>
          Groups
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabComponent;
