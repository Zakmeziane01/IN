import React, { useState } from 'react';
import { View, Text, ScrollView, Alert,Image} from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import
import { AlignJustify } from 'react-feather';

const WorkPositions = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from user context

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        employmentRoles: user.employmentRoles || '', // Ensure default value
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.employmentRoles === "") {
            Alert.alert("Error", "Please fill in the field");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update user attributes in the backend
            await updateUserAttribute(user.userId, 'employmentRoles', form.employmentRoles);

            // Update the context with the new value
            updateResponse('employmentRoles', form.employmentRoles);

            // Navigate to the next screen
            router.push("/careerPath");
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
            <Image source={stepsBar.Step6}
            resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>
    
        <View>
        <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3  mt-2 ">Where do you work?</Text>
        </View>
    
        <View className = " w-full justify-center min-h-[10vh] px-3 flex-1">   
        <FormField
            title="Tell us more about your work"
            value={form.employmentRoles}
            handleChangeText={(e) => setForm({ ...form, employmentRoles: e })}
            otherStyles="mt-7"
            containerStyles="h-60 items-start"
            otherStyles2="text-black"
            multiline={true} 
            numberOfLines={20} 
        />

        </View>
    
        <View className="w-full justify-center min-h-[40vh] px-3 flex-1">
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

export default WorkPositions;
