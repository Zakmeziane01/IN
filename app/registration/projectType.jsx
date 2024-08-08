import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import IconButton from '../../components/IconButton'; 

import { useGlobalContext } from "../../context/GlobalProvider";
import { ProjectChoice } from '../../lib/appwrite';
import CardButton from '../../components/CardButton'; 

const ProjectType = () => {

    const { user } = useGlobalContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        projectDivision: user.projectDivision 
    });
  
    // Function to handle form submission
    const handlePress = async () => {
      if(form.projectDivision === ""){
        Alert.alert("Error", "Please fill the field");
        return;
      }
      
      setIsSubmitting(true);
      try {
        await ProjectChoice(user.$id,form.projectDivision);
        router.replace("");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Handle card selection
    const handleCardPress = (selectedCard) => {
      setForm({ ...form, projectDivision: selectedCard.title });
    };

    // Card options
    const cardOptions = [
      { title: 'Short-term project', description: 'Looking for someone who’s open to trying new things, thinking creatively, and challenging traditional ideas in your field.', selected: form.projectDivision === 'Short-term project' },
      { title: 'Long-term partnership', description: 'Looking for a partner for long-term collaboration, maybe for multiple projects or to build something together over time.', selected: form.projectDivision === 'Long-term partnership' },
      { title: 'Focused specialization', description: 'If you need someone with very specific skills or expertise in a particular area to complement your own strengths.', selected: form.projectDivision === 'Focused specialization' },
      { title: 'Collaborative learning', description: 'Looking for someone who is eager to learn and grow alongside you, where the collaboration itself becomes a platform for mutual development.', selected: form.projectDivision === 'Collaborative learning' },
    ];

    return (
        <SafeAreaView className="h-full">
          <ScrollView>
          <View className="w-full flex justify-center h-full px-4 my-6">
              <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
                What's your looking for?
              </Text>
    
              <CardButton
                title=""
                cards={cardOptions}
                handleCardPress={handleCardPress}
              />
            </View>
          </ScrollView>
    
          <View className="absolute bottom-6 right-7">
            <IconButton
              handlePress={handlePress}
              containerStyles=""
              iconStyles="text-white"
              isLoading={isSubmitting}
            />
          </View>
        </SafeAreaView>
      );
    }

export default ProjectType;
