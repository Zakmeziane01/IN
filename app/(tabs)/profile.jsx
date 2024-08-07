import { View, Text } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/iconButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import {userId} from '../../lib/appwrite';

const profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full ">
    <ScrollView>
    <View>
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold justify-centre">profile</Text>
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold justify-centre">profile</Text>



    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default profile

