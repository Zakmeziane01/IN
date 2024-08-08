import { View, Text , ScrollView} from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";

import {WorkRoles} from '../../lib/appwrite';


const WorkPositions = () => {

    const { user } = useGlobalContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        
        employmentRoles: user.employmentRoles,

    });
  
    // Function to handle form submission
    const handlePress = async () => {
      if(form.employmentRoles === ""){
        Alert.alert("Error", "Please fill the fields");
        return;
      }
      
      setIsSubmitting(true);
      try {
        await WorkRoles(user.$id, form.employmentRoles);
        router.replace("");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
 

  return (
    <SafeAreaView className="h-full ">
    <ScrollView>
    <View className="w-full flex justify-center h-full px-4 my-6">
      <Text className="text-2xl font-semibold text-black font-psemibold">Where do you work?</Text>

          <FormField 
            title="Tell more about your work"
            value={form.employmentRoles}
            handleChangeText={(e) => setForm({ ...form, employmentRoles: e })}
            otherStyles="mt-7"
            containerStyles="h-60"
          />
    </View>
    </ScrollView>

       <View className="absolute bottom-5 right-5">
        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>

    </SafeAreaView>
  )
}


export default WorkPositions