import { View, Text , ScrollView} from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";

import {EducationRoles} from '../../lib/appwrite';

const AcademicPath = () => {
    
    const { user } = useGlobalContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        
        course: user.course,
        university: user.university,

    });
  
    // Function to handle form submission
    const handlePress = async () => {
      if(form.course === "" || form.university === ""){
        Alert.alert("Error", "Please fill the fields");
        return;
      }
      
      setIsSubmitting(true);
      try {
        await EducationRoles(user.$id, form.course,form.university);
        router.replace("");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    };



  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex items-center flex-1 h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10">
            Where do you study?
          </Text>

          <FormField
            title="Add a college or university"
            value={form.course}
            handleChangeText={(e) => setForm({ ...form, course: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Cousre"
            value={form.university}
            handleChangeText={(e) => setForm({ ...form, university: e })}
            otherStyles="mt-9"
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
  )
}

export default AcademicPath