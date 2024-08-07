import { View, Text, ScrollView, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 

import { useGlobalContext } from "../../context/GlobalProvider";
import { MyGender } from '../../lib/appwrite'; 


const OwnGender = () => {
  const { user } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    gender: user.gender 
  });

  // Function to handle form submission
  const handlePress = async () => {
    if(form.gender === ""){
      Alert.alert("Error", "Please fill the field");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await MyGender(user.$id,form.gender);
      router.replace("/registration/localization");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Select your gender
          </Text>

          <TabsContainer 
            value={form.gender}
            handleChangeText={(e) => setForm({ ...form, gender: e })}
            mode="selection"
            options={['Male', 'Female', 'Others']}
            containerStyles="flex-col mt-4"
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-6 right-7">
        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

export default OwnGender;
