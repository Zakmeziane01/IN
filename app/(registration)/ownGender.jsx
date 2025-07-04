import React, { useState } from 'react';
import { View, Text, ScrollView, Alert,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { images, stepsBar} from "../../constants";
import TabsContainer from '../../components/TabsContainer';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { updateUserAttribute } from '../../lib/appwrite';

/**
 * Component for handling the user's own gender selection and updating it in the user context.
 * @returns None
 */

const OwnGender = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gender, setGender] = useState(user.gender || '');               // Initialize with user's gender or empty string


  // Function to handle form submission
  const handlePress = async () => {
    if (!gender) {                                                      // Check if gender is selected
      Alert.alert("Error", "Please select your gender");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserAttribute(user.userId,  'gender', gender);        // Update the user's gender attribute
      updateResponse('gender', gender);                                 // Update the context with the selected gender
      router.push("/localization");
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
        <Image source={stepsBar.Step2}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View>
    <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3  mt-2 ">Your's Gender?</Text>
    </View>

    <View className = " w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">   
    <TabsContainer 
        value={gender}
        handleChangeText={setGender}
        mode="selection"
        options={['Male', 'Female', 'Others']}
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


export default OwnGender;
