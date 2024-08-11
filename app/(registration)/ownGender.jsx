import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';
import { updateUserAttribute } from '../../lib/appwrite';

const OwnGender = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext();

  const [gender, setGender] = useState(user.gender || ''); // Initialize with user's gender or empty string
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handlePress = async () => {
    if (!gender) { // Check if gender is selected
      Alert.alert("Error", "Please select your gender");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update the user's gender attribute
      await updateUserAttribute(user.userId,  'gender', gender);

      // Update the context with the selected gender
      updateResponse('gender', gender);

      router.push("/localization");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: 30,
          justifyContent: 'center', // Center content vertically
          paddingVertical: 20 // Added padding for better spacing
        }}
      >
        <Text className="text-black font-bold text-2xl mb-5">
          Select your gender
        </Text>

        <TabsContainer 
          value={gender}
          handleChangeText={setGender}
          mode="selection"
          options={['Male', 'Female', 'Others']}
          containerStyles="flex-col mt-4"
        />
      </ScrollView>

      <View className="px-4">
        <IconButton
          handlePress={handlePress}
          containerStyles="bg-black mb-4"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default OwnGender;
