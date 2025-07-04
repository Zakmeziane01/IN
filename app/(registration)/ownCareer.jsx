import React, { useState } from 'react';
import { View, Text, ScrollView, Alert,Image} from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TabsContainer from '../../components/TabsContainer';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { updateUserAttribute } from '../../lib/appwrite';


/**
 * OwnCareer component handles the user's career selection and updates the user's career attribute.
 * @returns None
 */

const OwnCareer = () => {
  const { user } = useGlobalContext();                         //The component uses two context APIs: useGlobalContext and useUserContext. The useGlobalContext provides access to the user object, while useUserContext provides a way to update the user's response.
  const { updateResponse } = useUserContext(); 

  const [career, setCareer] = useState(user.career || '');     //The component maintains two states: career and isSubmitting. career stores the selected career option, and isSubmitting tracks whether the form is being submitted.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (!career) {                                             // Check if the career field is empty
      Alert.alert("Error", "Please select an option");
      return;
    }
    
    setIsSubmitting(true);     
    try {
      // Update the user's career attribute
      await updateUserAttribute(user.userId, 'career', career);

      // Update the context with the selected career
      updateResponse('career', career);

      // Navigate based on selected career
      switch (career) {
        case 'Student':
          router.replace("/academicPath");
          break;
        case 'Work part-time':
        case 'Work full-time':
          router.replace("/workPositions");
          break;
        case 'Gap year':
          router.replace("/projectType"); 
          break;
        default:
          Alert.alert("Error", "Unexpected career option selected");
          break;
      }
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
        <Image source={stepsBar.Step5}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View>
    <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3  mt-2">What do you do for a living?</Text>
    </View>

    <View className = "w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">   
    <TabsContainer
            value={career}
            handleChangeText={setCareer}                            // Directly update the career state
            mode="selection"
            options={['Student', 'Work part-time', 'Work full-time', 'Gap year']}
            showIcon={false}
            containerStyles="flex-col mt-4"
          /> 
    </View>

    <View className="w-full justify-center min-h-[25vh] px-3 flex-1 mt-2">
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

export default OwnCareer;
