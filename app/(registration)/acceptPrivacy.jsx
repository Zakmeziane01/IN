import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { images } from "../../constants";
import CustomButton from '../../components/CustomButton'; 
import { router } from "expo-router";

const PrivacyPage = () => {
  // Function to handle the accept button press
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/allDone"); // Navigate to the next page
  };

  // Function to handle the personalize or opt-out button press
  const handlePersonalizePress = () => {
    console.log("Personalize button pressed");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center px-3.5 flex-1 mt-20">
          {/* Privacy Policy Icon */}
          <View className="ml-80">
            <View className="rounded-full border-2 border-secondary-200 p-2 mr-11">
              <Image 
                source={images.privacyPolicy}
                resizeMode='contain' 
                className="h-[35px] w-[35px]" 
              />
            </View>
          </View>
          
          {/* Privacy Policy Title */}
          <Text className="text-secondary-200 text-3xl font-bold mt-10 text-center">
            Privacy Policy
          </Text>

          {/* Privacy Policy Content */}
          <View className="p-10 text-center">
            <Text>
              Add a little bit of body text. Add a little bit of body text. Add a
              little bit of body text. Add a little bit of body text. Add a little
              bit of body text.
            </Text>
            <Text>
              Add a little bit of body text. Add a little bit of body text. Add a
              little bit of body text. Add a little bit of body text. Add a little
              bit of body text.
              Add a little bit of body text. Add a little bit of body text. Add a
              little bit of body text. Add a little bit of body text. Add a little
              bit of body text.
              Add a little bit of body text. Add a little bit of body text. Add a
              little bit of body text. Add a little bit of body text. Add a little
              bit of body text.
              Add a little bit of body text. Add a little bit of body text. Add a
              little bit of body text. Add a little bit of body text. Add a little
              bit of body text.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Buttons Section */}
      <View className="w-full justify-center px-3.5 flex-1">
        <CustomButton
          title="Start"
          handlePress={handleAcceptPress}      // Calls function to navigate
          containerStyles="bg-secondary-200"
          textStyles="text-center text-white"
          isLoading={false}
        />
        <CustomButton
          title="Personalize my choices"
          handlePress={handlePersonalizePress} // Calls function for personalization
          containerStyles="bg-white"
          textStyles="text-secondary-200"
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPage;
