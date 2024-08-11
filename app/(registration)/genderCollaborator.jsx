import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabsContainer from '../../components/TabsContainer';
import IconButton from '../../components/IconButton'; 
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
    if (collabGender === '') {
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <View>
          <Text className="text-black font-bold text-2xl mb-5">
            What type of collaborator are you looking for?
          </Text>

          <TabsContainer 
            value={collabGender}
            handleChangeText={setCollabGender}
            mode="selection" 
            options={['Male', 'Female', 'Both']} 
            containerStyles="mb-6"
          />
        </View>      


      </ScrollView>

      <IconButton
          handlePress={handlePress}
          containerStyles="self-center mt-10"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
    </SafeAreaView>
  );
};

export default GenderCollaborator;
