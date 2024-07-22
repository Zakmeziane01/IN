import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from "../../components/CustomButton";
import {router} from "expo-router"
import {SafeAreaView} from 'react-native-safe-area-context';

const WelcomeScreen = () => {
  
  return (

    <SafeAreaView className="h-full">

      <View className="items-center flex-2">

        <Text className="text-sm font-pregular text-black-100 text-center mb- w-full ">
          Let's create your profile
        </Text>

        <CustomButton
        title="Enter basic info"      // This sets the button's label to "Continue with Email".
        handlePress={() => router.push("/registration/additionalInfo")}          //This is an empty function that will handle the button press event.
        containerStyles="items-center w-full mt-100 "
        textStyles={""}
        /> 
      </View>
  </SafeAreaView>
  )
}

export default WelcomeScreen