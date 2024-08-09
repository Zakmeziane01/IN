import { View, Text, ScrollView  } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import {skills} from '../../lib/appwrite';

const bookmark = () => {
  return (
    <SafeAreaView className="bg-primary h-full ">
    <View>
      <Text>bookmark</Text>
    </View>
    </SafeAreaView>
  )
}

export default bookmark