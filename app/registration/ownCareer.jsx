import { View, Text, ScrollView, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 

import { useGlobalContext } from "../../context/GlobalProvider";
import { UserCareer } from '../../lib/appwrite'; 

const OwnCareer = () => {

  const { user } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    career: user.career
  });

  // Function to handle form submission
  const handlePress = async () => {
    if(form.career === ""){                                //NOT REQUIRED
      Alert.alert("Error", "Please fill the field");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await UserCareer(user.$id,form.career);
      router.replace("/registration/workPositions");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
      <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            What do you do for a living
          </Text>

          <TabsContainer 
            value={form.career}
            handleChangeText={(e) => setForm({ ...form, career: e })}
            mode="selection"
            options={['Student', 'Work part-time', 'Work full-time', 'Gap year']}
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


export default OwnCareer