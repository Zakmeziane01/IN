import { View, Text, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioButton from '../../components/RadioButton';  // Adjust the import path as necessary
import { useGlobalContext } from "../../context/GlobalProvider"; // Assuming you use context for user info
import { router } from "expo-router";
import IconButton from '../../components/iconButton';// Adjust the import path as necessary
import { CollaboratorGender } from '../../lib/appwrite'; 

const GenderCollaborator = () => {
  const { user } = useGlobalContext(); // Get user data from global context
  const [selectedGender, setSelectedGender] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenderSelect = (collabGender) => {
    setSelectedGender(collabGender);
  };

  const handlePress = async () => {
    if (!selectedGender) {
      Alert.alert('Error', 'Please select an option');
      return;
    }

    setIsSubmitting(true);
    try {
      await CollaboratorGender(user.$id, selectedGender);
      router.replace(""); // Replace with the appropriate route
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
      <View className="flex-1 justify-center items-center p-4">
          <Text className="text-2xl font-semibold mt-10 font-psemibold">
            What type of collaborator are looking for 
          </Text>

          <RadioButton
            options={['Male', 'Female', 'Other']}
            selectedOption={selectedGender}
            onOptionSelect={handleGenderSelect}
            containerStyles="mt-7"
            labelStyles="text-white"
          />
      </View>
          
      <View className="absolute bottom-4 right-4">
           <IconButton
            handlePress={handlePress}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
    </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default GenderCollaborator;

