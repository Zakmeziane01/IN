import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton'; 
import {router} from "expo-router";



const PrivacyPage = () => {
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/home")
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
        <Text className="text-black text-3xl font-bold mb-7">
          Your privacy comes first
        </Text>
        <Text className="text-balkck mb-3">
          Add a little bit of body text. Add a little bit of body text. Add a
          little bit of body text. Add a little bit of body text. Add a little
          bit of body text.
        </Text>
        <Text className="text-black">
          Add a little bit of body text. Add a little bit of body text. Add a
          little bit of body text. Add a little bit of body text. Add a little
          bit of body text.
        </Text>

    
        </ScrollView>

        <CustomButton
          title="Start"
          handlePress={handleAcceptPress}
          containerStyles="bg-black mb-4"
          textStyles="text-white text-lg"
          isLoading={false}
        />


        <CustomButton
          title="Personalize"
          handlePress={handlePersonalizePress}
          containerStyles="bg-white"
          textStyles="text-black"
          isLoading={false}
        />
    </SafeAreaView>
  );
};

export default PrivacyPage;
