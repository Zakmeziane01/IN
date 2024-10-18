import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton'; 
import { router } from 'expo-router';

const AllDone = () => {
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/home");
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
        <Text className="text-secondary-200 text-3xl font-bold mb-4">
          All Done!
        </Text>
        <Text className="text-black mb-4">
          Ready to succeed with the perfect collaborator
        </Text>
      </ScrollView>
      <View className="w-full justify-center  px-3 flex-1 mb-20">
      <CustomButton className="w-full justify-center  px-3 flex-1"
        title="Start"
        handlePress={handleAcceptPress}
        containerStyles="bg-secondary-200"
        textStyles="text-center text-white"
        isLoading={false}
      /></View>
      
    </SafeAreaView>
  );
};

export default AllDone;
