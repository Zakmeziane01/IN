import { View, Text, ScrollView, Image  } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import profilePicture from '../../assets/images/profilePic.png';
import rightArrow from '../../assets/icons/right-arrow.png';
import Uni from '../../assets/icons/Uni.png';
import Location from '../../assets/icons/Location.png';
import Language from '../../assets/icons/language.png';
import Gender from '../../assets/icons/Gender.png';
import Age from '../../assets/icons/Age.png';
import World from '../../assets/icons/World.png';




import {router } from "expo-router";

import { useGlobalContext } from "../../context/GlobalProvider";
import {skills} from '../../lib/appwrite';
const home = () => {
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
    <View className="flex-1 justify-center items-center">
      <Image source={profilePicture} className= "w-64 h-64 rounded-full outline-offset-1 border-solid outline-white "/>
        <Text className="text-3xl text-white font-bold mt-4">Profile Name</Text>
    </View>
    <View className="flex-1 justify-left items-left" >
      <Text className="text-2xl text-white font-bold mt-4">About Me</Text>
      <Text className="text-white mt-2">
        I am a software engineer with a passion for building scalable and efficient systems. I have experience with
      </Text>
    </View>
    <View className="flex-1 justify-left items-left" >

      <View className="flex flex-row items-center mt-5">
      <Image source={rightArrow} className="ml-2 w-4 h-4" />
      <Text className="text-white font-bold">   GitHub</Text>
    </View>

    </View>
    <View className="flex flex-row items-center mt-4">
      <Image source={Uni} className="ml-2 w-4 h-4"/>
      <Text className="text-white font-bold">   Westminster University</Text>
    </View>

    <View className="flex flex-row items-center mt-4">
      <Image source={Location} className="ml-2 w-4 h-4"/>
      <Text className="text-white font-bold">   London</Text>
    </View>

    <View className="flex flex-row items-center mt-4">
      <Image source={Language}className="ml-2 w-4 h-4"/>
      <Text className="text-white font-bold">   English, French </Text>
    </View>

    <View className="flex flex-row justify-between mt-4">
  <View className="flex flex-row items-center">
    <Image source={Gender} className="ml-2 w-4 h-4"/>
    <Text className="text-white font-bold">   Male</Text>
  </View>
  <View className="flex flex-row items-center">
    <Image source={World} className="ml-2 w-4 h-4"/>
    <Text className="text-white font-bold">   England</Text>
  </View>
  <View className="flex flex-row items-center mr-4">
    <Image source={Age} className="ml-2 w-4 h-4"/>
    <Text className="text-white font-bold">   21</Text>
  </View>
</View>



    </ScrollView>
    </SafeAreaView>
    
  )
}

export default home
