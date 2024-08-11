import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton'; 
import { router } from 'expo-router';

const AllDone = () => {
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/acceptPrivacy");
  };

  const handlePersonalizePress = () => {
    // Handle the personalize or opt-out button press
    console.log("Personalize button pressed");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          marginHorizontal: 20,
          paddingTop: 120,
          paddingBottom: 20
        }}
      >
        <Text className="text-black text-3xl font-bold mb-4">
          All Done!
        </Text>
        <Text className="text-green-500 mb-4">
          Ready to succeed with the perfect collaborator
        </Text>

        {/* You can add more content here if needed */}
      </ScrollView>

      <CustomButton
        title="Start"
        handlePress={handleAcceptPress}
        containerStyles="bg-black mb-4"
        textStyles="text-white text-lg"
        isLoading={false}
      />
    </SafeAreaView>
  );
};

export default AllDone;
