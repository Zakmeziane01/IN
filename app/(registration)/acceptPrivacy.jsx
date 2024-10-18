import React from 'react';
import { View, Text, SafeAreaView, ScrollView,Image } from 'react-native';
import { images } from "../../constants";
import CustomButton from '../../components/CustomButton'; 
import {router} from "expo-router";

const PrivacyPage = () => {
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/allDone")
  };

  const handlePersonalizePress = () => {
    // Handle the personalize or opt-out button press
    console.log("Personalize button pressed");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
      <View className="w-full justify-center px-3.5 flex-1 mt-20">
      <View className="ml-80">
        <View className="rounded-full border-2 border-secondary-200 p-2 mr-11">
          <Image 
            source={images.privacyPolicy}
            resizeMode='contain' 
            className="h-[35px] w-[35px]" 
          />
        </View>
      </View>
        
        <Text className="text-secondary-200 text-3xl font-bold mt-10 text-center">
          Privacy Policy
        </Text>



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
        <View className="w-full justify-center px-3.5 flex-1">
        <CustomButton
          title="Start"
          handlePress={handleAcceptPress}
          containerStyles="bg-secondary-200"
          textStyles="text-center text-white"
          isLoading={false}
        />
        <CustomButton
          title="Personalize my choices"
          handlePress={handlePersonalizePress}
          containerStyles="bg-white"
          textStyles="text-secondary-200"
          isLoading={false}
        />
        
        </View>

                
    </SafeAreaView>
  );
};

export default PrivacyPage;
