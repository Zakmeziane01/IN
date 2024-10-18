import React, { useState } from 'react';
import { View, Text, Alert, ScrollView,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabsContainer from '../../components/TabsContainer';
import { images, stepsBar } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { router } from 'expo-router';
import { updateUserAttribute } from '../../lib/appwrite';

const GenderCollaborator = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext(); // Access updateResponse from user context

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collabGender, setCollabGender] = useState(user.CollabGender || '');

  const handlePress = async () => {
    if (!collabGender) {
      Alert.alert('Error', 'Please select a collaborator gender');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user attribute
      await updateUserAttribute(user.userId, 'CollabGender', collabGender);
      
      // Update the context with the selected collaborator gender
      updateResponse('CollabGender', collabGender);

      router.push('/ownCareer'); 
    } catch (error) {
      Alert.alert('Error', error.message);
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
        <Image source={stepsBar.Step4}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View>
    <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3  mt-2 ">What type of collaborator are you looking for?</Text>
    </View>

    <View className = " w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">   
    <TabsContainer 
    value={collabGender} // corrected to use state
    handleChangeText={setCollabGender} // pass the state updater function
    mode="selection"
    options={['Male', 'Female', 'Both']}
/>
 
    </View>

    <View className="w-full justify-center min-h-[37vh] px-3 flex-1 mt-2">
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


export default GenderCollaborator;
