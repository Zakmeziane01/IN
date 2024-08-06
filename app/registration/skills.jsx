import { View, Text } from 'react-native'
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router } from "expo-router";
import FormField from '../../components/FormField';
import IconButton from '../../components/iconButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import {skills} from '../../lib/appwrite';

const Skills = () => {

    const { user } = useGlobalContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
      generalSkills: user.generalSkills,
      aboutYou: user.aboutYou,
      languageSpoken: user.languageSpoke
    });
  
    // Function to handle form submission
    const handlePress = async () => {
      if(form.generalSkills === "" || form.aboutYou === ""|| form.languageSpoken === ""){
        Alert.alert("Error", "Please fill in all the fields");
        return;
      }
      
      setIsSubmitting(true);
      try {
        await skills(user.$id, form.generalSkills, form.aboutYou, form.languageSpoken);
        router.replace("");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
 

  return (
    <SafeAreaView>
    <View>
      <Text className="text-base text-black-100 font-pmedium">Which skills best define you?</Text>

      <FormField  
            title="generalSkills"
            value={form.generalSkills}
            handleChangeText={(e) => setForm({ ...form, generalSkills: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="aboutYou"
            value={form.lastName}
            handleChangeText={(e) => setForm({ ...form, aboutYou: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="languageSpoken"
            value={form.languageSpoken}
            handleChangeText={(e) => setForm({ ...form, languageSpoken: e })}
            otherStyles="mt-7"
          />

      <IconButton
            handlePress={handlePress}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />


    </View>
    </SafeAreaView>
  )
}

export default Skills