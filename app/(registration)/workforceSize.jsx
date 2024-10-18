import React, { useState } from 'react';
import { View, Text, ScrollView, Alert,Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import TabsContainer from '../../components/TabsContainer';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite'; 

const WorkforceSize = () => {
    const { user } = useGlobalContext();
    const { updateResponse } = useUserContext(); // Access updateResponse from user context
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        collaborativeNetworkSize: user.collaborativeNetworkSize || '' // Ensure default value
    });

    // Function to handle form submission
    const handlePress = async () => {
        if (form.collaborativeNetworkSize === "") {
            Alert.alert("Error", "Please fill the field");
            return;
        }

        setIsSubmitting(true);
        try {
            // Update the collaborativeNetworkSize attribute in the backend
            await updateUserAttribute(user.userId, 'collaborativeNetworkSize', form.collaborativeNetworkSize);
            
            // Update the context with the new value
            updateResponse('collaborativeNetworkSize', form.collaborativeNetworkSize);

            // Navigate to the next screen
            router.push("/skills");
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
            <Image source={stepsBar.Step10}
            resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>
    
        <View>
        <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3.5 mt-2 ">Who do You Prefer Work With?</Text>
        </View>
    
        <View className = " w-full justify-center min-h-[40vh] px-3 flex-1">   
        <TabsContainer
            value={form.collaborativeNetworkSize}
            handleChangeText={(e) => setForm({ ...form, collaborativeNetworkSize: e })}
            mode="selection"
            options={['One collaborator', 'Group', 'Both']}
            containerStyles="flex-col mt-4"
            showIcon={false}           
        />
     
        </View>
    
        <View className="w-full justify-center min-h-[vh] px-3 flex-1 mt-10">
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
export default WorkforceSize;
