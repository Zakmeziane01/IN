//HOME PAGE 
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";    //SafeAreaView automatically calculates the safe area insets and applies padding to your content so that it is displayed correctly on all devices. Without SafeAreaView: Content might be hidden behind the notch or overlap with the home indicator. This can lead to a poor user experience as users might miss important information or find it difficult to interact with UI elements.
import { Redirect, router } from "expo-router";

import { images } from "../constants";
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider'

//ScrollView: Adjusted contentContainerStyle to { flexGrow: 1 } to allow it to grow and use the available space.
//Text Component: Added absolute positioning with bottom-0 to place it at the bottom of the screen. Added w-full to ensure it spans the full width of the screen.

export default function  App() {
  
  const {isLoading,isLoggedIn} = useGlobalContext();
  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{flexGrow: 1 }}>    

      <View className="items-center flex-1">

          <View className="items-center h-[300px] mt-10">
            <Image
              source={images.logo}
              className="w-[260px] h-[84px]"
              resizeMode="contain"
            />
            <Text className="text-2xl text-white font-bold text-center">
            <Text className="text-secondary-200">Create </Text> Connect, Conquere</Text>
          </View>

          <View>
            <CustomButton
             title="Create account"      // This sets the button's label to "Continue with Email".
             handlePress={() => router.push("/home")}          //This is an empty function that will handle the button press event.
             containerStyles=" justify-center items-center w-full mt-9 "
             textStyles={""}
            /> 
            
          </View>

      </View>

     </ScrollView>
      
           <Text className="text-sm font-pregular text-gray-100 text-center mb-4 absolute bottom-0 w-full ">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
           </Text>
           
           <StatusBar backgroundColor="#161622" style="light" />
    
    </SafeAreaView>
   );
  }