import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserAttribute } from '../../lib/appwrite'; // Updated import
import CardButton from '../../components/CardButton'; 

const ProjectType = () => {
  const { user } = useGlobalContext();
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
      // Update the projectDivision attribute
      await updateUserAttribute(user.$id, 'projectDivision', projectDivision);
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
    { title: 'Short-time project', description: 'Looking for someone who’s open to trying new things, thinking creatively, and challenging traditional ideas in your field.', selected: projectDivision === 'Short-time project' },
    { title: 'Long-partnership', description: 'Looking for a partner for long-term collaboration, maybe for multiple projects or to build something together over time.', selected: projectDivision === 'Long-partnership' },
    { title: 'Focused specialization', description: 'If you need someone with very specific skills or expertise in a particular area to complement your own strengths.', selected: projectDivision === 'Focused specialization' },
    { title: 'Collaborative learning', description: 'Looking for someone who is eager to learn and grow alongside you, where the collaboration itself becomes a platform for mutual development.', selected: projectDivision === 'Collaborative learning' },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
    <ScrollView
     contentContainerStyle={{
       height: "100%",
       marginHorizontal: 20,
       paddingTop:120
    }}
    >
      
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold mt-4 font-psemibold text-center">
            What are you looking for?
          </Text>
          
          <CardButton
            cards={cardOptions}
            handleCardPress={handleCardPress}
          />
        </View>
      </ScrollView>


        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />

    </SafeAreaView>
  );
}

export default ProjectType;
