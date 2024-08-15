import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full">
    
      <View className="flex-1 items-center mt-7 mr-">
        <Text className="text-3xl font-semibold  text-black-100 text-center mb-4">
          Let's create your profile
        </Text>
      </View>

      <CustomButton
          title="Enter basic info"
          handlePress={() => router.push("/additionalInfo")}
          containerStyles="w-full mt-14"
          textStyles="text-center"
        />
    </SafeAreaView>
  );
};

export default WelcomeScreen;
