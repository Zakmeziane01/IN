//HOME PAGE 
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView } from 'react-native';  //SafeAreaView automatically calculates the safe area insets and applies padding to your content so that it is displayed correctly on all devices. Without SafeAreaView: Content might be hidden behind the notch or overlap with the home indicator. This can lead to a poor user experience as users might miss important information or find it difficult to interact with UI elements.
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider'
import Loader from '../components/Loader';


export default function  App() {
  
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;


  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "60%",
          alignItems: 'center',
          paddingHorizontal: 16,
       }}   
      >

      <View className="items-center flex-1">

      <Loader isLoading={loading} />


          <View className="items-center h-[300px] mt-10">
            <Image
              source={images.logo}
              className="w-[260px] h-[84px]"
              resizeMode="contain"
            />
            <Text className="text-1xl text-secondar-200 font-bold text-center">
             Create Connect, Conquere
             </Text>
          </View>



                      
          <Text className="text-sm font-pregular text-gray-100 text-center mb-4 absolute bottom-0 w-full ">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
           </Text>

      </View>

     </ScrollView>


           <CustomButton
             title="Create account"      // This sets the button's label to "Continue with Email".
             handlePress={() => router.push("/sign-in")}          //This is an empty function that will handle the button press event.
             containerStyles="w-full  mt-7 font-psemibold"
            /> 
      
 
           <StatusBar backgroundColor="#161622" style="light" />
    
    </SafeAreaView>
   );
  }