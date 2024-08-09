import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full">
    
      <View className="w-full items-center">
        <Text className="text-sm font-pregular text-black-100 text-center mb-4">
          Let's create your profile
        </Text>

        <CustomButton
          title="Enter basic info"
          handlePress={() => router.push("/additionalInfo")}
          containerStyles="w-full mt-10"
          textStyles="text-center"
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
