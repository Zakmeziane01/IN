//HOME PAGE 
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView } from 'react-native'; 
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider'
import Loader from '../components/Loader';


export default function  App() {
  
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/uploadPhoto" />;


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
            <Text className="text-1xl text-secondary-200 font-bold text-center">
             Connect, Create, Conquere
            </Text>
          </View>
                      
          <Text className="text-lg font-pregular text-secondary-200 text-center mb-4 absolute bottom-0 w-full ">
           Imagine working with someone who truly gets your vision.
          </Text>

      </View>

     </ScrollView>

           <View className="w-full justify-center px-3 flex-1 mt-2">
           <CustomButton
             title="Ready to start"                                                  // This sets the button's label to "Continue with Email".
             handlePress={() => router.push("/sign-in")}                             //This is an empty function that will handle the button press event.
             containerStyles="w-full mt-7 font-psemibold bg-secondary-200"
             textStyles="text-white"
            /> 
          </View>
 
           <StatusBar backgroundColor="#161622" style="light" />
    
    </SafeAreaView>
   );
  }