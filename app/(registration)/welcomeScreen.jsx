import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { images } from '../../constants';

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 items-center mt-7">
        <View className="flex-row items-center mt-10">
          <Text className="text-3xl font-semibold text-secondary-200 mr-[-9px]">Welcome to</Text>
          <Image
            source={images.logoGreen}
            resizeMode="contain"
            className="w-[60px] h-[60px] mr-[-15px]"// Adjust the margin to balance the spacing
          />
          <Text className="text-3xl font-semibold text-secondary-200">spired</Text>
        </View>

        <Text className="text-1xl mt-5 font-medium">
          The passion led to us here
        </Text>

        <Image source={images.imageBack} resizeMode='contain' className="w-full h-[250px] mt-11 mb-2 self-center"/>
        <Text className="text-sm text-center mx-3 mt-3.5">
        Let's create an <Text className="text-green-600 font-semibold">impactful</Text> profile that attracts attention, inspires others, and sparks <Text className="text-green-600 font-semibold">connections</Text>.
      </Text>
      </View>



      <View className="mx-3 mb-8">
        <CustomButton
          title="Enter basic info"
          handlePress={() => router.push("/additionalInfo")}
          containerStyles="w-full mt-14 bg-secondary-200"
          textStyles="text-center text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
