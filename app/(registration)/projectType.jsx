import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import IconButton from '../../components/IconButton'; 
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
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          marginHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <View className="flex-1 mt-14">
          <Text className="text-2xl font-semibold mb-3">
            What are you looking for?
          </Text>
          
          <CardButton
            cards={cardOptions}
            handleCardPress={handleCardPress}
          />
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <IconButton
          handlePress={handlePress}
          containerStyles="bg-primary rounded-full"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProjectType;
