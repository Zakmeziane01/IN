import React, { useState } from 'react';
import { View, Text, ScrollView, Alert,Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import CardButton from '../../components/CardButton';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useUserContext } from '../../context/UserContext';  // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite';

const ProjectType = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext();  // Access updateResponse from user context

  const [projectDivision, setProjectDivision] = useState(user.projectDivision || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handlePress = async () => {
    if (!projectDivision) {
      Alert.alert("Error", "Please select a project type");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the projectDivision attribute in the backend
      await updateUserAttribute(user.userId, 'projectDivision', projectDivision);

      // Update the context with the new value
      updateResponse('projectDivision', projectDivision);

      // Navigate to the next screen
      router.replace("/workforceSize");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card selection
  const handleCardPress = (selectedCard) => {
    setProjectDivision(selectedCard.title);
  };

  // Card options
  const cardOptions = [
    {
      title: 'Short-time project',
      description: 'Looking for someone who’s open to trying new things, thinking creatively, and challenging traditional ideas in your field.',
      selected: projectDivision === 'Short-time project'
    },
    {
      title: 'Long-partnership',
      description: 'Looking for a partner for long-term collaboration, maybe for multiple projects or to build something together over time.',
      selected: projectDivision === 'Long-partnership'
    },
    {
      title: 'Focused specialization',
      description: 'If you need someone with very specific skills or expertise in a particular area to complement your own strengths.',
      selected: projectDivision === 'Focused specialization'
    },
    {
      title: 'Collaborative learning',
      description: 'Looking for someone who is eager to learn and grow alongside you, where the collaboration itself becomes a platform for mutual development.',
      selected: projectDivision === 'Collaborative learning'
    },
  ];

  return (
    <SafeAreaView className="bg-secondary h-full">

    <View className="items-center justify-center">
      <Image source={images.Wlogo}
        resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
    </View>

    <View className="flexGrow-1">
      <ScrollView className="h-full bg-white rounded-[35px]">
        <Image source={stepsBar.Step9}
        resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

    <View>
    <Text className="text-2xl text-secondary text-semibold font-pmedium ml-3.5 mt-3 ">What's Your Looking For?</Text>
    </View>

    <View className = " w-full justify-center min-h-[10vh] px-3 flex-1 mt-8">   
    <CardButton
            cards={cardOptions}
            handleCardPress={handleCardPress}
          />
 
    </View>

    <View className="w-full justify-center px-3 flex-1 mt-3.5">
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


export default ProjectType;
