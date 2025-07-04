import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, SafeAreaView,Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import { router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from "../../context/UserContext"; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite';

/**
 * Component that handles updating user skills information.
 * It allows the user to input their general skills, about section, and spoken languages.
 * @returns None
 */

const Skills = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from UserContext
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        generalSkills: user.generalSkills || '', // Ensure default value
        aboutYou: user.aboutYou || '',
        languageSpoken: user.languageSpoken || ''
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.generalSkills === "" || form.aboutYou === "" || form.languageSpoken === "") {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update each attribute in the backend
            await updateUserAttribute(user.userId, 'generalSkills', form.generalSkills);
            await updateUserAttribute(user.userId, 'aboutYou', form.aboutYou);
            await updateUserAttribute(user.userId, 'languageSpoken', form.languageSpoken);

            // Update the context with new values
            updateResponse('generalSkills', form.generalSkills);
            updateResponse('aboutYou', form.aboutYou);
            updateResponse('languageSpoken', form.languageSpoken);

            // Navigate to the next screen
            router.push("/nextStage");

        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-secondary h-full">
    
        <View className="items-center justify-center">
          <Image source={images.Wlogo}
            resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
        </View>
    
        <View className="flexGrow-1">
          <ScrollView className="h-full bg-white rounded-[35px]">
            <Image source={stepsBar.Step11}
            resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>
    
        <View>
        <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3  mt-2 ">Which skills best define you?</Text>
        </View>
    
        <View className = " w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">   
        <FormField
            title="General Skills"
            value={form.generalSkills}
            handleChangeText={(e) => setForm({ ...form, generalSkills: e })}
            otherStyles="mt-3"
        />


        <FormField
            title="About You"
            value={form.aboutYou}
            handleChangeText={(e) => setForm({ ...form, aboutYou: e })}
            otherStyles="mt-3"
            containerStyles="h-40 items-start"
            multiline={true}
            numberOfLines={20}
        />


        <FormField
            title="Language Spoken"
            value={form.languageSpoken}
            handleChangeText={(e) => setForm({ ...form, languageSpoken: e })}
            otherStyles="mt-3"
        />
     
        </View>
    
        <View className="w-full justify-center min-h-[vh] px-3 flex-1">
          <CustomButton 
              title="Next"
              handlePress={handlePress}
              containerStyles="bg-secondary-200"
              textStyles="text-center text-white"
              isLoading={isSubmitting}
            />
            </View>
        
          </ScrollView>   
          </View>
    
         
    
        </SafeAreaView>
      );
    };
    

export default Skills;
