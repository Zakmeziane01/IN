import { View, Text, ScrollView, Image  } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import profilePicture from '../../assets/images/profilePic.png';
import CustomButton from '../../components/CustomButton';
import {router } from "expo-router";

import { useGlobalContext } from "../../context/GlobalProvider";
import {skills} from '../../lib/appwrite';
const profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
    <View className="flex-1 justify-center items-center">
      <Image source={profilePicture} className= "w-64 h-64 rounded-full outline-offset-1 border-solid outline-white "/>
        <Text className="text-3xl text-white font-bold mt-4">Profile Name</Text>
    </View>
    <View className="flex-1 justify-left items-left" >
      <CustomButton              
        title="Add Friend's "     
        handlePress={() => router.push("/home")}         
        containerStyles=" justify-center items-center w-full mt-9 "
        textStyles={""}/>
            <CustomButton              
        title="Settings"     
        handlePress={() => router.push("/home")}         
        containerStyles=" justify-center items-center w-full mt-9 "
        textStyles={""}/>
                    <CustomButton              
        title="Help centre"  
        handlePress={() => router.push("/home")}          
        containerStyles=" justify-center items-center w-full mt-9 "
        textStyles={""}/>
                    <CustomButton              
        title="Analytics"    
        handlePress={() => router.push("/home")}          
        containerStyles=" justify-center items-center w-full mt-9 "
        textStyles={""}/>

    </View>



    </ScrollView>
    </SafeAreaView>
    
  )
}

export default profile
